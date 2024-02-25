import AbstractRepository from "./AbstractRepository";
import AbstractDTO from "../model/dto/AbstractDTO";
import UserDTO from "../model/dto/UserDTO";
import {PrismaClient} from "@prisma/client/extension";
import {toUserDTO} from "../util/Mapper/UserMapper";

export default class UserRepository extends AbstractRepository {
    // The repository for the User model. This class is responsible for handling all database operations for the User model.
    constructor(database: PrismaClient) {
        super(database);
    }

    public async findAll(): Promise<UserDTO[]> {
        const userList = await this.db.users.findMany({
            include: {
                bookings: {
                    include: {
                        bookings_rooms: true
                    }
                }
            }
        });

        const userDTOs: UserDTO[] = [];
        for (const user of userList) {
            userDTOs.push(toUserDTO(user, user.bookings));
        }
        return userDTOs;
    }

    findById(id: number): Promise<AbstractDTO | null> {
        return Promise.reject(undefined);
    }
}
