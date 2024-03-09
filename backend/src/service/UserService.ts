import AbstractService from "./AbstractService";
import UserDTO from "../model/dto/UserDTO";
import AbstractDTO from "../model/dto/AbstractDTO";
import UserRepository from "../repository/UserRepository";

export default class UserService extends AbstractService {
    private userRepo: UserRepository; // The repository for the User model

    // Constructs a new instance of the UserService class.
    constructor(userRepo: UserRepository) {
        super(); // Calls the constructor of the AbstractService class
        this.userRepo = userRepo; // Set the userRepo property to the userRepo parameter
    }

    public async getAll(): Promise<UserDTO[]> {
        return this.userRepo.findAll(); // Get all users. Data type: UserDTO[]
    }

    public async getById(id: number): Promise<UserDTO> {
        return this.userRepo.findById(id); // Get user by ID. Data type: UserDTO
    }

    public async getByEmail(email: string): Promise<UserDTO> {
        return this.userRepo.findByEmail(email); // Get user by email. Data type: UserDTO
    }

    // Create a new user
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
