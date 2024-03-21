import AbstractDTO from "./AbstractDTO";
import {IsOptional, IsString} from "class-validator";

export default class CityDTO extends AbstractDTO {
    @IsString()
    @IsOptional()
    public cityId?: string;

    @IsString()
    @IsOptional()
    public name?: string;

    @IsString()
    @IsOptional()
    public province_state?: string;

    constructor() {
        super();
    }
}
