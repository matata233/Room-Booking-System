import AbstractController from "./AbstractController";
import {Request, Response} from "express";
import UserService from "../service/UserService";
import {UnauthorizedError} from "../util/exception/AWSRoomBookingSystemError";
import ResponseCodeMessage from "../util/enum/ResponseCodeMessage";

export default class UserController extends AbstractController {
    private userService: UserService;

    constructor(userService: UserService) {
        super();
        this.userService = userService;
    }

    public getAll = async (req: Request, res: Response): Promise<Response> => {
        try {
            const users = await this.userService.getAll();
            return super.onResolve(res, users);
        } catch (error: unknown) {
            if (error instanceof UnauthorizedError) {
                return super.onReject(res, error.code, error.message);
            } else {
                return super.onReject(
                    res,
                    ResponseCodeMessage.UNEXPECTED_ERROR_CODE,
                    "An error occurred while fetching users."
                );
            }
        }
    };

    public getById(req: Request, res: Response): Promise<Response> {
        return Promise.reject("Not implemented");
    }
    public create(req: Request, res: Response): Promise<Response> {
        return Promise.reject("Not implemented");
    }
    public update(req: Request, res: Response): Promise<Response> {
        return Promise.reject("Not implemented");
    }
}
