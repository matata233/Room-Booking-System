import AbstractService from "./AbstractService";
import UserDTO from "../model/dto/UserDTO";
import AbstractDTO from "../model/dto/AbstractDTO";
import UserRepository from "../repository/UserRepository";
import {jwtDecode} from "jwt-decode";
import {PrismaClient} from "@prisma/client";
import {role} from "@prisma/client";

interface GoogleUser {
    email: string;
    name: string;
    given_name: string;
    family_name: string;
}

const prisma = new PrismaClient();

export default class UserService extends AbstractService {
    private userRepo: UserRepository; // The repository for the User model

    constructor(userRepo: UserRepository) {
        super();
        this.userRepo = userRepo;
    }

    public async getAll(): Promise<UserDTO[]> {
        return this.userRepo.findAll(); // Get all users. Data type: UserDTO[]
    }

    public async getById(id: number): Promise<UserDTO> {
        return Promise.reject("Not implemented");
    }

    create(dto: AbstractDTO): Promise<AbstractDTO> {
        return Promise.reject("Not implemented");
    }

    update(id: number, dto: AbstractDTO): Promise<AbstractDTO> {
        return Promise.reject("Not implemented");
    }

    public async validateGoogleToken(googleToken: string): Promise<UserDTO> {
        try {
            //Decode the JWT token received from Google
            const decodedUserInfo: GoogleUser = jwtDecode(googleToken);
            if (!decodedUserInfo) {
                throw new Error("Invalid token");
            }

            // Attempt to fetch the user by email
            const user = await prisma.users.findUnique({
                where: {
                    email: decodedUserInfo.email
                }
            });

            // If user doesn't exist, create a new user
            // if (!user) {
            //     user = await prisma.users.create({
            //         data: {
            //             user_id: 1,
            //             email: decodedUserInfo.email,
            //             first_name: decodedUserInfo.given_name,
            //             last_name: decodedUserInfo.family_name,
            //             is_active: true,
            //             role: role.staff //default to giving staff (user) privileges?
            //         }
            //     });
            // }
            //
            // // Return the user data
            // return user;
            return Promise.reject("Not implemented");
        } catch (error) {
            console.error("Error validating Google token:", error);
            throw error;
        }
    }

    // Leave generateJwtToken as a stub for now
    public async generateJwtToken(userDTO: UserDTO): Promise<string> {
        return Promise.reject("Not implemented");
    }
}
