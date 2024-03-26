import AbstractController from "./AbstractController";
import {Request, Response} from "express";
import BuildingService from "../service/BuildingService";
import {plainToInstance} from "class-transformer";
import BuildingDTO from "../model/dto/BuildingDTO";

export default class BuildingController extends AbstractController {
    private buildingService: BuildingService;

    constructor(buildingService: BuildingService) {
        super();
        this.buildingService = buildingService;
    }

    public getAll = async (_req: Request, res: Response): Promise<Response> => {
        try {
            return super.onResolve(res, await this.buildingService.getAll());
        } catch (error) {
            return this.handleError(res, error);
        }
    };

    public getById = async (req: Request, res: Response): Promise<Response> => {
        try {
            return super.onResolve(res, await this.buildingService.getById(parseInt(req.params.id)));
        } catch (error) {
            return this.handleError(res, error);
        }
    };

    public create = async (req: Request, res: Response): Promise<Response> => {
        try {
            return super.onResolve(res, await this.buildingService.create(plainToInstance(BuildingDTO, req.body)));
        } catch (error) {
            return this.handleError(res, error);
        }
    };

    public update = async (req: Request, res: Response): Promise<Response> => {
        return Promise.reject("Not implemented");
    };
}
