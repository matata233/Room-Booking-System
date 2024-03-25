import AbstractService from "./AbstractService";
import BookingDTO from "../model/dto/BookingDTO";
import BookingRepository from "../repository/BookingRepository";
import {BadRequestError} from "../util/exception/AWSRoomBookingSystemError";

export default class BookingService extends AbstractService {
    private bookingRepository: BookingRepository;

    constructor(bookingRepository: BookingRepository) {
        super();
        this.bookingRepository = bookingRepository;
    }

    public getAll(): Promise<BookingDTO[]> {
        return this.bookingRepository.findAll();
    }

    public getById(id: number): Promise<BookingDTO> {
        if (isNaN(id)) {
            throw new BadRequestError("invalid booking ID");
        }
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

    public async update(id: number, dto: BookingDTO): Promise<BookingDTO> {
        if (!id || typeof id !== "number") {
            throw new BadRequestError("Invalid booking ID");
        }
        if (!dto.status || typeof dto.status !== "string") {
            throw new BadRequestError("Invalid status");
        }
        if (!dto.userDTOs || dto.userDTOs.length === 0) {
            throw new BadRequestError("Invalid participant groups");
        }
        for (const participantGroup of dto.userDTOs) {
            if (!participantGroup || participantGroup.length === 0) {
                throw new BadRequestError("Invalid participant group");
            }
            for (const participantUsername of participantGroup) {
                if (
                    !participantUsername ||
                    !participantUsername.userId ||
                    typeof participantUsername.userId !== "number"
                ) {
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
        return this.bookingRepository.update(
            id,
            dto.status,
            dto.userDTOs.map((group) => group.map((entry) => Number(entry.userId!))!),
            dto.roomDTOs.map((entry) => Number(entry.roomId))!
        );
    }

    public getSuggestedTimes(
        startTime: string,
        endTime: string,
        duration: string,
        attendees: string[],
        equipments: string[],
        stepSize: string
    ): Promise<object> {
        return this.bookingRepository.getSuggestedTimes(startTime, endTime, duration, attendees, equipments, stepSize);
    }

    public getAvailableRooms(
        startTime: string,
        endTime: string,
        attendees: string[][],
        equipments: string[],
        priority: string[],
        roomCount: number,
        regroup: boolean
    ): Promise<object> {
        if (new Date(startTime) <= new Date()) {
            throw new BadRequestError("Start time has already passed");
        }
        if (new Date(endTime) <= new Date(startTime)) {
            throw new BadRequestError("Invalid end time");
        }
        return this.bookingRepository.getAvailableRooms(
            startTime,
            endTime,
            attendees,
            equipments,
            priority,
            roomCount,
            regroup
        );
    }
}
