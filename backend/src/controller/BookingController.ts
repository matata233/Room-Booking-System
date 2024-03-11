import RoomDTO from "../model/dto/RoomDTO";
import BookingService from "../service/BookingService";
import ResponseCodeMessage from "../util/enum/ResponseCodeMessage";
import { NotFoundError, UnavailableAttendeesError } from "../util/exception/AWSRoomBookingSystemError";
import AbstractController from "./AbstractController";
import {Request, Response} from "express";

export default class BookingController extends AbstractController {
    private bookingService: BookingService;

    constructor( bookingService: BookingService ) {
        super();
        this.bookingService = bookingService;
    }

    public getAll(req: Request, res: Response): Promise<Response> {
        return Promise.reject("Not implemented");
    }
    public getById(req: Request, res: Response): Promise<Response> {
        return Promise.reject("Not implemented");
    }
    public create(req: Request, res: Response): Promise<Response> {
        return Promise.reject("Not implemented");
    }
    public update(req: Request, res: Response): Promise<Response> {
        return Promise.reject("Not implemented");
    } 

    public getAvailableRooms = async ( req: Request, res: Response ): Promise<Response> => {
        let start_time = req.query.startTime as string;
        let end_time = req.query.endTime as string;
        let attendees = ( req.query.attendees as string ).split(',');
        let equipments = ( req.query.equipments as string ).split(',');
        let priority = ( req.query.priority as string ).split(',');
        return this.bookingService.getAvailableRooms( start_time, end_time, attendees, equipments, priority )
        .then( ( rooms ) => {
            return super.onResolve( res, rooms );
        })
        .catch( ( err: NotFoundError ) => {
            return super.onReject( res, ResponseCodeMessage.NOT_FOUND_CODE, err.message );
        })
        .catch( ( err: UnavailableAttendeesError ) => {
            return super.onReject( res, ResponseCodeMessage.UNAVAILABLE_ATEENDEES, err.message );
        });
    }
}
