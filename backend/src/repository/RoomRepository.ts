import AbstractRepository from "./AbstractRepository";
import RoomDTO from "../model/dto/RoomDTO";
import {toRoomDTO} from "../util/Mapper/RoomMapper";
import {PrismaClient} from "@prisma/client";
import {NotFoundError, RequestConflictError} from "../util/exception/AWSRoomBookingSystemError";

export default class RoomRepository extends AbstractRepository {
    /**
     * Constructs a new instance of the RoomRepository class.
     * The PrismaClient instance used for database operations.
     */
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
        // Convert each room to a RoomDTO and add it to the array
        for (const room of roomList) {
            roomDTOs.push(toRoomDTO(room, room.buildings.cities, room.buildings, room.rooms_equipments));
        }
        return roomDTOs;
    }

    public async findById(id: number): Promise<RoomDTO> {
        const room = await this.db.rooms.findUnique({
            where: {
                room_id: id
            },
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

        if (!room) {
            return Promise.reject(new NotFoundError(`room does not exist`));
        }

        const roomDTO = toRoomDTO(room, room.buildings.cities, room.buildings, room.rooms_equipments);
        return roomDTO;
    }

    public async create(dto: RoomDTO): Promise<RoomDTO> {
        const newRoom = await this.db.$transaction(async (tx) => {
            const roomAdded = await tx.rooms.create({
                data: {
                    building_id: dto.building!.buildingId!,
                    floor: dto.floorNumber!,
                    code: dto.roomCode!,
                    name: dto.roomName!,
                    seats: dto.numberOfSeats!,
                    is_active: dto.isActive!
                }
            });

            const equipmentPromises = dto.equipmentList!.map((equipment) =>
                tx.rooms_equipments.create({
                    data: {
                        room_id: roomAdded.room_id,
                        equipment_id: equipment.equipmentId!
                    }
                })
            );

            await Promise.all(equipmentPromises);

            return roomAdded;
        });

        const roomDTO = new RoomDTO();
        roomDTO.roomId = newRoom.room_id;
        console.log("Room created: ", roomDTO);
        return roomDTO;
    }

    public async updateById(id: number, dto: RoomDTO): Promise<RoomDTO> {
        return await this.db.$transaction(async (tx) => {
            const existingRoom = await tx.rooms.findUnique({
                where: {room_id: id}
            });

            if (!existingRoom) {
                return Promise.reject(new NotFoundError(`room does not exist`));
            }

            const updateData: any = {};
            if (dto.building?.buildingId !== undefined) {
                updateData.building_id = dto.building.buildingId;
            }
            if (dto.floorNumber !== undefined) {
                updateData.floor = dto.floorNumber;
            }
            if (dto.roomCode !== undefined) {
                updateData.code = dto.roomCode;
            }
            if (dto.roomName !== undefined) {
                updateData.name = dto.roomName;
            }
            if (dto.numberOfSeats !== undefined) {
                updateData.seats = dto.numberOfSeats;
            }
            if (dto.isActive !== undefined) {
                updateData.is_active = dto.isActive;
            }

            if (dto.equipmentList) {
                updateData.rooms_equipments = {
                    deleteMany: {},
                    create: dto.equipmentList.map((equipment) => ({
                        equipment_id: equipment.equipmentId!
                    }))
                };
            }

            if (dto.building?.buildingId || dto.floorNumber || dto.roomCode) {
                const conflictWhereClause: any = {
                    NOT: {room_id: id} // Exclude the current room
                };

                conflictWhereClause.building_id = dto.building?.buildingId
                    ? dto.building.buildingId
                    : existingRoom.building_id;
                conflictWhereClause.floor = dto.floorNumber ? dto.floorNumber : existingRoom.floor;
                conflictWhereClause.code = dto.roomCode ? dto.roomCode : existingRoom.code;

                const conflictRoom = await tx.rooms.findFirst({
                    where: conflictWhereClause
                });

                if (conflictRoom) {
                    throw new RequestConflictError(`room ${dto.roomCode} already exists on that floor`);
                }
            }

            const updatedRoom = await tx.rooms.update({
                where: {room_id: id},
                data: updateData,
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
            return toRoomDTO(
                updatedRoom,
                updatedRoom.buildings.cities,
                updatedRoom.buildings,
                updatedRoom.rooms_equipments
            );
        });
    }
}
