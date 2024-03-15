import {buildings, cities, users, rooms} from "@prisma/client";
import BuildingDTO from "../../model/dto/BuildingDTO";
import CityDTO from "../../model/dto/CityDTO";
import UserDTO from "../../model/dto/UserDTO";
import RoomDTO from "../../model/dto/RoomDTO";
import {toUserDTO} from "./UserMapper";
import {toRoomDTO} from "./RoomMapper";

export const toBuildingDTO = (building: buildings, city: cities, users: users[], rooms: rooms[]): BuildingDTO => {
    const buildingDTO = new BuildingDTO();
    buildingDTO.buildingId = building.building_id;
    buildingDTO.code = building.code;
    buildingDTO.address = building.address;
    buildingDTO.lat = building.lat.toNumber(); // convert decimal to number
    buildingDTO.lon = building.lon.toNumber(); // convert decimal to number
    buildingDTO.isActive = building.is_active;

    buildingDTO.city = new CityDTO();
    buildingDTO.city.cityId = city.city_id;
    buildingDTO.city.name = city.name;
    buildingDTO.city.province_state = city.province_state;

    buildingDTO.users = [];
    for (const user of users) {
        buildingDTO.users.push(toUserDTO(user));
    }

    buildingDTO.rooms = [];
    for (const room of rooms) {
        buildingDTO.rooms.push(toRoomDTO(room));
    }

    return buildingDTO;
};
