import AbstractService from "./AbstractService";
import BuildingRepository from "../repository/BuildingRepository";
import BuildingDTO from "../model/dto/BuildingDTO";

export default class BuildingService extends AbstractService {
    private buildingRepo: BuildingRepository; // The repository for the Building model

    constructor(buildingRepo: BuildingRepository) {
        super();
        this.buildingRepo = buildingRepo;
    }

    public async getAll(): Promise<BuildingDTO[]> {
        return this.buildingRepo.findAll(); // Get all buildings. Data type: BuildingDTO[]
    }

    public getById(id: number): Promise<BuildingDTO> {
        return this.buildingRepo.findById(id);
    }

    public create(dto: BuildingDTO): Promise<BuildingDTO> {
        return Promise.reject("Not implemented");
    }

    public update(id: number, dto: BuildingDTO): Promise<BuildingDTO> {
        return Promise.reject("Not implemented");
    }
}
