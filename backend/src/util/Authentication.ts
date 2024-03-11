import UserDTO from "../model/dto/UserDTO";
import {jwtDecode} from "jwt-decode";
import {UnauthorizedError} from "./exception/AWSRoomBookingSystemError";

//Helper function that decodes our token and checks if role == admin
export const validateAdmin = async (token: string): Promise<boolean> => {
    const user: UserDTO = jwtDecode(token);
    if (user.role === "admin") {
        return Promise.resolve(true);
    }
    return Promise.reject(new UnauthorizedError(`User ${user.email} is not an admin`));
};
//Helper function that decodes our token and checks if role == admin or role == user
export const validateUser = async (token: string): Promise<boolean> => {
    const user: UserDTO = jwtDecode(token);
    //either admin or staff will be authorized
    if (user.role === "admin" || user.role === "staff") {
        return Promise.resolve(true);
    }
    return Promise.reject(new UnauthorizedError(`User ${user.email} is not an admin`));
};
