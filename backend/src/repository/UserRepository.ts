import AbstractRepository from "./AbstractRepository";
import UserDTO from "../model/dto/UserDTO";
import {PrismaClient} from "@prisma/client/extension";
import {toUserDTO} from "../util/Mapper/UserMapper";
import {NotFoundError, UnauthorizedError} from "../util/exception/AWSRoomBookingSystemError";
import {jwtDecode} from "jwt-decode";
import jwt from 'jsonwebtoken';

/*
For reference from Prisma schema:
model users {
user_id        Int              @id @default(autoincrement())
username       String           @unique
first_name     String
last_name      String
email          String           @unique
building_id    Int
floor          Int
desk           Int
role           role
is_active      Boolean
bookings       bookings[]
buildings      buildings        @relation(fields: [building_id], references: [building_id], onDelete: NoAction, onUpdate: NoAction)
users_bookings users_bookings[]
}
*/

interface GoogleUser {
    email: string;
    name: string;
    given_name: string;
    family_name: string;
}

export default class UserRepository extends AbstractRepository {
    constructor(database: PrismaClient) {
        super(database);
    }

    public async findAll(): Promise<UserDTO[]> {
        const userList = await this.db.users.findMany({
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
            userDTOs.push(toUserDTO(user, user.buildings.cities, user.buildings));
        }
        return userDTOs;
    }

    public async findById(id: number): Promise<UserDTO> {
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
        console.log("In userRepo.validateGoogleToken")
        //Decode the JWT token received from Google
        const decodedUserInfo: GoogleUser = jwtDecode(googleToken);
        console.log(decodedUserInfo)
        if (!decodedUserInfo) {
            throw new Error("Invalid token");
        }

        // fetch the user by email
        let user: UserDTO;
        try {
            user = await this.findByEmail(decodedUserInfo.email);
            console.log(JSON.stringify(user));
        } catch (error){
            if (error instanceof NotFoundError) {
                // assuming if user is not found we throw an UnauthorizedError
                return Promise.reject(new UnauthorizedError(`User ${decodedUserInfo.email} is not authorized`));
            } else {
                return Promise.reject(error);
            }
        }
        // Return the user data
        console.log(JSON.stringify(user));
        return user;
    }

    public async generateJwtToken(userDTO: UserDTO): Promise<string> {
        // return Promise.resolve("1234")
        const payload = JSON.stringify(UserDTO); //payload:undefined
        // const token = jwt.sign({payload}, 'my_secret_key');
        return new Promise((resolve, reject) => {
            jwt.sign(payload, 'my_secret_key', { expiresIn: '1h' }, (err, token) => {
                if (err) {
                    reject(err);
                } else {
                    // @ts-ignore
                    resolve(token);
                }
            });
        });
    }
}
