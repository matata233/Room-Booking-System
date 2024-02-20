import AbstractDTO from "../model/dto/AbstractDTO";

export default abstract class AbstractService {
    // you may need more than one repository, e.g. booking

    public abstract getAll(): Promise<AbstractDTO[]>;

    public abstract getById(id: number): Promise<AbstractDTO>;

    public abstract create(dto: AbstractDTO): Promise<AbstractDTO>;

    public abstract update(id: number, dto: AbstractDTO): Promise<AbstractDTO>;
}
