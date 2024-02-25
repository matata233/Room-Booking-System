import {users, bookings, role} from "@prisma/client";
import UserDTO from "../../model/dto/UserDTO";
import BookingDTO from "../../model/dto/BookingDTO";

export const toUserDTO = (user: users, booking: bookings): UserDTO => {
    const userDTO = new UserDTO(user.user_id);
    userDTO.userName = user.username;
    userDTO.firstName = user.first_name;
    userDTO.lastName = user.last_name;
    userDTO.email = user.email;
    userDTO.isActive = user.is_active;
    userDTO.userRoles = user.role;

    // userDTO.bookingDTOs = new BookingDTO(booking.booking_id);
    userDTO.bookingDTOs = [];
    for (const booking of user.bookings) {
        userDTO.bookingDTOs.push(toBookingDTO(booking));
    }



    userDTO.bookingDTOs.createdBy = booking.created_by;
    userDTO.bookingDTOs.createdAt = booking.created_at;
    userDTO.bookingDTOs.startTime = booking.start_time;
    userDTO.bookingDTOs.endTime = booking.end_time;
    userDTO.bookingDTOs.status = booking.status;

    return userDTO;
};
