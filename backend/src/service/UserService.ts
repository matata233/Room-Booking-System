import { AbstractService } from "./AbstractService";
import {UserDTO} from "../model/dto/UserDTO";

export class UserService extends AbstractService {
    public async getAll(): Promise<UserDTO[]> {
        return Promise.reject("Not implemented");
    }

    public async getById(id: number): Promise<UserDTO> {
        return Promise.reject("Not implemented");
    }

    public async create(dto: UserDTO): Promise<UserDTO> {
        return Promise.reject("Not implemented");
    }

    public async update(id: number, dto: UserDTO): Promise<UserDTO> {
        return Promise.reject("Not implemented");
    }
}