import AbstractDTO from "./AbstractDTO";
import RoomDTO from "./RoomDTO";

export default class EquipmentDTO extends AbstractDTO {
    public equipmentId?: string;
    public description?: string;
    public roomDTOs?: RoomDTO[];

    constructor() {
        super();
    }
}
