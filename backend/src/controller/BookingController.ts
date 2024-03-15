import BookingDTO from "../model/dto/BookingDTO";
import RoomDTO from "../model/dto/RoomDTO";
import UserDTO from "../model/dto/UserDTO";
import BookingService from "../service/BookingService";
import ResponseCodeMessage from "../util/enum/ResponseCodeMessage";
import {
    BadRequestError,
    NotFoundError,
    RequestConflictError,
    UnauthorizedError,
    UnavailableAttendeesError
} from "../util/exception/AWSRoomBookingSystemError";
import AbstractController from "./AbstractController";
import {Request, Response} from "express";

export default class BookingController extends AbstractController {
    private bookingService: BookingService;

    constructor(bookingService: BookingService) {
        super();
        this.bookingService = bookingService;
    }

    public getAll = async (req: Request, res: Response): Promise<Response> => {
        try {
            const bookings = await this.bookingService.getAll();
            return super.onResolve(res, bookings);
        } catch (error: unknown) {
            if (error instanceof UnauthorizedError) {
                return super.onReject(res, error.code, error.message);
            } else {
                return super.onReject(
                    res,
                    ResponseCodeMessage.UNEXPECTED_ERROR_CODE,
                    "An error occurred while fetching bookings."
                );
            }
        }
    };

    public getById = async (req: Request, res: Response): Promise<Response> => {
        try {
            const bookingId = parseInt(req.params.id);
            if (isNaN(bookingId)) {
                return super.onReject(res, ResponseCodeMessage.BAD_REQUEST_ERROR_CODE, "Invalid booking ID.");
            }
            const booking = await this.bookingService.getById(bookingId);
            return super.onResolve(res, booking);
        } catch (error: unknown) {
            if (error instanceof NotFoundError) {
                return super.onReject(res, ResponseCodeMessage.NOT_FOUND_CODE, error.message);
            } else if (error instanceof UnauthorizedError) {
                return super.onReject(res, error.code, error.message);
            } else {
                // Generic error handling
                return super.onReject(
                    res,
                    ResponseCodeMessage.UNEXPECTED_ERROR_CODE,
                    "An error occurred while fetching booking details."
                );
            }
        }
    };

    public create = async (req: Request, res: Response): Promise<Response> => {
        try {
            const dto = new BookingDTO();

            dto.startTime = new Date(req.body.startTime!);
            dto.endTime = new Date(req.body.endTime!);

            dto.userDTOs = [];
            for (const participantGroup of req.body.users) {
                const participantGroupDTO = [];
                for (const participantID of participantGroup) {
                    const participant = new UserDTO();
                    participant.userId = participantID;
                    participantGroupDTO.push(participant);
                }
                dto.userDTOs.push(participantGroupDTO);
            }

            dto.roomDTOs = [];
            for (const roomID of req.body.rooms) {
                const room = new RoomDTO();
                room.roomId = roomID;
                dto.roomDTOs.push(room);
            }

            dto.createdBy = req.body.createdBy;
            dto.createdAt = new Date();

            const newBooking = await this.bookingService.create(dto);
            return super.onResolve(res, newBooking);
        } catch (error: unknown) {
            console.log(error);
            if (
                error instanceof BadRequestError ||
                error instanceof RequestConflictError ||
                error instanceof UnauthorizedError
            ) {
                return super.onReject(res, error.code, error.message);
            } else {
                // Generic error handling
                return super.onReject(
                    res,
                    ResponseCodeMessage.UNEXPECTED_ERROR_CODE,
                    "An error occurred while creating the room."
                );
            }
        }
    };

    public update(req: Request, res: Response): Promise<Response> {
        return Promise.reject("Not implemented");
    }

    public getSuggestedTimes = async (req: Request, res: Response): Promise<Response> => {
        const start_time = req.body.start_time;
        const end_time = req.body.end_time;
        const duration = req.body.duration;
        const attendees = req.body.attendees;
        const equipments = req.body.equipments;
        const step_size = req.body.step_size;

        return this.bookingService
            .getSuggestedTimes(start_time, end_time, duration, attendees, equipments, step_size)
            .then((time_slots) => {
                // return super.onReject( res, 400, "" );
                return super.onResolve(res, time_slots);
            })
            .catch((err: BadRequestError) => {
                return super.onReject(res, ResponseCodeMessage.BAD_REQUEST_ERROR_CODE, err.message);
            });
    };

    public getAvailableRooms = async (req: Request, res: Response): Promise<Response> => {
        const start_time = req.body.startTime!;
        const end_time = req.body.endTime!;
        const attendees = req.body.attendees!;
        const equipments = req.body.equipments!;
        const priority = req.body.priority!;
        return this.bookingService
            .getAvailableRooms(start_time, end_time, attendees, equipments, priority)
            .then((rooms) => {
                return super.onResolve(res, rooms);
            })
            .catch((err: NotFoundError) => {
                return super.onReject(res, ResponseCodeMessage.NOT_FOUND_CODE, err.message);
            })
            .catch((err: UnavailableAttendeesError) => {
                return super.onReject(res, ResponseCodeMessage.UNAVAILABLE_ATEENDEES, err.message);
            });
    };
}
