import AbstractDTO from "./AbstractDTO";
import UserDTO from "./UserDTO";
import RoomDTO from "./RoomDTO";
//TODO: Until frontend team decide what data they want, there will be changed here
export default class BookingDTO extends AbstractDTO {
    public bookingId?: number;
    public createdBy?: number;
    public createdAt?: Date;
    public startTime?: Date;
    public endTime?: Date;
    public status?: string;

    public userDTOs?: UserDTO[][];
    public roomDTO?: RoomDTO[];

    public createdByUsername?: string;

    constructor() {
        super();
    }
}
