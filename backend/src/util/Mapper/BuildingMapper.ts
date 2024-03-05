import {buildings, cities, users, rooms} from "@prisma/client";
import BuildingDTO from "../../model/dto/BuildingDTO";
import CityDTO from "../../model/dto/CityDTO";
import UserDTO from "../../model/dto/UserDTO";
import RoomDTO from "../../model/dto/RoomDTO";

export const toBuildingDTO = (building: buildings, city: cities, users: users[], rooms: rooms[]): BuildingDTO => {
    const buildingDTO = new BuildingDTO(building.building_id);
    buildingDTO.code = building.code;
    buildingDTO.address = building.address;
    buildingDTO.lat = building.lat.toNumber(); // convert decimal to number
    buildingDTO.lon = building.lon.toNumber(); // convert decimal to number
    buildingDTO.isActive = building.is_active;

    buildingDTO.city = new CityDTO(city.city_id);
    buildingDTO.city.name = city.name;
    buildingDTO.city.province_state = city.province_state;

    buildingDTO.users = [];
    for (const user of users) {
        buildingDTO.users.push(mapUserToDTO(user));
    }

    buildingDTO.rooms = [];
    for (const room of rooms) {
        buildingDTO.rooms.push(mapRoomToDTO(room));
    }

    return buildingDTO;
};

const mapUserToDTO = (user: users): UserDTO => {
    const userDTO = new UserDTO(user.user_id);
    userDTO.username = user.username;
    userDTO.firstName = user.first_name;
    userDTO.lastName = user.last_name;
    userDTO.email = user.email;
    userDTO.floor = user.floor;
    userDTO.desk = user.desk;
    userDTO.isActive = user.is_active;
    userDTO.role = user.role;
    return userDTO;
};

const mapRoomToDTO = (room: rooms): RoomDTO => {
    const roomDTO = new RoomDTO(room.room_id);
    roomDTO.floorNumber = room.floor;
    roomDTO.roomCode = room.code;
    roomDTO.roomName = room.name;
    roomDTO.numberOfSeats = room.seats;
    roomDTO.isActive = room.is_active;
    return roomDTO;
};
