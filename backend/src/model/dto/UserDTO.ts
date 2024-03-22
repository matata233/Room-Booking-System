import AbstractDTO from "./AbstractDTO";
import BuildingDTO from "./BuildingDTO";
import CityDTO from "./CityDTO";
import {role} from "@prisma/client";
import {IsBoolean, IsEmail, IsEnum, IsInt, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";

export default class UserDTO extends AbstractDTO {
    @IsInt()
    @IsOptional()
    public userId?: number;

    @IsString()
    @IsOptional()
    public username?: string;

    @IsString()
    @IsOptional()
    public firstName?: string;

    @IsString()
    @IsOptional()
    public lastName?: string;

    @IsString()
    @IsOptional()
    @IsEmail()
    public email?: string;

    @IsInt()
    @IsOptional()
    public floor?: number;

    @IsInt()
    @IsOptional()
    public desk?: number;

    @IsBoolean()
    @IsOptional()
    public isActive?: boolean;

    @IsEnum(role)
    @IsOptional()
    public role?: role;

    @Type(() => CityDTO)
    @IsOptional()
    public city?: CityDTO;

    @Type(() => BuildingDTO)
    @IsOptional()
    public building?: BuildingDTO;

    constructor() {
        super();
    }
}
