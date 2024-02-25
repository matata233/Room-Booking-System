import {users, bookings} from "@prisma/client";
import UserDTO from "../../model/dto/UserDTO";
import BookingDTO from "../../model/dto/BookingDTO";
import {UserRole} from "../../util/enum/UserRole";

export const toUserDTO = (user: users): UserDTO => {
    const userDTO = new UserDTO(user.user_id);
    userDTO.userName = user.username;
    userDTO.firstName = user.first_name;
    userDTO.lastName = user.last_name;
    userDTO.email = user.email;
    userDTO.buildingId = user.building_id;
    userDTO.floor = user.floor;
    userDTO.desk = user.desk;
    userDTO.isActive = user.is_active;
    // Map the Prisma enum (string) to TypeScript enum (number)
    const roleMapping = {
        admin: UserRole.ADMIN,
        staff: UserRole.STAFF
    };
    userDTO.userRoles = roleMapping[user.role]; // Use the mapping to assign the correct enum value

    // userDTO.bookingDTOs = [];
    // for (const booking of booked) {
    //     userDTO.bookingDTOs.push(mapBookingToDTO(booking));
    // }

    return userDTO;
};

const mapBookingToDTO = (booking: bookings): BookingDTO => {
    const bookingDTO = new BookingDTO(booking.booking_id);
    bookingDTO.createdBy = booking.created_by;
    bookingDTO.createdAt = booking.created_at;
    bookingDTO.startTime = booking.start_time;
    bookingDTO.endTime = booking.end_time;
    bookingDTO.status = booking.status;
    return bookingDTO;
};
