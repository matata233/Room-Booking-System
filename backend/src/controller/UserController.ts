import AbstractController from "./AbstractController";
import {Request, Response} from "express";
import UserService from "../service/UserService";
import {UnauthorizedError} from "../util/exception/AWSRoomBookingSystemError";

export default class UserController extends AbstractController {
    private userService: UserService;
    constructor(userService: UserService) {
        super();
        this.userService = userService;
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

    public async login(req: Request, res: Response): Promise<Response> {
        try {
            //Extract the Google OAuth token from the request body
            const googleToken = req.body.token;
            if (!googleToken) {
                return res.status(400).json({ message: "Token is required" });
            }

            // Validate the token and work with user data
            const userData = await this.userService.validateGoogleToken(googleToken);

            // Generate a JWT token with user information
            const jwtToken = await this.userService.generateJwtToken(userData);

            // Send the JWT token back to frontend
            return res.status(200).json({
                message: "Welcome",
                token: jwtToken
            });

        } catch (error) {
            // Handle errors
            if (error instanceof UnauthorizedError) {
                return res.status(401).json({ message: "Unauthorized Request" });
            }
            if (error instanceof UserNotFoundError) {
                return res.status(404).json({ message: "User Not Found" });
            }
            // Generic server error
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
}
