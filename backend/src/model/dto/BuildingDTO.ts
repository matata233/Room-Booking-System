import AbstractDTO from "./AbstractDTO";
import CityDTO from "./CityDTO";
import {
    IsBoolean,
    IsInt,
    IsLatitude,
    IsLongitude,
    IsNumber,
    IsOptional,
    IsString,
    Min,
    ValidateNested
} from "class-validator";
import {Type} from "class-transformer";

export default class BuildingDTO extends AbstractDTO {
    @IsInt()
    @IsOptional()
    buildingId?: number;

    @Type(() => CityDTO)
    @ValidateNested()
    @IsOptional()
    city?: CityDTO;

    @IsInt()
    @Min(0)
    @IsOptional()
    code?: number;

    @IsNumber()
    @IsLatitude()
    @IsOptional()
    lat?: number;

    @IsNumber()
    @IsLongitude()
    @IsOptional()
    lon?: number;

    @IsString()
    @IsOptional()
    address?: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
