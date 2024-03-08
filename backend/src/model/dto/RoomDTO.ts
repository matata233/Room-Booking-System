import AbstractDTO from "./AbstractDTO";
import EquipmentDTO from "./EquipmentDTO";
import BookingDTO from "./BookingDTO";
import CityDTO from "./CityDTO";
import BuildingDTO from "./BuildingDTO";

export default class RoomDTO extends AbstractDTO {
    public roomId?: number;
    public floorNumber?: number;
    public roomCode?: string;
    public roomName?: string | null;
    public numberOfSeats?: number;
    public isActive?: boolean;

    public city?: CityDTO;
    public building?: BuildingDTO;
    public equipmentList?: EquipmentDTO[];
    public bookingList?: BookingDTO[];

    constructor() {
        super();
    }
}
