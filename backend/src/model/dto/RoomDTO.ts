import AbstractDTO from "./AbstractDTO";
import EquipmentDTO from "./EquipmentDTO";
import CityDTO from "./CityDTO";
import BuildingDTO from "./BuildingDTO";
import {plainToInstance, Type} from "class-transformer";
import {IsArray, IsBoolean, IsInt, IsOptional, IsString, Min, ValidateNested} from "class-validator";

export default class RoomDTO extends AbstractDTO {
    @IsInt()
    @IsOptional()
    public roomId?: number;

    @IsInt()
    @IsOptional()
    public floorNumber?: number;

    @IsInt()
    @Min(1)
    @IsOptional()
    public numberOfSeats?: number;

    @IsString()
    @IsOptional()
    public roomCode?: string;

    @IsString()
    @IsOptional()
    public roomName?: string;

    @IsBoolean()
    @IsOptional()
    public isActive?: boolean;

    @Type(() => CityDTO)
    @ValidateNested()
    @IsOptional()
    public city?: CityDTO;

    @Type(() => BuildingDTO)
    @ValidateNested()
    @IsOptional()
    public building?: BuildingDTO;

    @Type(() => EquipmentDTO)
    @IsArray()
    @ValidateNested({each: true})
    @IsOptional()
    public equipmentList?: EquipmentDTO[];

    constructor(body?: any) {
        super();
        if (body) {
            Object.assign(this, plainToInstance(RoomDTO, body));
            this.building = new BuildingDTO();
            this.building.buildingId = body.buildingId;
            this.equipmentList = body.equipmentIds.map((id: string) => {
                const equipment = new EquipmentDTO();
                equipment.equipmentId = id;
                return equipment;
            });
        }
    }
}
