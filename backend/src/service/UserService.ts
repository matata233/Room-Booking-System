import AbstractService from "./AbstractService";
import UserDTO from "../model/dto/UserDTO";
import AbstractDTO from "../model/dto/AbstractDTO";
import UserRepository from "../repository/UserRepository";

export default class UserService extends AbstractService {
    private userRepo: UserRepository; // The repository for the User model

    public async getAll(): Promise<UserDTO[]> {
        return Promise.reject("Not implemented");
    }

    public async getById(id: number): Promise<UserDTO> {
        return Promise.reject("Not implemented");
    }

    create(dto: AbstractDTO): Promise<AbstractDTO> {
        return Promise.reject("Not implemented");
    }

    update(id: number, dto: AbstractDTO): Promise<AbstractDTO> {
        return Promise.reject("Not implemented");
    }
}
