import AbstractDTO from "./AbstractDTO";
import RoomDTO from "./RoomDTO";
import UserDTO from "./UserDTO";
import CityDTO from "./CityDTO";
import {
    IsArray,
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
    public buildingId?: number;

    @IsInt()
    @Min(0)
    @IsOptional()
    public code?: number;

    @IsString()
    @IsOptional()
    public address?: string;

    @IsNumber()
    @IsLatitude()
    @IsOptional()
    public lat?: number;

    @IsNumber()
    @IsLongitude()
    @IsOptional()
    public lon?: number;

    @IsBoolean()
    @IsOptional()
    public isActive?: boolean;

    @Type(() => CityDTO)
    @IsArray()
    @ValidateNested({each: true})
    @IsOptional()
    public city?: CityDTO;

    @Type(() => RoomDTO)
    @IsArray()
    @ValidateNested({each: true})
    @IsOptional()
    public rooms?: RoomDTO[];

    @Type(() => UserDTO)
    @IsArray()
    @ValidateNested({each: true})
    @IsOptional()
    public users?: UserDTO[];

    constructor() {
        super();
    }
}
