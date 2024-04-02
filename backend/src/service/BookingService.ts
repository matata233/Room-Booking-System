import AbstractService from "./AbstractService";
import BookingDTO from "../model/dto/BookingDTO";
import BookingRepository from "../repository/BookingRepository";
import {BadRequestError} from "../util/exception/AWSRoomBookingSystemError";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";
import {BOOKINGS_CREATE, BOOKINGS_GET_AVAIL, BOOKINGS_UPDATE} from "../model/dto/AbstractDTO";

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
        this.validateId(id, "booking");
        return this.bookingRepository.findById(id);
    }

    public getByUserId(id: number): Promise<BookingDTO[]> {
        return this.bookingRepository.findByUserId(id);
    }

    public async create(dto: BookingDTO): Promise<BookingDTO> {
        await this.validateIncomingDTO(dto, {groups: [BOOKINGS_CREATE]});
        if (dto.endTime! <= dto.startTime!) {
            throw new BadRequestError("end time must be greater than start time");
        }
        if (dto.roomDTOs!.length !== dto.userDTOs!.length) {
            throw new BadRequestError("number of rooms must be equal to number of attendee groups");
        }
        try {
            return await this.bookingRepository.create(
                dto.createdBy!,
                dto.createdAt!,
                dto.startTime!,
                dto.endTime!,
                dto.roomDTOs!.map((room) => room.roomId!),
                dto.userDTOs!.map((group) => group.map((entry) => entry.userId!)!)
            );
        } catch (error) {
            this.handlePrismaError(error);
            throw error;
        }
    }

    public async update(id: number, dto: BookingDTO): Promise<BookingDTO> {
        this.validateId(id, "booking");
        await this.validateIncomingDTO(dto, {groups: [BOOKINGS_UPDATE]});
        if (dto.roomDTOs!.length !== dto.userDTOs!.length) {
            throw new BadRequestError("number of rooms must be equal to number of attendee groups");
        }
        try {
            return await this.bookingRepository.update(
                id,
                dto.status!,
                dto.userDTOs!.map((group) => group.map((entry) => Number(entry.userId!))!),
                dto.roomDTOs!.map((entry) => Number(entry.roomId))!
            );
        } catch (error) {
            this.handlePrismaError(error);
            throw error;
        }
    }

    public async getAvailableRooms(dto: BookingDTO): Promise<object> {
        await this.validateIncomingDTO(dto, {groups: [BOOKINGS_GET_AVAIL]});
        if (dto.endTime! <= dto.startTime!) {
            throw new BadRequestError("end time must be greater than start time");
        }
        return this.bookingRepository.getAvailableRooms(
            dto.startTime!,
            dto.endTime!,
            dto.userDTOs!.filter((group) => group.length > 0).map((group) => group.map((entry) => entry.email!)!),
            dto.equipments!.map((equipment) => equipment.equipmentId!),
            dto.priority!,
            dto.roomCount!,
            dto.regroup!
        );
    }

    public getSuggestedTimes(
        startTime: Date,
        endTime: Date,
        duration: string,
        attendees: string[],
        stepSize: string
    ): Promise<object> {
        if (startTime < new Date()) {
            throw new BadRequestError("start time has already passed");
        }
        if (endTime <= startTime) {
            throw new BadRequestError("end time must be greater than start time");
        }
        return this.bookingRepository.getSuggestedTimes(startTime, endTime, duration, attendees, stepSize);
    }

    private handlePrismaError(error: unknown) {
        if (error instanceof PrismaClientKnownRequestError) {
            this.toKnownErrors(error, "booking", "", "user");
        }
    }
}
