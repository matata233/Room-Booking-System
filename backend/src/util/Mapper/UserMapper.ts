import {bookings, buildings, cities, users} from "@prisma/client";
import UserDTO from "../../model/dto/UserDTO";
import BookingDTO from "../../model/dto/BookingDTO";
import BuildingDTO from "../../model/dto/BuildingDTO";
import CityDTO from "../../model/dto/CityDTO";

// the main function to map the user to the UserDTO which is used in the service layer
/*
 * @param user: users - the user object from the database (Prisma)
 * @param city: cities - the city object from the database (Prisma)
 * @param building: buildings - the building object from the database (Prisma)
 */
export const toUserDTO = (user: users, city: cities, building: buildings): UserDTO => {
    const userDTO = new UserDTO(user.user_id); // Create a new UserDTO with the user_id
    userDTO.username = user.username;
    userDTO.firstName = user.first_name;
    userDTO.lastName = user.last_name;
    userDTO.email = user.email;
    userDTO.floor = user.floor;
    userDTO.desk = user.desk;
    userDTO.isActive = user.is_active;
    userDTO.role = user.role;

    userDTO.building = new BuildingDTO(building.building_id); // Create a new BuildingDTO with the building_id
    userDTO.building.code = building.code;
    userDTO.building.address = building.address;

    userDTO.city = new CityDTO(city.city_id); // Create a new CityDTO with the city_id, parameter city is the city object
    userDTO.city.name = city.name;
    userDTO.city.province_state = city.province_state;

    return userDTO;
};

// the main function to map the booking to the BookingDTO which is used in the service layer
const mapBookingToDTO = (booking: bookings): BookingDTO => {
    const bookingDTO = new BookingDTO(booking.booking_id);
    bookingDTO.createdBy = booking.created_by;
    bookingDTO.createdAt = booking.created_at;
    bookingDTO.startTime = booking.start_time;
    bookingDTO.endTime = booking.end_time;
    bookingDTO.status = booking.status;
    return bookingDTO;
};
