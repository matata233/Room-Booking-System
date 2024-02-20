import AbstractRepository from "./AbstractRepository";
import AbstractDTO from "../model/dto/AbstractDTO";

export default class UserRepository extends AbstractRepository {
    findAll(): Promise<AbstractDTO[]> {
        return Promise.reject([]);
    }

    findById(id: number): Promise<AbstractDTO | null> {
        return Promise.reject(undefined);
    }
}
