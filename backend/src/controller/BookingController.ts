import BookingDTO from "../model/dto/BookingDTO";
import RoomDTO from "../model/dto/RoomDTO";
import UserDTO from "../model/dto/UserDTO";
import BookingService from "../service/BookingService";
import ResponseCodeMessage from "../util/enum/ResponseCodeMessage";
import { BadRequestError, NotFoundError, RequestConflictError, UnavailableAttendeesError } from "../util/exception/AWSRoomBookingSystemError";
import AbstractController from "./AbstractController";
import {Request, Response} from "express";

export default class BookingController extends AbstractController {
    private bookingService: BookingService;

    constructor(bookingService: BookingService) {
        super();
        this.bookingService = bookingService;
    }

    public getAll(req: Request, res: Response): Promise<Response> {
        return Promise.reject("Not implemented");
    }
    public getById(req: Request, res: Response): Promise<Response> {
        return Promise.reject("Not implemented");
    }

    public create = async (req: Request, res: Response): Promise<Response> => {
        const dto = new BookingDTO();
        dto.createdByUsername = req.body.createdByUsername!;
        dto.createdAt = new Date();
        dto.startTime = new  Date( req.body.startTime! );
        dto.endTime = new Date( req.body.endTime! );
        dto.roomDTO = []
        for( let entry of req.body.rooms ) {
            let roomdto = new RoomDTO();
            roomdto.roomId = entry;
            dto.roomDTO.push(roomdto);
        }
        dto.userDTOs = [];
        for (const entry of req.body.users) {
            const userdto = new UserDTO();
            userdto.username = entry;
            dto.userDTOs.push(userdto);
        }
        return this.bookingService
            .create(dto)
            .then((booking) => {
                return super.onResolve(res, booking);
            })
            .catch((err: RequestConflictError) => {
                return super.onReject(res, ResponseCodeMessage.REQUEST_CONFLICT_CODE, err.message);
            })
            .catch((err: NotFoundError) => {
                return super.onReject(res, ResponseCodeMessage.NOT_FOUND_CODE, err.message);
            });
    };

    public update(req: Request, res: Response): Promise<Response> {
        return Promise.reject("Not implemented");
    } 

    public getSuggestedTimes = async ( req: Request, res: Response ): Promise<Response> => {
        let start_time = req.body.start_time;
        let end_time = req.body.end_time;
        let duration = req.body.duration;
        let attendees = req.body.attendees;
        let equipments = req.body.equipments;
        let step_size = req.body.step_size;
        
        return this.bookingService.getSuggestedTimes( start_time, end_time, duration, attendees, equipments, step_size )
        .then( ( time_slots ) => {
            // return super.onReject( res, 400, "" );
            return super.onResolve( res, time_slots );
        })
        .catch( ( err: BadRequestError ) => {
            return super.onReject( res, ResponseCodeMessage.BAD_REQUEST_ERROR_CODE, err.message );
        })
    }

    public getAvailableRooms = async ( req: Request, res: Response ): Promise<Response> => {
        let start_time = req.body.startTime!;
        let end_time = req.body.endTime!;
        let attendees = req.body.attendees!;
        let equipments = req.body.equipments!;
        let priority = req.body.priority!;
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
