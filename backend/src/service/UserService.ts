import AbstractService from "./AbstractService";
import UserDTO from "../model/dto/UserDTO";
import AbstractDTO from "../model/dto/AbstractDTO";
import UserRepository from "../repository/UserRepository";

export default class UserService extends AbstractService {
    private userRepo: UserRepository;

    constructor(userRepo: UserRepository) {
        super();
        this.userRepo = userRepo;
    }

    public async getAll(): Promise<UserDTO[]> {
        return this.userRepo.findAll();
    }

    public async getById(id: number): Promise<UserDTO> {
        return this.userRepo.findById(id);
    }

    public async getByEmail(email: string): Promise<UserDTO> {
        return this.userRepo.findByEmail(email);
    }

    public async create(
        username: string,
        firstName: string,
        lastName: string,
        email: string,
        floor: number,
        desk: number,
        building: number
    ): Promise<UserDTO> {
        return this.userRepo.create(username, firstName, lastName, email, floor, desk, building);
    }

    // Update user details
    update(id: number, dto: AbstractDTO): Promise<AbstractDTO> {
        return Promise.reject("Not implemented");
    }

    public login = async (googleToken: string): Promise<string> => {
        const userData = await this.userRepo.validateGoogleToken(googleToken);
        const token = await this.userRepo.generateJwtToken(userData);
        return token;
    };
}
