import {AbstractDTO} from "./AbstractDTO";
import {BuildingDTO} from "./BuildingDTO";
//TODO: Until frontend team decide what data they want, there will be changed here
export class CityDTO extends AbstractDTO{
    private cityId: string;
    private cityName?: string;
    private provinceState?: string;

    // Relationships
    private buildingDtos?: BuildingDTO[];
}