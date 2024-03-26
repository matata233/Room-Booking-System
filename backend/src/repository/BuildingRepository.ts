import AbstractRepository from "./AbstractRepository";
import BuildingDTO from "../model/dto/BuildingDTO";
import {toBuildingDTO} from "../util/Mapper/BuildingMapper";
import {PrismaClient} from "@prisma/client";
import {NotFoundError} from "../util/exception/AWSRoomBookingSystemError";
import haversine from "haversine";

export default class BuildingRepository extends AbstractRepository {
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
            buildingDTOs.push(toBuildingDTO(building));
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
            throw new NotFoundError(`building does not exist`);
        }

        return toBuildingDTO(building);
    }

    public async create(dto: BuildingDTO): Promise<BuildingDTO> {
        const newBuilding = await this.db.$transaction(async (tx) => {
            const buildingAdded = await tx.buildings.create({
                data: {
                    city_id: dto.city!.cityId!,
                    code: dto.code!,
                    address: dto.address!,
                    lat: dto.lat!,
                    lon: dto.lon!,
                    is_active: dto.isActive!
                }
            });

            const buildings = await tx.buildings.findMany({
                where: {
                    city_id: buildingAdded.city_id
                }
            });

            await tx.distances.create({
                data: {
                    building_id_from: buildingAdded.building_id,
                    building_id_to: buildingAdded.building_id,
                    distance: 0
                }
            });

            const distancePromises = buildings.map((building) => {
                if (buildingAdded.building_id !== building.building_id) {
                    const distance = haversine(
                        {latitude: buildingAdded.lat.toNumber(), longitude: buildingAdded.lon.toNumber()},
                        {latitude: building.lat.toNumber(), longitude: building.lon.toNumber()},
                        {unit: "meter"}
                    );
                    return tx.distances.createMany({
                        data: [
                            {
                                building_id_from: buildingAdded.building_id,
                                building_id_to: building.building_id,
                                distance: distance
                            },
                            {
                                building_id_from: building.building_id,
                                building_id_to: buildingAdded.building_id,
                                distance: distance
                            }
                        ]
                    });
                }
                return undefined;
            });

            await Promise.all(distancePromises);

            return buildingAdded;
        });

        return toBuildingDTO(newBuilding);
    }
}
