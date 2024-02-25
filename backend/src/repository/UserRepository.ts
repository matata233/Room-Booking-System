import AbstractRepository from "./AbstractRepository";
import AbstractDTO from "../model/dto/AbstractDTO";
import UserDTO from "../model/dto/UserDTO";
import {PrismaClient} from "@prisma/client/extension";
import {toUserDTO} from "../util/Mapper/UserMapper";

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
        // const userList = await this.db.users.findMany({
        //     include: {
        //         bookings: {
        //             include: {
        //                 bookings_rooms: true
        //             }
        //         }
        //     }
        // });
        const userList = await this.db.users.findMany();

        const userDTOs: UserDTO[] = [];
        // for (const user of userList) {
        //     userDTOs.push(toUserDTO(user, user.bookings));
        // }
        for (const user of userList) {
            userDTOs.push(toUserDTO(user));
        }
        return userDTOs;
    }

    findById(id: number): Promise<AbstractDTO | null> {
        return Promise.reject(undefined);
    }
}
