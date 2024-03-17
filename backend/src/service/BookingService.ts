import AbstractService from "./AbstractService";
import BookingDTO from "../model/dto/BookingDTO";
import BookingRepository from "../repository/BookingRepository";
import {BadRequestError} from "../util/exception/AWSRoomBookingSystemError";

export default class BookingService extends AbstractService {
    public bookingRepository: BookingRepository;

    constructor(bookingRepository: BookingRepository) {
        super();
        this.bookingRepository = bookingRepository;
    }

    public getAll(): Promise<BookingDTO[]> {
        return this.bookingRepository.findAll();
    }

    public getById(id: number): Promise<BookingDTO> {
        return this.bookingRepository.findById(id);
    }

    public getByUserId(id: number): Promise<BookingDTO[]> {
        return this.bookingRepository.findByUserId(id);
    }

    public async create(dto: BookingDTO): Promise<BookingDTO> {
        if (!dto.startTime || dto.startTime.toString() === "Invalid Date") {
            throw new BadRequestError("Invalid start time");
        }
        if (dto.startTime <= new Date()) {
            throw new BadRequestError("Start time has already passed");
        }
        if (!dto.endTime || dto.endTime.toString() === "Invalid Date" || dto.endTime <= dto.startTime) {
            throw new BadRequestError("Invalid end time");
        }
        if (!dto.endTime || dto.endTime.toString() === "Invalid Date") {
            throw new BadRequestError("Invalid end time");
        }
        if (dto.endTime <= dto.startTime) {
            throw new BadRequestError("End time must be greater than start time");
        }
        if (!dto.userDTOs || dto.userDTOs.length === 0) {
            throw new BadRequestError("No participants");
        }
        for (const participantGroup of dto.userDTOs) {
            if (!participantGroup || participantGroup.length === 0) {
                throw new BadRequestError("Invalid participant group");
            }
            for (const participantUsername of participantGroup) {
                if (!participantUsername || !participantUsername.userId) {
                    throw new BadRequestError("Invalid participant");
                }
            }
        }
        if (!dto.roomDTOs || dto.roomDTOs.length === 0) {
            throw new BadRequestError("Invalid rooms");
        }
        for (const room of dto.roomDTOs) {
            if (!room || typeof room.roomId !== "number") {
                throw new BadRequestError("Invalid rooms");
            }
        }
        if (dto.roomDTOs.length !== dto.userDTOs.length) {
            throw new BadRequestError("Number of rooms must be equal to number of participant groups");
        }
        if (dto.createdBy === undefined) {
            throw new BadRequestError("Invalid creator ID");
        }
        return this.bookingRepository.create(
            dto.createdBy,
            dto.createdAt!.toISOString(),
            dto.startTime.toISOString(),
            dto.endTime.toISOString(),
            dto.roomDTOs.map((entry) => String(entry.roomId))!,
            dto.userDTOs.map((group) => group.map((entry) => entry.userId!)!)
        );
    }

    public update(id: number, dto: BookingDTO): Promise<BookingDTO> {
        return Promise.reject("Not Implemented");
    }

    public getSuggestedTimes(
        start_time: string,
        end_time: string,
        duration: string,
        attendees: string[],
        equipments: string[],
        step_size: string
    ): Promise<object> {
        return this.bookingRepository.getSuggestedTimes(
            start_time,
            end_time,
            duration,
            attendees,
            equipments,
            step_size
        );
    }

    public getAvailableRooms(
        start_time: string,
        end_time: string,
        attendees: string[],
        equipments: string[],
        priority: string[]
    ): Promise<object> {
        return this.bookingRepository.getAvailableRooms(start_time, end_time, attendees, equipments, priority);
    }
}
