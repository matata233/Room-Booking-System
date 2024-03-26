import AbstractDTO from "./AbstractDTO";
import UserDTO from "./UserDTO";
import RoomDTO from "./RoomDTO";
import {IsArray, IsDate, IsInt, IsOptional, IsString, ValidateNested} from "class-validator";
import {Type} from "class-transformer";
import EquipmentDTO from "./EquipmentDTO";

export interface Group {
    room: RoomDTO;
    attendees: UserDTO[];
}

export default class BookingDTO extends AbstractDTO {
    @IsInt()
    @IsOptional()
    bookingId?: number;

    @IsInt()
    @IsOptional()
    createdBy?: number;

    @IsDate()
    @IsOptional()
    createdAt?: Date;

    @IsDate()
    @IsOptional()
    startTime?: Date;

    @IsDate()
    @IsOptional()
    endTime?: Date;

    @IsString()
    @IsOptional()
    status?: string;

    @IsInt()
    @IsOptional()
    roomCount?: number;

    @Type(() => UserDTO)
    @IsOptional()
    userDTOs?: UserDTO[][];

    @Type(() => RoomDTO)
    @IsOptional()
    roomDTOs?: RoomDTO[];

    // the following field are added based on request from frontend
    @Type(() => UserDTO)
    @IsOptional()
    users?: UserDTO; // creator

    @IsArray()
    @IsOptional()
    priority?: string[];

    @Type(() => EquipmentDTO)
    @IsArray()
    @ValidateNested({each: true})
    @IsOptional()
    equipments?: EquipmentDTO[];

    @IsOptional()
    groups?: Group[]; // participants in each room
}
