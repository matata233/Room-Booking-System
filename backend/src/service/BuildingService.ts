import AbstractService from "./AbstractService";
import BuildingRepository from "../repository/BuildingRepository";
import BuildingDTO from "../model/dto/BuildingDTO";
import {BadRequestError, NotFoundError, RequestConflictError} from "../util/exception/AWSRoomBookingSystemError";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";

export default class BuildingService extends AbstractService {
    private buildingRepo: BuildingRepository;

    constructor(buildingRepo: BuildingRepository) {
        super();
        this.buildingRepo = buildingRepo;
    }

    public async getAll(): Promise<BuildingDTO[]> {
        return this.buildingRepo.findAll();
    }

    public getById(id: number): Promise<BuildingDTO> {
        if (isNaN(id)) {
            throw new BadRequestError("invalid building ID");
        }
        return this.buildingRepo.findById(id);
    }

    public async create(dto: BuildingDTO): Promise<BuildingDTO> {
        await this.validateDTO(dto);
        try {
            return await this.buildingRepo.create(dto);
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    throw new RequestConflictError(`building ${dto.code} already exists in ${dto.city?.cityId}`);
                }
                if (error.code === "P2003") {
                    throw new NotFoundError(`city ${dto.city?.cityId} does not exist`);
                }
            }
            throw error;
        }
    }

    public update(id: number, dto: BuildingDTO): Promise<BuildingDTO> {
        return Promise.reject("Not implemented");
    }
}
