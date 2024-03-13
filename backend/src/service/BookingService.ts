import AbstractService from "./AbstractService";
import BookingDTO from "../model/dto/BookingDTO";
import BookingRepository from "../repository/BookingRepository";
import RoomDTO from "../model/dto/RoomDTO";
import AggregateAttendeeDTO from "../model/dto/AggregateAttendeeDTO";

export default class BookingService extends AbstractService {
    public bookingRepository: BookingRepository;

    constructor(bookingRepository: BookingRepository) {
        super();
        this.bookingRepository = bookingRepository;
    }

    public getAll(): Promise<BookingDTO[]> {
        return Promise.reject("Not Implemented");
    }

    public getById(id: number): Promise<BookingDTO> {
        return Promise.reject("Not Implemented");
    }

    public create(dto: BookingDTO): Promise<BookingDTO> {
        return this.bookingRepository.create(
            dto.createdByUsername!,
            dto.createdAt!.toISOString(),
            dto.startTime!.toISOString(),
            dto.endTime!.toISOString(),
            dto.roomDTO!.map((entry) => String(entry.roomId))!,
            dto.userDTOs!.map((entry) => entry.username!)!
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
