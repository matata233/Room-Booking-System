import {buildings, users} from "@prisma/client";
import UserDTO from "../../model/dto/UserDTO";
import BuildingDTO from "../../model/dto/BuildingDTO";

export const toUserDTO = (user: users, building: buildings): UserDTO => {
    const userDTO = new UserDTO(user.user_id);
    userDTO.userName = user.username;
    userDTO.firstName = user.first_name;
    userDTO.lastName = user.last_name;
    userDTO.email = user.email;
    userDTO.isActive = user.is_active;
    userDTO.userRoles = user.role;

    userDTO.building = new BuildingDTO(building.building_id);
    userDTO.building.code = building.code;
    userDTO.building.address = building.address;
    userDTO.building.is_active = building.is_active;
    
    return userDTO;
}