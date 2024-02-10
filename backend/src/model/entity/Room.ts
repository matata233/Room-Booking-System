import {AbstractEntity} from "./AbstractEntity";
import {Equipment} from "./Equipment";
import {Booking} from "./Booking";
//TODO: Once prisma is set there will be changed here
export class Room extends AbstractEntity{
    private roomId: number;
    private buildingId: number;
    private floorNumber: number;
    private roomNumber: string;
    private roomName?: string;
    private numberOfSeats: number;
    private isActive: boolean;

    // Relationships
    private equipments?: Equipment[];
    private bookings?: Booking[];

}