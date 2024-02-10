import {AbstractEntity} from "../entity/AbstractEntity";
import {AbstractDTO} from "./AbstractDTO";
//TODO: Until frontend team decide what data they want, there will be changed here
export class EquipmentDTO extends AbstractDTO{
    private equipmentId: string;
    private description?: string;
}