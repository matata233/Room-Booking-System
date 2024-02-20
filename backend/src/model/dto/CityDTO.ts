import AbstractDTO from "./AbstractDTO";
import BuildingDTO from "./BuildingDTO";
//TODO: Until frontend team decide what data they want, there will be changed here
export default class CityDTO extends AbstractDTO {
    public cityId: string;
    public name?: string;
    public province_state?: string;
    public buildingDTOs?: BuildingDTO[];

    constructor(cityId: string) {
        super();
        this.cityId = cityId;
    }
}
