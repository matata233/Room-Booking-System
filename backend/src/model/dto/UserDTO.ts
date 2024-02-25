import {UserRole} from "../../util/enum/UserRole";
import AbstractDTO from "./AbstractDTO";
import BookingDTO from "./BookingDTO";
import BuildingDTO from "./BuildingDTO";
import CityDTO from "./CityDTO";
// TODO
export default class UserDTO extends AbstractDTO {
    public userId: number;
    public userName?: string;
    public firstName?: string;
    public lastName?: string;
    public email?: string;
    public buildingId?: number;
    public floor?: number;
    public desk?: number;
    public isActive?: boolean;
    public userRoles?: UserRole;
    // public buildingDTO?: BuildingDTO;
    public bookingDTOs?: BookingDTO[];

    constructor(userId: number) {
        super();
        this.userId = userId;
    }
}
