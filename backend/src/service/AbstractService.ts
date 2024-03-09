import AbstractDTO from "../model/dto/AbstractDTO";

export default abstract class AbstractService {
    // you may need more than one repository, e.g. booking

    public abstract getAll(): Promise<AbstractDTO[]>;

    public abstract getById(id: number): Promise<AbstractDTO>;

    // public abstract create(dto: AbstractDTO): Promise<AbstractDTO>;
    // Ethan: currently I passed parameters from res.body directly to the repository. I will refactor later
    public abstract create(
        username: string,
        firstName: string,
        lastName: string,
        email: string,
        floor: number,
        desk: number,
        building: number
    ): Promise<AbstractDTO>;

    public abstract update(id: number, dto: AbstractDTO): Promise<AbstractDTO>;
}
