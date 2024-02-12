import {AbstractDTO} from "./AbstractDTO";
import {CityDTO} from "./CityDTO";
import {BuildingDTO} from "./BuildingDTO";
import {RoomDTO} from "./RoomDTO";
//TODO: Until frontend team decide what data they want, there will be changed here
export class LocationDTO extends AbstractDTO{
    private cityDto: CityDTO;
    private buildingDto: BuildingDTO;
    private roomDto: RoomDTO;
}