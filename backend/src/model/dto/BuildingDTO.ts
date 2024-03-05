import AbstractDTO from "./AbstractDTO";
import RoomDTO from "./RoomDTO";
import UserDTO from "./UserDTO";
import CityDTO from "./CityDTO";

//TODO: Until frontend team decide what data they want, there will be changed here
export default class BuildingDTO extends AbstractDTO {
    public buildingId: number;
    public code?: number;
    public address?: string;
    public lat?: number;
    public lon?: number;
    public isActive?: boolean;
    public city?: CityDTO;
    public rooms?: RoomDTO[];
    public users?: UserDTO[];

    constructor(buildingId: number) {
        super();
        this.buildingId = buildingId;
    }
}
