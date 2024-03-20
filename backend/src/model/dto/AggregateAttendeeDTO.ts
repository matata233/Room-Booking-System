import AbstractDTO from "./AbstractDTO";
import UserDTO from "./UserDTO";
//TODO: Until frontend team decide what data they want, there will be changed here
export default class AggregateAttendeeDTO extends AbstractDTO {
    public building_id: string;
    public num_users?: number;
    public floor?: number;
    public users?: string[];
    public closest_buildings?: number[];

    constructor(building_id: string) {
        super();
        this.building_id = building_id;
    }
}
