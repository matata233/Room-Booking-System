import {Request, Response} from "express";
import AbstractDTO from "../model/dto/AbstractDTO";
import ResponseCodeMessage from "../util/enum/ResponseCodeMessage";

export default abstract class AbstractController {
    public abstract getAll(req: Request, res: Response): Promise<Response>;

    public abstract getById(req: Request, res: Response): Promise<Response>;

    public abstract create(req: Request, res: Response): Promise<Response>;

    public abstract update(req: Request, res: Response): Promise<Response>;

    protected onResolve(res: Response, result: AbstractDTO | AbstractDTO[]) {
        return res.status(ResponseCodeMessage.OK_CODE).json({result: result});
    }
    protected onReject(res: Response, code: number, msg: string): Response {
        return res.status(code).json({error: msg});
    }
}
