import AbstractController from "./AbstractController";
import {Request, Response} from "express";
import UserService from "../service/UserService";
import {NotFoundError, UnauthorizedError} from "../util/exception/AWSRoomBookingSystemError";
import ResponseCodeMessage from "../util/enum/ResponseCodeMessage";
import UserDTO from "../model/dto/UserDTO";
import CityDTO from "../model/dto/CityDTO";
import BuildingDTO from "../model/dto/BuildingDTO";
import {role} from "@prisma/client";

export default class UserController extends AbstractController {
    private userService: UserService;

    // Constructs a new instance of the UserController class.
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

    public getAllEmail = async (req: Request, res: Response): Promise<Response> => {
        try {
            const users = await this.userService.getAllEmail();
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
            const email = req.query?.email; // Extract the email from the request body, equivalent to const email = req.body.email;
            if (!email || typeof email !== "string") {
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

    public create = async (req: Request, res: Response): Promise<Response> => {
        try {
            const user = new UserDTO();
            user.username = req.body.username;
            user.firstName = req.body.firstName;
            user.lastName = req.body.lastName;
            user.email = req.body.email;
            user.floor = req.body.floor;
            user.desk = req.body.desk;
            user.isActive = true;
            user.role = "staff";
            user.city = new CityDTO();
            user.building = new BuildingDTO();
            user.building.buildingId = req.body.buildingId;
            user.city.cityId = user.building.city?.cityId;
            const newUser = await this.userService.create(user);
            return super.onResolve(res, newUser);
        } catch (error: unknown) {
            if (error instanceof UnauthorizedError) {
                return super.onReject(res, error.code, error.message);
            } else {
                console.error(error);
                return super.onReject(
                    res,
                    ResponseCodeMessage.UNEXPECTED_ERROR_CODE,
                    "An error occurred while creating a user."
                );
            }
        }
    };

    public update = async (req: Request, res: Response): Promise<Response> => {
        const userID: number = parseInt(req.params.id);
        try {
            const currentUser = await this.userService.getById(userID);
            if (!currentUser && typeof userID !== "number") {
                return super.onReject(res, ResponseCodeMessage.NOT_FOUND_CODE, "User not found");
            }
            // new user with filled from request body
            const userToUpdateDTO = new UserDTO();
            userToUpdateDTO.userId = userID;
            userToUpdateDTO.username = req.body.username;
            userToUpdateDTO.firstName = req.body.firstName;
            userToUpdateDTO.lastName = req.body.lastName;
            userToUpdateDTO.email = req.body.email;
            userToUpdateDTO.floor = parseInt(req.body.floor);
            userToUpdateDTO.desk = parseInt(req.body.desk);
            userToUpdateDTO.isActive = req.body.isActive === "true";
            // userToUpdateDTO.role = req.body.role as role;
            userToUpdateDTO.building = new BuildingDTO();
            userToUpdateDTO.building.buildingId = parseInt(req.body.buildingID);

            const userUpdated = await this.userService.update(userID, userToUpdateDTO);
            return super.onResolve(res, userUpdated);
        } catch (error: unknown) {
            if (error instanceof UnauthorizedError) {
                return super.onReject(res, error.code, error.message);
            } else {
                return super.onReject(
                    res,
                    ResponseCodeMessage.UNEXPECTED_ERROR_CODE,
                    "An error occurred while updating a user."
                );
            }
        }
    };

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
            } else if (error instanceof NotFoundError) {
                return super.onReject(res, ResponseCodeMessage.NOT_FOUND_CODE, error.message);
            } else {
                return super.onReject(
                    res,
                    ResponseCodeMessage.UNEXPECTED_ERROR_CODE,
                    "Unexpected error occurred while login."
                );
            }
        }
    };
}
