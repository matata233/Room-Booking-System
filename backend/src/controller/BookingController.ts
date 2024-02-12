import {AbstractController} from "./AbstractController";
import {Request, Response} from "express";

export class BookingController extends AbstractController{
    //TODO

    public getAll(req: Request, res: Response): Promise<Response>{
        return Promise.reject("Not implemented");
    }
    public getById(req: Request, res: Response): Promise<Response>{
        return Promise.reject("Not implemented");
    }
    public create(req: Request, res: Response): Promise<Response>{
        return Promise.reject("Not implemented");
    }
    public update(req: Request, res: Response): Promise<Response>{
        return Promise.reject("Not implemented");
    }
}