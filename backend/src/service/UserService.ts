import AbstractService from "./AbstractService";
import UserDTO from "../model/dto/UserDTO";
import UserRepository from "../repository/UserRepository";
import {BadRequestError} from "../util/exception/AWSRoomBookingSystemError";
import {authenticator} from "../App";

export default class UserService extends AbstractService {
    private userRepo: UserRepository;

    constructor(userRepo: UserRepository) {
        super();
        this.userRepo = userRepo;
    }

    public async getAll(): Promise<UserDTO[]> {
        return this.userRepo.findAll();
    }

    public async getAllEmail(): Promise<UserDTO[]> {
        return this.userRepo.findAllEmail();
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

    public async upload(
        username: string,
        firstName: string,
        lastName: string,
        email: string,
        building: string,
        floor: number,
        desk: number
    ): Promise<UserDTO> {
        if (!username || typeof username !== "string") {
            throw new BadRequestError("Invalid username");
        }
        if (!firstName || typeof firstName !== "string") {
            throw new BadRequestError("Invalid first name");
        }
        if (!lastName || typeof lastName !== "string") {
            throw new BadRequestError("Invalid last name");
        }
        if (!email || typeof email !== "string") {
            throw new BadRequestError("Invalid email");
        }
        if (typeof floor !== "number") {
            throw new BadRequestError("Invalid floor");
        }
        if (typeof desk !== "number") {
            throw new BadRequestError("Invalid desk");
        }
        if (!building || typeof building !== "string") {
            throw new BadRequestError("Invalid building");
        }

        const cityID = this.splitString(building).characters;
        const buildingCode = this.splitString(building).number;

        return this.userRepo.upload(username, firstName, lastName, email, floor, desk, cityID, buildingCode);
    }

    private splitString(input: string): {characters: string; number: number} {
        const characters = input.match(/[a-zA-Z]+/g)?.join("") || "";
        const number = parseInt(input.match(/\d+/g)?.join("") || "0", 10);
        return {characters, number};
    }

    // Update user details
    public async update(userID: number, user: UserDTO): Promise<UserDTO> {
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
        return this.userRepo.update(userID, user);
    }

    public login = async (googleToken: string): Promise<string> => {
        const userData = await authenticator.validateGoogleToken(googleToken);
        const token = await authenticator.generateJwtToken(userData);
        return token;
    };
}
