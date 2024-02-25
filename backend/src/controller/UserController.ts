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

    public getById(req: Request, res: Response): Promise<Response> {
        return Promise.reject("Not implemented");
    }
    public create(req: Request, res: Response): Promise<Response> {
        return Promise.reject("Not implemented");
    }
    public update(req: Request, res: Response): Promise<Response> {
        return Promise.reject("Not implemented");
    }

    public async login(req: Request, res: Response): Promise<Response> {
        try {
            //Extract the Google OAuth token from the request body
            const googleToken = req.body.token;
            if (!googleToken) {
                return res.status(400).json({message: "Token is required"});
            }
            const jwtToken = await this.userService.login(googleToken);

            // Send the JWT token back to frontend
            return res.status(200).json({
                message: "Welcome",
                token: jwtToken
            });
        } catch (error) {
            // Handle errors
            if (error instanceof UnauthorizedError) {
                return res.status(401).json({message: "Unauthorized Request"});
            }
            if (error instanceof NotFoundError) {
                return res.status(404).json({message: "User Not Found"});
            }
            // Generic server error
            return res.status(500).json({message: "Internal Server Error"});
        }
    }
}
