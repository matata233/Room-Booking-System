import {AbstractEntity} from "./AbstractEntity";
import {UserRole} from "../../util/enum/UserRole";
import {Booking} from "./Booking";
//TODO: Once prisma is set there will be changed here
export class User extends AbstractEntity{
    private userId: number;
    private userName: string;
    private firstName: string;
    private lastName: string;
    private email: string;
    private buildingId: number;
    private floor: number;
    private isActive: boolean;

    // Relationships
    private userRoles: UserRole[];
    private bookings: Booking[];
}