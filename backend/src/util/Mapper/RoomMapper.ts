import {buildings, cities, rooms} from "@prisma/client";
import RoomDTO from "../../model/dto/RoomDTO";
import BuildingDTO from "../../model/dto/BuildingDTO";
import CityDTO from "../../model/dto/CityDTO";
import EquipmentDTO from "../../model/dto/EquipmentDTO";

/*
 * The RoomMapper class is responsible for converting Room entities to RoomDTOs and vice versa.

For reference, rooms is a Prisma model that looks like this:
model rooms {
    room_id          Int                @id @default(autoincrement())
    building_id      Int
    floor            Int
    code             String
    name             String?
    seats            Int
    is_active        Boolean
    bookings_rooms   bookings_rooms[]
    buildings        buildings          @relation(fields: [building_id], references: [building_id], onDelete: NoAction, onUpdate: NoAction)
    rooms_equipments rooms_equipments[]
    @@unique([building_id, floor, code])
 */

export const toRoomDTO = (room: rooms, city: cities, building: buildings, equipmentList: any): RoomDTO => {
    const roomDTO = new RoomDTO(room.room_id); // Create a new RoomDTO with the room_id
    roomDTO.floorNumber = room.floor;
    roomDTO.roomCode = room.code;
    roomDTO.roomName = room.name;
    roomDTO.numberOfSeats = room.seats;
    roomDTO.isActive = room.is_active;

    roomDTO.building = new BuildingDTO(building.building_id); // Create a new BuildingDTO with the building_id
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
