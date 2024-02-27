import AbstractService from "./AbstractService";
import UserDTO from "../model/dto/UserDTO";
import AbstractDTO from "../model/dto/AbstractDTO";
import UserRepository from "../repository/UserRepository";

export default class UserService extends AbstractService {
    private userRepo: UserRepository; // The repository for the User model

    constructor(userRepo: UserRepository) {
        super();
        this.userRepo = userRepo;
    }

    public async getAll(): Promise<UserDTO[]> {
        return this.userRepo.findAll(); // Get all users. Data type: UserDTO[]
    }

    public async getById(id: number): Promise<UserDTO> {
        return this.userRepo.findById(id);
    }

    public async getByEmail(email: string): Promise<UserDTO> {
        return this.userRepo.findByEmail(email);
    }

    create(dto: AbstractDTO): Promise<AbstractDTO> {
        return Promise.reject("Not implemented");
    }

    update(id: number, dto: AbstractDTO): Promise<AbstractDTO> {
        return Promise.reject("Not implemented");
    }

    public login = async(googleToken: string): Promise<string> => {
        console.log("Entering userRepo")
        
        const userData = await this.userRepo.validateGoogleToken(googleToken);
        console.log("userRepo.validateGoogleToken completed")
        return this.userRepo.generateJwtToken(userData);
        // return Promise.resolve("abc");
    }
}
