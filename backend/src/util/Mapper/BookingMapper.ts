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

interface AvailableRoomDTO {
    roomId: number;
    buildingId: number;
    floor: number;
    code: string;
    name: string;
    seats: number;
    isActive: boolean;
    hasAV: boolean;
    hasVC: boolean;
    isBigEnough: boolean;
    distance: number;
    recommended: boolean;
}

export const toAvailableRoomDTO = (resFromRawQuery: any[], equipmentNeeded: string[]): any => {
    const availableRooms: AvailableRoomDTO[] = [];
    for (const res of resFromRawQuery) {
        let isRecommended = false;
        if (res.is_big_enough) {
            if (equipmentNeeded.length === 0) {
                isRecommended = true;
            } else if (equipmentNeeded.length === 2 && res.has_av && res.has_vc) {
                isRecommended = true;
            } else if (equipmentNeeded.includes("AV") && res.has_av) {
                isRecommended = true;
            } else if (equipmentNeeded.includes("VC") && res.has_vc) {
                isRecommended = true;
            }
        }

        const availableRoom = {
            roomId: res.room_id,
            buildingId: res.building_id,
            floor: res.floor,
            code: res.code,
            name: res.name,
            seats: res.seats,
            isActive: res.is_active,
            hasAV: res.has_av,
            hasVC: res.has_vc,
            isBigEnough: res.is_big_enough,
            distance: res.distance,
            recommended: isRecommended
        };
        availableRooms.push(availableRoom);
    }
    return availableRooms;
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
