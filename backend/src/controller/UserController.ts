import AbstractController from "./AbstractController";
import {Request, Response} from "express";
import UserService from "../service/UserService";

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
}
