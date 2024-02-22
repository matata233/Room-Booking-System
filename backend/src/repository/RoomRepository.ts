import AbstractRepository from "./AbstractRepository";
import RoomDTO from "../model/dto/RoomDTO";
import {toRoomDTO} from "../util/Mapper/RoomMapper";
import {PrismaClient} from "@prisma/client";

export default class RoomRepository extends AbstractRepository {
    constructor(database: PrismaClient) {
        super(database);
    }

    public async findAll(): Promise<RoomDTO[]> {
        const roomList = await this.db.rooms.findMany({
            include: {
                buildings: {
                    include: {
                        cities: true
                    }
                },
                bookings_rooms: {
                    include: {
                        bookings: true
                    }
                },
                rooms_equipments: {
                    include: {
                        equipments: true
                    }
                }
            }
        });
        const roomDTOs: RoomDTO[] = [];
        for (const room of roomList) {
            roomDTOs.push(toRoomDTO(room, room.buildings.cities, room.buildings, room.rooms_equipments));
        }
        return roomDTOs;
    }

    public findById(id: number): Promise<RoomDTO | null> {
        return Promise.reject(undefined);
    }
}
