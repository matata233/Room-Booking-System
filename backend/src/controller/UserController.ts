import AbstractController from "./AbstractController";
import {Request, Response} from "express";
import UserService from "../service/UserService";
import ResponseCodeMessage from "../util/enum/ResponseCodeMessage";
import UserDTO from "../model/dto/UserDTO";
import csv from "csv-parser";
import stream from "stream";
import {plainToInstance} from "class-transformer";

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
            return this.handleError(res, error);
        }
    };

    public getAllEmail = async (req: Request, res: Response): Promise<Response> => {
        try {
            const users = await this.userService.getAllEmail();
            return super.onResolve(res, users);
        } catch (error: unknown) {
            return this.handleError(res, error);
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
            return this.handleError(res, error);
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
            return this.handleError(res, error);
        }
    };

    public create = async (req: Request, res: Response): Promise<Response> => {
        try {
            return super.onResolve(res, await this.userService.create(plainToInstance(UserDTO, req.body)));
        } catch (error) {
            return this.handleError(res, error);
        }
    };

    public update = async (req: Request, res: Response): Promise<Response> => {
        const userID: number = parseInt(req.params.id);
        try {
            return super.onResolve(res, await this.userService.update(userID, plainToInstance(UserDTO, req.body)));
        } catch (error) {
            return this.handleError(res, error);
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
            return this.handleError(res, error);
        }
    };

    //column names in the CSV file: username, first name, last name, email, building name, floor, desk
    public upload = async (req: Request, res: Response): Promise<any> => {
        if (!req.file?.buffer) {
            console.error("File buffer is undefined.");
            return super.onReject(res, ResponseCodeMessage.BAD_REQUEST_ERROR_CODE, "Please upload a CSV file!");
        }

        const processingPromises: Promise<UserDTO>[] = [];
        let isFirstDataRow = true;

        // Use stream to read the CSV file from the buffer
        const bufferStream = new stream.PassThrough();
        bufferStream.end(req.file.buffer);

        bufferStream
            .pipe(csv({headers: true}))
            .on("data", (row) => {
                if (isFirstDataRow) {
                    // skip the first row
                    isFirstDataRow = false;
                    return;
                }

                const processingPromise = (async () => {
                    const username = row._0;
                    const firstName = row._1;
                    const lastName = row._2;
                    const email = row._3;
                    const building = row._4;
                    const floor = parseInt(row._5);
                    const desk = parseInt(row._6);
                    return await this.userService.upload(username, firstName, lastName, email, building, floor, desk);
                })();
                processingPromises.push(processingPromise);
            })
            .on("end", async () => {
                try {
                    const users = await Promise.all(processingPromises);
                    super.onResolve(res, users);
                } catch (error) {
                    return this.handleError(res, error);
                }
            })
            .on("error", (error) => {
                return this.handleError(res, error);
            });
    };
}
