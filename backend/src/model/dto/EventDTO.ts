import AbstractDTO from "./AbstractDTO";
import UserDTO from "./UserDTO";

export default class EventDTO extends AbstractDTO {
    public eventId?: number;
    public created_by?: number;
    public title?: string;
    public startTime?: Date;
    public endTime?: Date;
    public userDTO?: UserDTO;
    constructor() {
        super();
    }
}
