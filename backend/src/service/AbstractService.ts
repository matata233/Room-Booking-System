import AbstractDTO from "../model/dto/AbstractDTO";
import {validateOrReject} from "class-validator";
import {BadRequestError} from "../util/exception/AWSRoomBookingSystemError";

export default abstract class AbstractService {
    public abstract getAll(): Promise<AbstractDTO[]>;

    public abstract getById(id: number): Promise<AbstractDTO>;

    public abstract create(dto: AbstractDTO): Promise<AbstractDTO>;

    public abstract update(id: number, dto: AbstractDTO): Promise<AbstractDTO>;

    protected async validateDTO(dto: AbstractDTO) {
        try {
            await validateOrReject(dto, {skipMissingProperties: true});
        } catch (error) {
            if (Array.isArray(error)) {
                throw new BadRequestError(`invalid ${error[0].property}`);
            }
            throw error;
        }
    }
}
