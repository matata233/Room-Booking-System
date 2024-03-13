import AbstractService from "./AbstractService";
import UserDTO from "../model/dto/UserDTO";
import AbstractDTO from "../model/dto/AbstractDTO";
import UserRepository from "../repository/UserRepository";
import {BadRequestError, NotFoundError, UnauthorizedError} from "../util/exception/AWSRoomBookingSystemError";
import {jwtDecode} from "jwt-decode";
import jwt from "jsonwebtoken";

interface GoogleUser {
    email: string;
    name: string;
    given_name: string;
    family_name: string;
    exp: number;
}

export default class UserService extends AbstractService {
    private userRepo: UserRepository;

    constructor(userRepo: UserRepository) {
        super();
        this.userRepo = userRepo;
    }

    public async getAll(): Promise<UserDTO[]> {
        return this.userRepo.findAll();
    }

    public async getAllEmail(): Promise<UserDTO[]> {
        return this.userRepo.findAllEmail();
    }

    public async getById(id: number): Promise<UserDTO> {
        return this.userRepo.findById(id);
    }

    public async getByEmail(email: string): Promise<UserDTO> {
        return this.userRepo.findByEmail(email);
    }

    public async create(user: UserDTO): Promise<UserDTO> {
        if (!user.username && typeof user.username !== "string") {
            throw new BadRequestError("Invalid username");
        }
        if (!user.firstName && typeof user.firstName !== "string") {
            throw new BadRequestError("Invalid first name");
        }
        if (!user.lastName && typeof user.lastName !== "string") {
            throw new BadRequestError("Invalid last name");
        }
        if (!user.email && typeof user.email !== "string") {
            throw new BadRequestError("Invalid email");
        }
        if (!user.floor && typeof user.floor !== "number") {
            throw new BadRequestError("Invalid floor");
        }
        if (!user.desk && typeof user.desk !== "number") {
            throw new BadRequestError("Invalid desk");
        }
        return this.userRepo.create(user);
    }

    // Update user details
    public async update(userID: number, user: UserDTO): Promise<UserDTO> {
        if (!user.username && typeof user.username !== "string") {
            throw new BadRequestError("Invalid username");
        }
        if (!user.firstName && typeof user.firstName !== "string") {
            throw new BadRequestError("Invalid first name");
        }
        if (!user.lastName && typeof user.lastName !== "string") {
            throw new BadRequestError("Invalid last name");
        }
        if (!user.email && typeof user.email !== "string") {
            throw new BadRequestError("Invalid email");
        }
        if (!user.floor && typeof user.floor !== "number") {
            throw new BadRequestError("Invalid floor");
        }
        if (!user.desk && typeof user.desk !== "number") {
            throw new BadRequestError("Invalid desk");
        }
        return this.userRepo.update(userID, user);
    }

    public login = async (googleToken: string): Promise<string> => {
        const userData = await this.validateGoogleToken(googleToken, this.userRepo);
        const token = await this.generateJwtToken(userData);
        return token;
    };

    private validateGoogleToken = async (googleToken: string, userRepo: UserRepository): Promise<UserDTO> => {
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
            user = await userRepo.findByEmail(decodedUserInfo.email);
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
    };

    private generateJwtToken = async (userDTO: UserDTO): Promise<string> => {
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
    };
}
