import AbstractService from "./AbstractService";
import RoomRepository from "../repository/RoomRepository";
import RoomDTO from "../model/dto/RoomDTO";
import {BadRequestError, NotFoundError, RequestConflictError} from "../util/exception/AWSRoomBookingSystemError";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";

export default class RoomService extends AbstractService {
    private roomRepo: RoomRepository;

    constructor(roomRepo: RoomRepository) {
        super();
        this.roomRepo = roomRepo;
    }

    public async getAll(): Promise<RoomDTO[]> {
        // TODO: current user role check - admin only
        return await this.roomRepo.findAll();
    }

    public async getById(id: number): Promise<RoomDTO> {
        if (isNaN(id)) {
            throw new BadRequestError("invalid room ID");
        }
        return await this.roomRepo.findById(id);
    }

    public async create(dto: RoomDTO): Promise<RoomDTO> {
        // TODO: current user role check - admin only
        await this.validateDTO(dto);
        try {
            return await this.roomRepo.create(dto);
        } catch (error) {
            this.handlePrismaClientKnownRequestError(error, dto);
            throw error;
        }
    }

    public async update(id: number, dto: RoomDTO): Promise<RoomDTO> {
        // TODO: current user role check - admin only
        if (isNaN(id)) {
            throw new BadRequestError("invalid room ID");
        }
        await this.validateDTO(dto);
        try {
            return await this.roomRepo.updateById(id, dto);
        } catch (error) {
            this.handlePrismaClientKnownRequestError(error, dto);
            throw error;
        }
    }

    private handlePrismaClientKnownRequestError(error: unknown, dto: RoomDTO) {
        if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                throw new RequestConflictError(`room ${dto.roomCode} already exists on the same building and floor`);
            }
            if (error.code === "P2003") {
                throw new NotFoundError(`building does not exist`);
            }
        }
        throw error;
    }
}
