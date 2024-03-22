import AbstractDTO from "./AbstractDTO";
import {IsDate, IsInt, IsOptional, IsString} from "class-validator";

export default class EventDTO extends AbstractDTO {
    @IsInt()
    @IsOptional()
    public eventId?: number;

    @IsInt()
    @IsOptional()
    public created_by?: number;

    @IsString()
    @IsOptional()
    public title?: string;

    @IsDate()
    @IsOptional()
    public startTime?: Date;

    @IsDate()
    @IsOptional()
    public endTime?: Date;

    constructor() {
        super();
    }
}
