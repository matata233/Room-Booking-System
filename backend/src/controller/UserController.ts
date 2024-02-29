import AbstractController from "./AbstractController";
import {Request, Response} from "express";
import UserService from "../service/UserService";
import {NotFoundError, UnauthorizedError} from "../util/exception/AWSRoomBookingSystemError";
import ResponseCodeMessage from "../util/enum/ResponseCodeMessage";

export default class UserController extends AbstractController {
    private userService: UserService; // The service for the User model

    // Constructs a new instance of the UserController class.
    constructor(userService: UserService) {
        super();
        this.userService = userService;
    }

    public getAll = async (req: Request, res: Response): Promise<Response> => {
        try {
            const users = await this.userService.getAll(); // Get all users. Data type: UserDTO[]
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

    public getById = async (req: Request, res: Response): Promise<Response> => {
        try {
            const userId = parseInt(req.params.id);
            if (isNaN(userId)) {
                return super.onReject(res, ResponseCodeMessage.BAD_REQUEST_ERROR_CODE, "Invalid user ID.");
            }
            const user = await this.userService.getById(userId);
            return super.onResolve(res, user);
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
                    "An error occurred while fetching user details."
                );
            }
        }
    };

    public getByEmail = async (req: Request, res: Response): Promise<Response> => {
        try {
            const {email} = req.body;
            if (!email) {
                return super.onReject(res, ResponseCodeMessage.BAD_REQUEST_ERROR_CODE, "Email is required.");
            }
            const user = await this.userService.getByEmail(email);
            return super.onResolve(res, user);
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
                    "An error occurred while fetching user details by email."
                );
            }
        }
    };

    public create(req: Request, res: Response): Promise<Response> {
        return Promise.reject("Not implemented");
    }

    public update(req: Request, res: Response): Promise<Response> {
        return Promise.reject("Not implemented");
    }


    public login = async (req: Request, res: Response): Promise<Response> => {
        try {
            //Extract the Google OAuth token from the request body
            const googleToken: string = req.body.token;
            if (!googleToken) {
                return super.onReject(res, ResponseCodeMessage.BAD_REQUEST_ERROR_CODE, "Token is required.");
            }
            const jwtToken = await this.userService.login(googleToken);

            // Send generated JWT token back to frontend
            return res.status(200).json({
                message: "Welcome",
                token: jwtToken
            });
        } catch (error) {
            // Handle errors
            if (error instanceof UnauthorizedError) {
                return super.onReject(res, error.code, error.message);
            }else if (error instanceof NotFoundError) {
                return super.onReject(res, ResponseCodeMessage.NOT_FOUND_CODE, error.message);
            }else {
                return super.onReject(
                    res,
                    ResponseCodeMessage.UNEXPECTED_ERROR_CODE,
                    "Unexpected error occurred while login."
                );
            }
        }
    };
}
