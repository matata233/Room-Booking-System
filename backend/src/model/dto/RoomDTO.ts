import {AbstractDTO} from "./AbstractDTO";
import {EquipmentDTO} from "./EquipmentDTO";
import {BookingDTO} from "./BookingDTO";

//TODO: Until frontend team decide what data they want, there will be changed here
export class RoomDTO extends AbstractDTO{
    private roomId: number;
    private cityId: number;
    private buildingId: number;
    private roomNumber?: string;
    private floorNumber?: number;
    private roomName?: string;
    private numberOfSeats?: number;
    private isActive?: boolean;

    private equipmentDtos?: EquipmentDTO[];
    private bookingDtos?: BookingDTO[];
}