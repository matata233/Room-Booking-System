import AbstractService from "./AbstractService";
import UserDTO from "../model/dto/UserDTO";
import UserRepository from "../repository/UserRepository";
import {BadRequestError, NotFoundError, RequestConflictError} from "../util/exception/AWSRoomBookingSystemError";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";

export default class UserService extends AbstractService {
    private userRepo: UserRepository;

    constructor(userRepo: UserRepository) {
        super();
        this.userRepo = userRepo;
    }

    public async getAll(): Promise<UserDTO[]> {
        return await this.userRepo.findAll();
    }

    public async getAllEmail(): Promise<UserDTO[]> {
        return await this.userRepo.findAllEmail();
    }

    public async getById(id: number): Promise<UserDTO> {
        return await this.userRepo.findById(id);
    }

    public async getByEmail(email: string): Promise<UserDTO> {
        return await this.userRepo.findByEmail(email);
    }

    public async create(user: UserDTO): Promise<UserDTO> {
        await this.validateDTO(user);
        try {
            return await this.userRepo.create(user);
        } catch (error) {
            this.handlePrismaClientKnownRequestError(error, user);
            throw error;
        }
    }

    public async update(userID: number, user: UserDTO): Promise<UserDTO> {
        if (isNaN(userID)) {
            throw new BadRequestError("invalid user ID");
        }
        await this.validateDTO(user);
        try {
            return await this.userRepo.update(userID, user);
        } catch (error) {
            this.handlePrismaClientKnownRequestError(error, user);
            throw error;
        }
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

    private handlePrismaClientKnownRequestError(error: unknown, user: UserDTO) {
        if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                throw new RequestConflictError(`user ${user.username} or ${user.email} already exists`);
            }
            if (error.code === "P2003") {
                throw new NotFoundError(`building does not exist`);
            }
        }
        throw error;
    }

    private splitString(input: string): {characters: string; number: number} {
        const characters = input.match(/[a-zA-Z]+/g)?.join("") || "";
        const number = parseInt(input.match(/\d+/g)?.join("") || "0", 10);
        return {characters, number};
    }
}
