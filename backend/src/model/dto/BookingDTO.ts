import {AbstractDTO} from "./AbstractDTO";
//TODO: Until frontend team decide what data they want, there will be changed here
export class BookingDTO extends AbstractDTO{
    private bookingId: number;
    private createdBy?: number;
    private createdAt?: Date;
    private startTime?: Date;
    private duration?: number;
    private endTime?: Date;
    private status?: string;
}