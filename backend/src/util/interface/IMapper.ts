import {AbstractEntity} from "../../model/entity/AbstractEntity";
import {AbstractDTO} from "../../model/dto/AbstractDTO";

export interface IMapper {
    toDTO(entity:AbstractEntity) : AbstractDTO;
    toEntity(dto: AbstractDTO) : AbstractEntity;
}