import AbstractService from "./AbstractService";
import UserDTO from "../model/dto/UserDTO";
import AbstractDTO from "../model/dto/AbstractDTO";
import UserRepository from "../repository/UserRepository";
import {BadRequestError} from "../util/exception/AWSRoomBookingSystemError";

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

    public async create(user: UserDTO): Promise<UserDTO> {
        if (!user.username && typeof user.username !== "string") {
            throw new BadRequestError("Invalid username");
        }
        if (!user.firstName && typeof user.firstName !== "string") {
            throw new BadRequestError("Invalid first name");
        }
        if (!user.lastName && typeof user.lastName !== "string") {
            throw new BadRequestError("Invalid last name");
        }
        if (!user.email && typeof user.email !== "string") {
            throw new BadRequestError("Invalid email");
        }
        if (!user.floor && typeof user.floor !== "number") {
            throw new BadRequestError("Invalid floor");
        }
        if (!user.desk && typeof user.desk !== "number") {
            throw new BadRequestError("Invalid desk");
        }
        return this.userRepo.create(user);
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
