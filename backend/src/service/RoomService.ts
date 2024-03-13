import AbstractService from "./AbstractService";
import RoomRepository from "../repository/RoomRepository";
import RoomDTO from "../model/dto/RoomDTO";
import BuildingRepository from "../repository/BuildingRepository";
import {BadRequestError} from "../util/exception/AWSRoomBookingSystemError";

export default class RoomService extends AbstractService {
    private roomRepo: RoomRepository; // The repository for the Room model
    private bldgRepo: BuildingRepository;

    constructor(roomRepo: RoomRepository, bldgRepo: BuildingRepository) {
        super();
        this.roomRepo = roomRepo;
        this.bldgRepo = bldgRepo;
    }

    public getAll(): Promise<RoomDTO[]> {
        //TODO: current user role check - admin only
        return this.roomRepo.findAll(); // Get all rooms. Data type: RoomDTO[]
    }

    public getById(id: number): Promise<RoomDTO> {
        return this.roomRepo.findById(id);
    }

    public async create(dto: RoomDTO): Promise<RoomDTO> {
        if (!dto.building || !dto.building.buildingId) {
            throw new BadRequestError("Invalid building ID");
        }
        try {
            await this.bldgRepo.findById(dto.building.buildingId);
        } catch (e) {
            throw new BadRequestError("Building does not exist");
        }
        if (typeof dto.floorNumber !== "number") {
            throw new BadRequestError("Invalid floor number");
        }
        if (typeof dto.roomCode !== "string") {
            throw new BadRequestError("Invalid room code");
        }
        if (typeof dto.roomName !== "string" && dto.roomName !== null) {
            throw new BadRequestError("Invalid room name");
        }
        if (typeof dto.numberOfSeats !== "number") {
            throw new BadRequestError("Invalid number of seats");
        }
        if (!Array.isArray(dto.equipmentList)) {
            throw new BadRequestError("Invalid equipment list");
        }
        for (const equipment of dto.equipmentList) {
            if (typeof equipment.equipmentId !== "string" || !["AV", "VC"].includes(equipment.equipmentId)) {
                throw new BadRequestError("Invalid equipment id");
            }
        }
        if (typeof dto.isActive !== "boolean") {
            throw new BadRequestError("Invalid is active");
        }
        try {
            return await this.roomRepo.create(dto);
        } catch (e) {
            throw new BadRequestError("Room already exists");
        }
    }

    public update(id: number, dto: RoomDTO): Promise<RoomDTO> {
        if (dto.floorNumber !== undefined && typeof dto.floorNumber !== "number") {
            throw new BadRequestError("Invalid floor number");
        }
        if (dto.roomCode !== undefined && typeof dto.roomCode !== "string") {
            throw new BadRequestError("Invalid room code");
        }
        if (dto.roomName !== undefined && typeof dto.roomName !== "string") {
            throw new BadRequestError("Invalid room name");
        }
        if (dto.numberOfSeats !== undefined && typeof dto.numberOfSeats !== "number") {
            throw new BadRequestError("Invalid number of seats");
        }
        if (dto.equipmentList !== undefined) {
            if (!Array.isArray(dto.equipmentList)) {
                throw new BadRequestError("Invalid equipment list");
            }
            for (const equipment of dto.equipmentList) {
                if (typeof equipment.equipmentId !== "string") {
                    throw new BadRequestError("Invalid equipment id");
                }
                if (!["AV", "VC"].includes(equipment.equipmentId)) {
                    throw new BadRequestError("Invalid equipment id");
                }
            }
        }
        if (dto.isActive !== undefined && typeof dto.isActive !== "boolean") {
            throw new BadRequestError("Invalid active status");
        }
        return this.roomRepo.updateById(id, dto);
    }
}
