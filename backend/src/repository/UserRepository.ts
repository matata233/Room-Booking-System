import AbstractRepository from "./AbstractRepository";
import UserDTO from "../model/dto/UserDTO";
import {PrismaClient} from "@prisma/client/extension";
import {toUserDTO} from "../util/Mapper/UserMapper";
import {NotFoundError, UnauthorizedError} from "../util/exception/AWSRoomBookingSystemError";
import {jwtDecode} from "jwt-decode";
import jwt from "jsonwebtoken";
import {bookings} from "@prisma/client";
import BuildingDTO from "../model/dto/BuildingDTO";
import CityDTO from "../model/dto/CityDTO";

interface GoogleUser {
    email: string;
    name: string;
    given_name: string;
    family_name: string;
    exp: number;
}

// The repository for the User model class that extends the AbstractRepository class
export default class UserRepository extends AbstractRepository {
    constructor(database: PrismaClient) {
        // The PrismaClient instance
        super(database);
    }

    public async findAll(): Promise<UserDTO[]> {
        const userList = await this.db.users.findMany({
            // Get all users. users is the table name in the database.
            include: {
                buildings: {
                    include: {
                        cities: true
                    }
                }
            }
        });

        const userDTOs: UserDTO[] = [];
        for (const user of userList) {
            // toUserDTO is a function that maps the user to the UserDTO
            userDTOs.push(toUserDTO(user, user.buildings.cities, user.buildings));
        }
        return userDTOs;
    }

    public async findById(id: number): Promise<UserDTO> {
        // find the user by id and include the building and city
        const user = await this.db.users.findUnique({
            where: {
                user_id: id
            },
            include: {
                buildings: {
                    include: {
                        cities: true
                    }
                }
            }
        });

        if (!user) {
            //not found
            return Promise.reject(new NotFoundError(`User not found with id: ${id}`));
        }
        const userDTO = toUserDTO(user, user.buildings.cities, user.buildings);

        return userDTO;
    }

    public async findByEmail(email: string): Promise<UserDTO> {
        const user = await this.db.users.findUnique({
            where: {
                email: email
            },
            include: {
                buildings: {
                    include: {
                        cities: true
                    }
                }
            }
        });

        if (!user) {
            return Promise.reject(new NotFoundError(`User not found with email: ${email}`));
        }

        const userDTO = toUserDTO(user, user.buildings.cities, user.buildings);
        return userDTO;
    }

    public async validateGoogleToken(googleToken: string): Promise<UserDTO> {
        const decodedUserInfo: GoogleUser = jwtDecode(googleToken);
        if (!decodedUserInfo) {
            return Promise.reject(new UnauthorizedError(`Invalid token`));
        }
        if (Date.now() >= decodedUserInfo.exp * 1000) {
            return Promise.reject(new UnauthorizedError(`Expired token`));
        }
        // fetch the user by email
        let user: UserDTO;
        try {
            user = await this.findByEmail(decodedUserInfo.email);
        } catch (error) {
            if (error instanceof NotFoundError) {
                return Promise.reject(new UnauthorizedError(`User ${decodedUserInfo.email} is not authorized`));
            } else {
                return Promise.reject(error);
            }
        }
        //reject authorization for inactive users
        if (!user.isActive) {
            return Promise.reject(new UnauthorizedError(`User ${decodedUserInfo.email} is no longer active`));
        }
        // Return the user data
        return user;
    }

    public async generateJwtToken(userDTO: UserDTO): Promise<string> {
        const payload = {
            userId: userDTO.userId,
            username: userDTO.username,
            firstName: userDTO.firstName,
            lastName: userDTO.lastName,
            email: userDTO.email,
            floor: userDTO.floor,
            desk: userDTO.desk,
            isActive: userDTO.isActive,
            role: userDTO.role
        };
        return new Promise((resolve, reject) => {
            jwt.sign(payload, "my_secret_key", {expiresIn: "1h"}, (err, token) => {
                if (err || !token) {
                    reject(err);
                } else {
                    resolve(token);
                }
            });
        });
    }
    //Helper function that decodes our token and checks if role == admin
    public async validateAdmin(token: string): Promise<boolean> {
        const user: UserDTO = jwtDecode(token);
        if (user.role === "admin") {
            return Promise.resolve(true);
        }
        return Promise.reject(new UnauthorizedError(`User ${user.email} is not an admin`));
    }
    //Helper function that decodes our token and checks if role == admin or role == user
    public async validateUser(token: string): Promise<boolean> {
        const user: UserDTO = jwtDecode(token);
        //either admin or staff will be authorized
        if (user.role === "admin" || user.role === "staff") {
            return Promise.resolve(true);
        }
        return Promise.reject(new UnauthorizedError(`User ${user.email} is not an admin`));
    }

    // user creation
    public async create(
        username: string,
        firstName: string,
        lastName: string,
        email: string,
        floor: number,
        desk: number,
        building: number
    ): Promise<UserDTO> {
        // create a new user in the database by calling the PrismaClient create method
        const newUser = await this.db.users.create({
            data: {
                username: username,
                first_name: firstName,
                last_name: lastName,
                email: email,
                building_id: building,
                floor: floor,
                desk: desk,
                role: "staff",
                is_active: true,
                bookings: {
                    create: [] // Create an empty array of bookings. New users have no bookings
                },
                events: {
                    create: [] // Create an empty array of events. New users have no events
                }
            }
        });
        // get the building and city details for the user using the building_id
        const getBuilding = await this.db.buildings.findUnique({
            where: {
                building_id: building
            },
            include: {
                cities: true
            }
        });

        const newUserDTO = getBuilding ? toUserDTO(newUser, getBuilding.cities, getBuilding) : ({} as UserDTO);
        return newUserDTO;
    }
}
