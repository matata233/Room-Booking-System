import UserDTO from "../model/dto/UserDTO";
import {jwtDecode} from "jwt-decode";
import jwt, {JsonWebTokenError} from "jsonwebtoken";
import {NotFoundError, UnauthorizedError} from "./exception/AWSRoomBookingSystemError";
import UserRepository from "../repository/UserRepository";
import {role} from "@prisma/client";
import { OAuth2Client } from 'google-auth-library';

interface GoogleUser {
    email: string;
    name: string;
    given_name: string;
    family_name: string;
    exp: number;
}

export default class Authenticator {
    private static instance: Authenticator;
    private readonly userRepo: UserRepository;

    private constructor(userRepo: UserRepository) {
        this.userRepo = userRepo;
    }

    public static getInstance(userRepo: UserRepository): Authenticator {
        if (!Authenticator.instance) {
            Authenticator.instance = new Authenticator(userRepo);
        }
        return Authenticator.instance;
    }

    public isAdmin = (userDTO: UserDTO) => {
        return userDTO.role === role.admin;
    };

    public isStaff = (userDTO: UserDTO) => {
        return userDTO.role === role.staff || userDTO.role === role.admin;
    };

    public getCurrentUser = async (header: string | undefined): Promise<UserDTO> => {
        if (!header || !header.startsWith("Bearer ")) {
            return Promise.reject(new UnauthorizedError("No token provided or token does not have Bearer prefix"));
        }
        const token = header.substring(7);
        try {
            const payload = jwt.verify(token, "my_secret_key");
            if (typeof payload === "object" && payload !== null && "email" in payload) {
                return await this.fetchUserByEmail(payload.email);
            } else {
                throw new UnauthorizedError("Token payload does not include email");
            }
        } catch (error) {
            if (error instanceof JsonWebTokenError) {
                throw new UnauthorizedError(error.message);
            } else {
                throw error;
            }
        }
    };

    public login = async (googleToken: string): Promise<string> => {
        const userData = await this.validateGoogleToken(googleToken);
        return await this.generateJwtToken(userData);
    };

    private verifyIdToken = async (idToken: string): Promise<boolean> => {
        const CLIENT_ID: string = '682437365013-hcj4g0l2c042umnvr28kbikenhnjrrre.apps.googleusercontent.com';
        const client = new OAuth2Client(CLIENT_ID);
        try {
            const ticket = await client.verifyIdToken({
                idToken,
                audience: CLIENT_ID,
            });
            console.log(ticket);
            const payload = ticket.getPayload();
            console.log(payload);
            return Promise.resolve(true);
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    }

    private validateGoogleToken = async (googleToken: string): Promise<UserDTO> => {
        const decodedUserInfo: GoogleUser = jwtDecode(googleToken);
        if (!decodedUserInfo) {
            return Promise.reject(new UnauthorizedError(`Invalid token`));
        }
        if (Date.now() >= decodedUserInfo.exp * 1000) {
            return Promise.reject(new UnauthorizedError(`Expired token`));
        }
        try {
            await this.verifyIdToken(googleToken);
        }catch (error){
            return Promise.reject(error);
        }
        // fetch the user by email
        return await this.fetchUserByEmail(decodedUserInfo.email);
    };

    private fetchUserByEmail = async (email: string) => {
        // fetch the user by email
        let user: UserDTO;
        try {
            user = await this.userRepo.findByEmail(email);
        } catch (error) {
            if (error instanceof NotFoundError) {
                return Promise.reject(new UnauthorizedError(`User ${email} is not authorized`));
            } else {
                return Promise.reject(error);
            }
        }
        //reject authorization for inactive users
        if (!user.isActive) {
            return Promise.reject(new UnauthorizedError(`User ${email} is no longer active`));
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
