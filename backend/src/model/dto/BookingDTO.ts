import AbstractDTO from "./AbstractDTO";
import UserDTO from "./UserDTO";
import RoomDTO from "./RoomDTO";
export default class BookingDTO extends AbstractDTO {
    public bookingId?: number;
    public createdBy?: number;
    public createdAt?: Date;
    public startTime?: Date;
    public endTime?: Date;
    public status?: string;

    public userDTOs?: UserDTO[][];
    public roomDTOs?: RoomDTO[];

    // the following field are added based on request from frontend
    public users?: UserDTO; // creator
    public groups?: (RoomDTO | UserDTO[])[][]; // participants in each room

    constructor() {
        super();
    }
}
