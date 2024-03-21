import BookingDTO from "../model/dto/BookingDTO";
import RoomDTO from "../model/dto/RoomDTO";
import UserDTO from "../model/dto/UserDTO";
import BookingService from "../service/BookingService";
import ResponseCodeMessage from "../util/enum/ResponseCodeMessage";
import {BadRequestError, RequestConflictError, UnauthorizedError} from "../util/exception/AWSRoomBookingSystemError";
import AbstractController from "./AbstractController";
import {Request, Response} from "express";
import {authenticator} from "../App";
import {status} from "@prisma/client";

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
        } catch (error) {
            return this.handleError(res, error);
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
        } catch (error) {
            return this.handleError(res, error);
        }
    };

    public getByCurrentUserId = async (req: Request, res: Response): Promise<Response> => {
        try {
            const currentUser = await authenticator.getCurrentUser(req.headers.authorization);
            const bookings = await this.bookingService.getByUserId(currentUser.userId!);
            return super.onResolve(res, bookings);
        } catch (error) {
            return this.handleError(res, error);
        }
    };

    public create = async (req: Request, res: Response): Promise<Response> => {
        try {
            const dto = new BookingDTO();

            dto.startTime = new Date(req.body.startTime!);
            dto.endTime = new Date(req.body.endTime!);
            dto.userDTOs = [];
            // create an array of UserDTOs for each group of participants
            for (const group of req.body.users) {
                const groupDTO = [];
                for (const participantID of group) {
                    const participant = new UserDTO();
                    participant.userId = participantID;
                    groupDTO.push(participant);
                }
                dto.userDTOs.push(groupDTO);
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

    /*
    params from frontend for update:
    - bookingId: number; status: string; users: number[][]; rooms: number[];
    */
    public update = async (req: Request, res: Response): Promise<Response> => {
        const bookingId: number = parseInt(req.params.id);
        if (isNaN(bookingId)) {
            return super.onReject(res, ResponseCodeMessage.BAD_REQUEST_ERROR_CODE, "Invalid booking ID.");
        }

        try {
            const bookingToUpdateDTO = new BookingDTO();
            bookingToUpdateDTO.bookingId = bookingId;
            bookingToUpdateDTO.status = req.body.status;
            // create 2D array of UserDTOs for each group of participants
            bookingToUpdateDTO.userDTOs = [];
            for (const group of req.body.users) {
                // note: req.body.users is 2D array of user IDs
                const groupUserDTO: UserDTO[] = [];
                for (const participantID of group) {
                    const participant = new UserDTO();
                    participant.userId = participantID;
                    groupUserDTO.push(participant);
                }
                bookingToUpdateDTO.userDTOs.push(groupUserDTO);
            }
            // create an array of RoomDTOs
            bookingToUpdateDTO.roomDTOs = [];
            for (const roomID of req.body.rooms) {
                const room = new RoomDTO();
                room.roomId = roomID;
                bookingToUpdateDTO.roomDTOs.push(room);
            }
            const updatedBooking = await this.bookingService.update(bookingId, bookingToUpdateDTO);
            return super.onResolve(res, updatedBooking);
        } catch (error: unknown) {
            if (error instanceof BadRequestError || error instanceof UnauthorizedError) {
                return super.onReject(res, error.code, error.message);
            } else {
                return super.onReject(
                    res,
                    ResponseCodeMessage.UNEXPECTED_ERROR_CODE,
                    "An error occurred while updating the booking."
                );
            }
        }
    };

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
        try {
            const start_time = req.body.startTime!;
            const end_time = req.body.endTime!;
            const attendees = req.body.attendees!;
            const equipments = req.body.equipments!;
            const priority = req.body.priority!;
            const num_rooms = req.body.roomCount!;
            const availableRooms = await this.bookingService.getAvailableRooms(
                start_time,
                end_time,
                attendees,
                equipments,
                priority,
                num_rooms
            );
            return super.onResolve(res, availableRooms);
        } catch (error) {
            return this.handleError(res, error);
        }
    };
}
