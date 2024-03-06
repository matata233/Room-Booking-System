import AbstractService from "./AbstractService";
import RoomRepository from "../repository/RoomRepository";
import RoomDTO from "../model/dto/RoomDTO";

export default class RoomService extends AbstractService {
    private roomRepo: RoomRepository; // The repository for the Room model

    constructor(roomRepo: RoomRepository) {
        super();
        this.roomRepo = roomRepo;
    }

    public getAll(): Promise<RoomDTO[]> {
        //TODO: current user role check - admin only
        return this.roomRepo.findAll(); // Get all rooms. Data type: RoomDTO[]
    }

    public getById(id: number): Promise<RoomDTO> {
        return this.roomRepo.findById(id);
    }

    public create(dto: RoomDTO): Promise<RoomDTO> {
        return Promise.reject("Not implemented");
    }

    public update(id: number, dto: RoomDTO): Promise<RoomDTO> {
        return Promise.reject("Not implemented");
    }
}
