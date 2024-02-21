import {buildings, cities, rooms} from "@prisma/client";
import RoomDTO from "../../model/dto/RoomDTO";
import BuildingDTO from "../../model/dto/BuildingDTO";
import CityDTO from "../../model/dto/CityDTO";
import EquipmentDTO from "../../model/dto/EquipmentDTO";

export const toRoomDTO = (room: rooms, city: cities, building: buildings, equipmentList: any): RoomDTO => {
    const roomDTO = new RoomDTO(room.room_id);
    roomDTO.floorNumber = room.floor;
    roomDTO.roomCode = room.code;
    roomDTO.roomName = room.name;
    roomDTO.numberOfSeats = room.seats;
    roomDTO.isActive = room.is_active;

    roomDTO.building = new BuildingDTO(building.building_id);
    roomDTO.building.code = building.code;
    roomDTO.building.address = building.address;
    roomDTO.building.is_active = building.is_active;

    roomDTO.city = new CityDTO(city.city_id);
    roomDTO.city.name = city.name;
    roomDTO.city.province_state = city.province_state;

    roomDTO.equipmentList = [];
    for (const equipment of equipmentList) {
        roomDTO.equipmentList.push(mapEquipmentToDTO(equipment));
    }
    return roomDTO;
};

export const toRoomEntity = (roomDTO: RoomDTO) => {
    return {
        room_id: roomDTO.roomId,
        building_id: roomDTO.building?.buildingId,
        floor: roomDTO.floorNumber,
        code: roomDTO.roomCode,
        name: roomDTO.roomName,
        seats: roomDTO.numberOfSeats,
        is_active: roomDTO.isActive
    };
};

const mapEquipmentToDTO = (equipment: any) => {
    const equipmentDTO = new EquipmentDTO(equipment.equipments.equipment_id);
    equipmentDTO.description = equipment.equipments.description;
    return equipmentDTO;
};
