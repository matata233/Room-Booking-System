import AbstractDTO from "./AbstractDTO";
import EquipmentDTO from "./EquipmentDTO";
import CityDTO from "./CityDTO";
import BuildingDTO from "./BuildingDTO";
import {Type} from "class-transformer";
import {IsArray, IsBoolean, IsInt, IsOptional, IsString, Min, ValidateNested} from "class-validator";

export default class RoomDTO extends AbstractDTO {
    @IsInt()
    @IsOptional()
    roomId?: number;

    @IsInt()
    @IsOptional()
    floorNumber?: number;

    @IsInt()
    @Min(1)
    @IsOptional()
    numberOfSeats?: number;

    @IsString()
    @IsOptional()
    roomCode?: string;

    @IsString()
    @IsOptional()
    roomName?: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @Type(() => CityDTO)
    @ValidateNested()
    @IsOptional()
    city?: CityDTO;

    @Type(() => BuildingDTO)
    @ValidateNested()
    @IsOptional()
    building?: BuildingDTO;

    @Type(() => EquipmentDTO)
    @IsArray()
    @ValidateNested({each: true})
    @IsOptional()
    equipmentList?: EquipmentDTO[];
}
