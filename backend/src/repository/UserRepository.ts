import AbstractRepository from "./AbstractRepository";
import AbstractDTO from "../model/dto/AbstractDTO";
import UserDTO from "../model/dto/UserDTO";
import {PrismaClient} from "@prisma/client/extension";

export default class UserRepository extends AbstractRepository {
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
            // userDTOs.push(user);
        }
        return userDTOs;
    }

    findById(id: number): Promise<AbstractDTO | null> {
        return Promise.reject(undefined);
    }
}
