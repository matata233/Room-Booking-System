import {UserRole} from "../../util/enum/UserRole";
import {AbstractDTO} from "./AbstractDTO";
import {BookingDTO} from "./BookingDTO";
import {LocationDTO} from "./LocationDTO";

//TODO: Until frontend team decide what data they want, there will be changed here
export class UserDTO extends AbstractDTO{
    private userId: number;
    private userName?: string;
    private firstName?: string;
    private lastName?: string;
    private email?: string;
    private locationDto?: LocationDTO;
    private isActive?: boolean;

    // Relationships
    private userRoles?: UserRole[];
    private bookingDtos?: BookingDTO[];
}