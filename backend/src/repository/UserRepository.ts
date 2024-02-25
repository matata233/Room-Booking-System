import AbstractRepository from "./AbstractRepository";
import AbstractDTO from "../model/dto/AbstractDTO";
import UserDTO from "../model/dto/UserDTO";
import {PrismaClient} from "@prisma/client/extension";
import {toUserDTO} from "../util/Mapper/UserMapper";
import {NotFoundError, UnauthorizedError} from "../util/exception/AWSRoomBookingSystemError";
import ResponseCodeMessage from "../util/enum/ResponseCodeMessage";

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
            throw new NotFoundError(`User not found with email: ${email}`);
        }

        const userDTO = toUserDTO(user, user.buildings.cities, user.buildings);
        return userDTO;
    }
}
