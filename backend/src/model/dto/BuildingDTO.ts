import {AbstractDTO} from "./AbstractDTO";
import {RoomDTO} from "./RoomDTO";
import {UserDTO} from "./UserDTO";

//TODO: Until frontend team decide what data they want, there will be changed here
export class BuildingDTO extends AbstractDTO{
    private buildingId: number;
    private buildingNumber?: string;
    private address?: string;
    private lon?: number;
    private lat?: number;
    private isActive?: boolean;

    private roomsDto?: RoomDTO[];
    private usersDto?: UserDTO[];
}