import BookingDTO from "../model/dto/BookingDTO";
import RoomDTO from "../model/dto/RoomDTO";
import UserDTO from "../model/dto/UserDTO";
import BookingService from "../service/BookingService";
import ResponseCodeMessage from "../util/enum/ResponseCodeMessage";
import AbstractController from "./AbstractController";
import {Request, Response} from "express";
import {authenticator} from "../App";

export default class BookingController extends AbstractController {
    private bookingService: BookingService;

    constructor(bookingService: BookingService) {
        super();
        this.bookingService = bookingService;
    }

    public getAll = async (_req: Request, res: Response): Promise<Response> => {
        try {
            return super.onResolve(res, await this.bookingService.getAll());
        } catch (error) {
            return this.handleError(res, error);
        }
    };

    public getById = async (req: Request, res: Response): Promise<Response> => {
        try {
            return super.onResolve(res, await this.bookingService.getById(parseInt(req.params.id)));
        } catch (error) {
            return this.handleError(res, error);
        }
    };

    public getByCurrentUserId = async (req: Request, res: Response): Promise<Response> => {
        try {
            const currentUser = await authenticator.getCurrentUser(req.headers.authorization);
            return super.onResolve(res, await this.bookingService.getByUserId(currentUser.userId!));
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

            return super.onResolve(res, await this.bookingService.create(dto));
        } catch (error) {
            return this.handleError(res, error);
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
            return super.onResolve(res, await this.bookingService.update(bookingId, bookingToUpdateDTO));
        } catch (error) {
            return this.handleError(res, error);
        }
    };

    public getSuggestedTimes = async (req: Request, res: Response): Promise<Response> => {
        try {
            const startTime = req.body.start_time;
            const endTime = req.body.end_time;
            const duration = req.body.duration;
            const attendees = req.body.attendees;
            const equipments = req.body.equipments;
            const stepSize = req.body.step_size;

            return super.onResolve(
                res,
                await this.bookingService.getSuggestedTimes(
                    startTime,
                    endTime,
                    duration,
                    attendees,
                    equipments,
                    stepSize
                )
            );
        } catch (error) {
            return this.handleError(res, error);
        }
    };

    public getAvailableRooms = async (req: Request, res: Response): Promise<Response> => {
        try {
            const startTime = req.body.startTime!;
            const endTime = req.body.endTime!;
            const attendees = req.body.attendees!;
            const equipments = req.body.equipments!;
            const priority = req.body.priority!;
            const roomCount = req.body.roomCount!;
            const regroup = req.body.regroup!;
            return super.onResolve(
                res,
                await this.bookingService.getAvailableRooms(
                    startTime,
                    endTime,
                    attendees,
                    equipments,
                    priority,
                    roomCount,
                    regroup
                )
            );
        } catch (error) {
            return this.handleError(res, error);
        }
    };
}
