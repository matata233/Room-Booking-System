import {AbstractEntity} from "./AbstractEntity";
//TODO: Once prisma is set there will be changed here
export class Booking extends AbstractEntity{
    private bookingId: number;
    private createdBy: number;
    private createdAt: Date;
    private startTime: Date;
    private duration: number;
    private status: string;
}