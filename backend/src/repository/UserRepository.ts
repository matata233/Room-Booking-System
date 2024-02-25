import AbstractRepository from "./AbstractRepository";
import AbstractDTO from "../model/dto/AbstractDTO";
import UserDTO from "../model/dto/UserDTO";
import {PrismaClient} from "@prisma/client/extension";
import {toUserDTO} from "../util/Mapper/UserMapper";
import {role} from "@prisma/client";
import {jwtDecode} from "jwt-decode";

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

    findById(id: number): Promise<AbstractDTO | null> {
        return Promise.reject(undefined);
    }

    public async validateGoogleToken(googleToken: string): Promise<UserDTO> {
        try {
            //Decode the JWT token received from Google
            const decodedUserInfo: GoogleUser = jwtDecode(googleToken);
            if (!decodedUserInfo) {
                throw new Error("Invalid token");
            }

            // Attempt to fetch the user by email

            // // If user doesn't exist, create a new user
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

    public async generateJwtToken(userDTO: UserDTO): Promise<string> {
        return Promise.reject("Not implemented");
    }
}
