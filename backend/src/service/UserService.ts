import AbstractService from "./AbstractService";
import UserDTO from "../model/dto/UserDTO";
import AbstractDTO from "../model/dto/AbstractDTO";
import UserRepository from "../repository/UserRepository";
import { jwtDecode } from "jwt-decode";
import { PrismaClient } from "@prisma/client";

interface GoogleUser {
    email: string;
    name: string;
    given_name?: string;
    family_name?: string;
}

const prisma = new PrismaClient();

export default class UserService extends AbstractService {
    private userRepo: UserRepository;

    constructor(userRepo: UserRepository) {
        super();
        this.userRepo = userRepo;
    }

    public async getAll(): Promise<UserDTO[]> {
        return Promise.reject("Not implemented");
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
                throw new Error('Invalid token');
            }

            // Attempt to fetch the user by email
            let user = await prisma.user.findUnique({
                where: {
                    email: decodedUserInfo.email
                }
            });

            // If user doesn't exist, create a new user
            if (!user) {
                user = await prisma.user.create({
                    data: {
                        email: decodedUserInfo.email,
                        firstName: decodedUserInfo.given_name,
                        lastName: decodedUserInfo.family_name,
                        isActive: true,
                    }
                })
            }

            // Return the user data
            return user;
        } catch (error) {
            console.error('Error validating Google token:', error);
            throw error;
        }
    }

    // Leave generateJwtToken as a stub for now
    public async generateJwtToken(userDTO: UserDTO): Promise<string> {
        return Promise.reject("Not implemented");
    }
}
