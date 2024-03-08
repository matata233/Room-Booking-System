import AbstractController from "./AbstractController";
import {Request, Response} from "express";
import BuildingService from "../service/BuildingService";
import {NotFoundError, UnauthorizedError} from "../util/exception/AWSRoomBookingSystemError";
import ResponseCodeMessage from "../util/enum/ResponseCodeMessage";

export default class BuildingController extends AbstractController {
    private buildingService: BuildingService;

    constructor(buildingService: BuildingService) {
        super();
        this.buildingService = buildingService;
    }

    public getAll = async (req: Request, res: Response): Promise<Response> => {
        try {
            const buildings = await this.buildingService.getAll();
            return super.onResolve(res, buildings);
        } catch (error: unknown) {
            if (error instanceof UnauthorizedError) {
                return super.onReject(res, error.code, error.message);
            } else {
                return super.onReject(
                    res,
                    ResponseCodeMessage.UNEXPECTED_ERROR_CODE,
                    "An error occurred while fetching buildings."
                );
            }
        }
    };

    public getById = async (req: Request, res: Response): Promise<Response> => {
        try {
            const buildingId = parseInt(req.params.id);
            if (isNaN(buildingId)) {
                return super.onReject(res, ResponseCodeMessage.BAD_REQUEST_ERROR_CODE, "Invalid building ID.");
            }
            const building = await this.buildingService.getById(buildingId);
            return super.onResolve(res, building);
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
                    "An error occurred while fetching building details."
                );
            }
        }
    };

    public create = async (req: Request, res: Response): Promise<Response> => {
        return Promise.reject("Not implemented");
    };

    public update = async (req: Request, res: Response): Promise<Response> => {
        return Promise.reject("Not implemented");
    };
}
