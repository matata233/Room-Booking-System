import {AbstractService} from "../service/AbstractService";
import {Request, Response} from "express";

export abstract class AbstractController {
    //TODO

    public abstract getAll(req: Request, res: Response): Promise<Response>;
    public abstract getById(req: Request, res: Response): Promise<Response>;
    public abstract create(req: Request, res: Response): Promise<Response>;
    public abstract update(req: Request, res: Response): Promise<Response>;
}