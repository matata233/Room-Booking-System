import {bookings, users} from "@prisma/client";
import BookingDTO, {Group} from "../../model/dto/BookingDTO";
import UserDTO from "../../model/dto/UserDTO";
import {toUserDTO} from "./UserMapper";
import {toRoomDTO} from "./RoomMapper";

export const toBookingDTO = (booking: bookings, creator?: users, groups?: any): BookingDTO => {
    const bookingDTO = new BookingDTO();
    bookingDTO.bookingId = booking.booking_id;
    bookingDTO.createdBy = booking.created_by;
    bookingDTO.createdAt = booking.created_at;
    bookingDTO.startTime = booking.start_time;
    bookingDTO.endTime = booking.end_time;
    bookingDTO.status = booking.status;

    bookingDTO.users = creator ? toUserDTO(creator) : undefined;
    bookingDTO.groups = groups ? mapAttendeesToDTO(groups) : undefined; // group attendees with their rooms

    return bookingDTO;
};

const mapAttendeesToDTO = (groups: any) => {
    const result: Group[] = [];
    const usersByRoom: {[key: number]: UserDTO[]} = {};
    for (const userBooking of groups) {
        const roomDTO = toRoomDTO(userBooking.rooms);
        const userDTO = toUserDTO(userBooking.users);

        if (!usersByRoom[userBooking.room_id]) {
            usersByRoom[userBooking.room_id] = [];
        }

        usersByRoom[userBooking.room_id].push(userDTO);
    }
    for (const room_id of Object.keys(usersByRoom)) {
        const roomUsers = usersByRoom[parseInt(room_id)];
        const roomDTO =
            roomUsers.length > 0
                ? toRoomDTO(groups.find((group: any) => group.room_id === parseInt(room_id))!.rooms)
                : null;
        if (roomDTO) {
            const group: Group = {room: roomDTO, users: roomUsers};
            result.push(group);
        }
    }
    return result;
};
