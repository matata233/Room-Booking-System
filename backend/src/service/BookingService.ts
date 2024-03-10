import AbstractService from "./AbstractService";
import BookingDTO from "../model/dto/BookingDTO";
import BookingRepository from "../repository/BookingRepository";
import RoomDTO from "../model/dto/RoomDTO";
import AggregateAttendeeDTO from "../model/dto/AggregateAttendeeDTO";

export default class BookingService extends AbstractService {
    public bookingRepository: BookingRepository;

    constructor( bookingRepository: BookingRepository ) {
        super();
        this.bookingRepository = bookingRepository;
    }

    public getAll(): Promise<BookingDTO[]> {
        return Promise.reject( "Not Implemented" );
    }

    public getById(id: number): Promise<BookingDTO> {
        return Promise.reject( "Not Implemented" );
    }

    public create(dto: BookingDTO): Promise<BookingDTO> {
        return Promise.reject( "Not Implemented" );
    }

    public update(id: number, dto: BookingDTO): Promise<BookingDTO> {
        return Promise.reject( "Not Implemented" );
    }

    public getBuildingFloor( attendees: string[] ): Promise<AggregateAttendeeDTO[]> {
        return this.bookingRepository.getBuildingFloor( attendees );
    }   

    public getAvailableRooms( start_time: string, end_time: string, attendees: string[], equipments: string[], priority: string[]): Promise<RoomDTO[]> {
        return this.bookingRepository.getAvailableRooms( start_time, end_time,attendees,equipments,priority);
    }
}
