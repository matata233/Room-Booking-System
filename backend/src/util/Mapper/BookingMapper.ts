import {bookings} from "@prisma/client";
import BookingDTO from "../../model/dto/BookingDTO";

export const toBookingDTO = (booking: bookings): BookingDTO => {
    const bookingDTO = new BookingDTO(booking.booking_id);
    bookingDTO.createdBy = booking.created_by;
    bookingDTO.createdAt = booking.created_at;
    bookingDTO.startTime = booking.start_time;
    bookingDTO.endTime = booking.end_time;
    bookingDTO.status = booking.status;
    return bookingDTO;
};

export const toBookingEntity = (bookingDTO: BookingDTO) => {
    return {
        booking_id: bookingDTO.bookingId,
        created_by: bookingDTO.createdBy,
        start_time: bookingDTO.startTime,
        end_time: bookingDTO.endTime,
        status: bookingDTO.status
    };
};
