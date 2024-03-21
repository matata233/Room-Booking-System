import AbstractDTO from "./AbstractDTO";
import {IsIn, IsOptional, IsString} from "class-validator";

export default class EquipmentDTO extends AbstractDTO {
    @IsString()
    @IsIn(["AV", "VC"])
    @IsOptional()
    public equipmentId?: string;

    @IsString()
    @IsOptional()
    public description?: string;

    constructor() {
        super();
    }
}
