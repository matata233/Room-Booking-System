import AbstractDTO, {BUILDINGS, ROOMS, USERS} from "./AbstractDTO";
import CityDTO from "./CityDTO";
import {
    IsBoolean,
    IsInt,
    IsLatitude,
    IsLongitude,
    IsNotEmpty,
    IsNumber,
    IsString,
    Min,
    ValidateNested
} from "class-validator";
import {Type} from "class-transformer";

export default class BuildingDTO extends AbstractDTO {
    @IsNotEmpty({groups: [ROOMS, USERS]})
    @IsInt({groups: [ROOMS, USERS]})
    buildingId?: number;

    @IsNotEmpty({groups: [BUILDINGS]})
    @Type(() => CityDTO)
    @ValidateNested({groups: [BUILDINGS]})
    city?: CityDTO;

    @IsNotEmpty({groups: [BUILDINGS]})
    @IsInt({groups: [BUILDINGS]})
    @Min(1, {groups: [BUILDINGS]})
    code?: number;

    @IsNotEmpty({groups: [BUILDINGS]})
    @IsNumber(undefined, {groups: [BUILDINGS]})
    @IsLatitude({groups: [BUILDINGS], message: "invalid latitude range"})
    lat?: number;

    @IsNotEmpty({groups: [BUILDINGS]})
    @IsNumber(undefined, {groups: [BUILDINGS]})
    @IsLongitude({groups: [BUILDINGS], message: "invalid longitude range"})
    lon?: number;

    @IsNotEmpty({groups: [BUILDINGS]})
    @IsString({groups: [BUILDINGS]})
    address?: string;

    @IsNotEmpty({groups: [BUILDINGS]})
    @IsBoolean({groups: [BUILDINGS]})
    isActive?: boolean;
}
