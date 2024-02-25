import AbstractDTO from "./AbstractDTO";
import BuildingDTO from "./BuildingDTO";
export default class UserDTO extends AbstractDTO {
    public userId: number;
    public username?: string;
    public firstName?: string;
    public lastName?: string;
    public email?: string;
    public floor?: number;
    public desk?: number;
    public isActive?: boolean;
    public role?: role;
    public city?: CityDTO;
    public building?: BuildingDTO;

    constructor(userId: number) {
        super();
        this.userId = userId;
    }
}
import CityDTO from "./CityDTO";
import {role} from "@prisma/client";

