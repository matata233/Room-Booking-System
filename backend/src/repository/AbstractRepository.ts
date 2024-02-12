import {AbstractDTO} from "../model/dto/AbstractDTO";
//TODO: Once prisma is set there will be changed here
export abstract class AbstractRepository {

    public async findAll(): Promise<AbstractDTO[]> {
        return Promise.reject("Not implement");
    }

    public async findById(id: number): Promise<AbstractDTO> {
        return Promise.reject("Not implement");
    }

    public async create(abstractDTO: AbstractDTO): Promise<AbstractDTO> {
        return Promise.reject("Not implement");
    }
}