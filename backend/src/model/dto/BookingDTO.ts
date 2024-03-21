import AbstractDTO from "./AbstractDTO";
import UserDTO from "./UserDTO";
import RoomDTO from "./RoomDTO";
import {IsDate, IsInt, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";

export interface Group {
    room: RoomDTO;
    attendees: UserDTO[];
}

export default class BookingDTO extends AbstractDTO {
    @IsInt()
    @IsOptional()
    public bookingId?: number;

    @IsInt()
    @IsOptional()
    public createdBy?: number;

    @IsDate()
    @IsOptional()
    public createdAt?: Date;

    @IsDate()
    @IsOptional()
    public startTime?: Date;

    @IsDate()
    @IsOptional()
    public endTime?: Date;

    @IsString()
    @IsOptional()
    public status?: string;

    @Type(() => UserDTO)
    @IsOptional()
    public userDTOs?: UserDTO[][];

    @Type(() => RoomDTO)
    @IsOptional()
    public roomDTOs?: RoomDTO[];

    // the following field are added based on request from frontend
    @Type(() => UserDTO)
    @IsOptional()
    public users?: UserDTO; // creator

    @IsOptional()
    public groups?: Group[]; // participants in each room

    constructor() {
        super();
    }
}
