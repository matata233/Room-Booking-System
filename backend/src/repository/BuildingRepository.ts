import AbstractRepository from "./AbstractRepository";
import BuildingDTO from "../model/dto/BuildingDTO";
import {toBuildingDTO} from "../util/Mapper/BuildingMapper";
import {PrismaClient} from "@prisma/client";
import {NotFoundError} from "../util/exception/AWSRoomBookingSystemError";

/*
For reference from Prisma schema:
model buildings {
  building_id Int     @id @default(autoincrement())
  city_id     String  @db.Char(3)
  code        Int
  address     String
  lat         Decimal @db.Decimal(9, 6)
  lon         Decimal @db.Decimal(9, 6)
  is_active   Boolean
  cities      cities  @relation(fields: [city_id], references: [city_id], onDelete: NoAction, onUpdate: NoAction)
  rooms       rooms[]
  users       users[]
}
*/
export default class BuildingRepository extends AbstractRepository {
    /**
     * Constructs a new instance of the BuildingRepository class.
     * The PrismaClient instance used for database operations.
     */
    constructor(database: PrismaClient) {
        super(database);
    }

    public async findAll(): Promise<BuildingDTO[]> {
        const buildingList = await this.db.buildings.findMany({
            include: {
                cities: true,
                rooms: true,
                users: true
            }
        });
        const buildingDTOs: BuildingDTO[] = [];
        // Convert each building to a BuildingDTO and add it to the array
        for (const building of buildingList) {
            buildingDTOs.push(toBuildingDTO(building, building.cities, building.users, building.rooms));
        }
        return buildingDTOs;
    }

    public async findById(id: number): Promise<BuildingDTO> {
        const building = await this.db.buildings.findUnique({
            where: {
                building_id: id
            },
            include: {
                cities: true,
                rooms: true,
                users: true
            }
        });
        if (!building) {
            // building not found
            throw new NotFoundError("Building not found");
        }

        const buildingDTO = toBuildingDTO(building, building.cities, building.users, building.rooms);
        return buildingDTO;
    }
}
