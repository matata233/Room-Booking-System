import AbstractService from "./AbstractService";
import BookingDTO from "../model/dto/BookingDTO";
import BookingRepository from "../repository/BookingRepository";
import {BadRequestError} from "../util/exception/AWSRoomBookingSystemError";
import {bookings, status} from "@prisma/client";

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

    public async create(dto: BookingDTO): Promise<bookings> {
        if (!dto.startTime || dto.startTime.toString() === "Invalid Date" || dto.startTime <= new Date()) {
            throw new BadRequestError("Invalid start time");
        }
        if (!dto.endTime || dto.endTime.toString() === "Invalid Date" || dto.endTime <= dto.startTime) {
            throw new BadRequestError("Invalid end time");
        }
        if (!dto.userDTOs || dto.userDTOs.length === 0) {
            throw new BadRequestError("Invalid participant groups");
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
        if (!dto.createdBy) {
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

    public async update(dto: BookingDTO): Promise<BookingDTO> {
        // if (!dto.createdBy || typeof dto.createdBy !== "number") {
        //     throw new BadRequestError("Invalid creator ID");
        // }
        // if (!dto.startTime || dto.startTime.toString() === "Invalid Date") {
        //     throw new BadRequestError("Invalid start time");
        // }
        // if (!dto.endTime || dto.endTime.toString() === "Invalid Date") {
        //     throw new BadRequestError("Invalid end time");
        // }
        // if (dto.endTime <= dto.startTime) {
        //     throw new BadRequestError("Invalid end time");
        // }
        if (!dto.bookingId || typeof dto.bookingId !== "number") {
            throw new BadRequestError("Invalid booking ID");
        }
        if (!dto.status) {
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
        // compare the number of rooms and participant groups
        if (dto.roomDTOs.length !== dto.userDTOs.length) {
            throw new BadRequestError("Number of rooms must be equal to number of participant groups");
        }
        return this.bookingRepository.update(
            dto.bookingId,
            dto.status as status,
            dto.userDTOs.map((group) => group.map((entry) => Number(entry.userId!))!),
            dto.roomDTOs.map((entry) => Number(entry.roomId))!
        );
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
