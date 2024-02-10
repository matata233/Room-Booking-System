import {AbstractEntity} from "./AbstractEntity";
import {Room} from "./Room";
import {User} from "./User";

//TODO: Once prisma is set there will be changed here
export class Building extends AbstractEntity{
    private buildingId: number;
    private cityId: string;
    private buildingNumber: string;
    private address: string;
    private lon: number;
    private lat: number;
    private isActive: boolean;

    // Relationships
    private rooms?: Room[];
    private users?: User[];
}