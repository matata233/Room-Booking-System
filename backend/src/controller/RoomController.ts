import AbstractController from "./AbstractController";
import {Request, Response} from "express";
import RoomService from "../service/RoomService";
import {UnauthorizedError} from "../util/exception/AWSRoomBookingSystemError";
import ResponseCodeMessage from "../util/enum/ResponseCodeMessage";

export default class RoomController extends AbstractController {
    private roomService: RoomService;

    constructor(roomService: RoomService) {
        super();
        this.roomService = roomService;
    }

    public getAll = async (req: Request, res: Response): Promise<Response> => {
        try {
            const rooms = await this.roomService.getAll();
            return super.onResolve(res, rooms);
        } catch (error: unknown) {
            if (error instanceof UnauthorizedError) {
                return super.onReject(res, error.code, error.message);
            } else {
                return super.onReject(
                    res,
                    ResponseCodeMessage.UNEXPECTED_ERROR_CODE,
                    "An error occurred while fetching rooms."
                );
            }
        }
    };

    public getById = async (req: Request, res: Response): Promise<Response> => {
        return Promise.reject("Not implemented");
    };

    public create = async (req: Request, res: Response): Promise<Response> => {
        return Promise.reject("Not implemented");
    };

    public update = async (req: Request, res: Response): Promise<Response> => {
        return Promise.reject("Not implemented");
    };
}
