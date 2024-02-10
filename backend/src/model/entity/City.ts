import {AbstractEntity} from "./AbstractEntity";
import {Building} from "./Building";
//TODO: Once prisma is set there will be changed here
export class City extends AbstractEntity{
    private cityId: string;
    private cityName: string;
    private provinceState: string;

    // Relationships
    private buildings?: Building[];
}