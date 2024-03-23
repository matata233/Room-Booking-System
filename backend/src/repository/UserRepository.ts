import AbstractRepository from "./AbstractRepository";
import UserDTO from "../model/dto/UserDTO";
import {PrismaClient} from "@prisma/client/extension";
import {toUserDTO} from "../util/Mapper/UserMapper";
import {NotFoundError} from "../util/exception/AWSRoomBookingSystemError";

export default class UserRepository extends AbstractRepository {
    constructor(database: PrismaClient) {
        // The PrismaClient instance
        super(database);
    }

    public async findAll(): Promise<UserDTO[]> {
        const userList = await this.db.users.findMany({
            // Get all users. users is the table name in the database.
            include: {
                buildings: {
                    include: {
                        cities: true
                    }
                }
            },
            orderBy: {
                user_id: "asc"
            }
        });

        const userDTOs: UserDTO[] = [];
        for (const user of userList) {
            // toUserDTO is a function that maps the user to the UserDTO
            userDTOs.push(toUserDTO(user, user.buildings.cities, user.buildings));
        }
        return userDTOs;
    }

    public async findAllEmail(): Promise<UserDTO[]> {
        const userList = await this.db.users.findMany({
            where: {
                is_active: true
            },
            select: {
                user_id: true,
                username: true,
                first_name: true,
                email: true
            }
        });
        const userDTOs: UserDTO[] = [];
        for (const user of userList) {
            // until I can find a better way to re-construct the mapper
            // typescript prevents a partial mapping due to the fields of model is not optional
            const userDTO = new UserDTO();
            userDTO.userId = user.user_id;
            userDTO.username = user.username;
            userDTO.firstName = user.first_name;
            userDTO.email = user.email;
            userDTOs.push(userDTO);
        }
        return userDTOs;
    }

    public async findById(id: number): Promise<UserDTO> {
        // find the user by id and include the building and city
        const user = await this.db.users.findUnique({
            where: {
                user_id: id
            },
            include: {
                buildings: {
                    include: {
                        cities: true
                    }
                }
            }
        });

        if (!user) {
            //not found
            return Promise.reject(new NotFoundError(`User not found with id: ${id}`));
        }
        const userDTO = toUserDTO(user, user.buildings.cities, user.buildings);

        return userDTO;
    }

    public async findByEmail(email: string): Promise<UserDTO> {
        const user = await this.db.users.findUnique({
            where: {
                email: email
            },
            include: {
                buildings: {
                    include: {
                        cities: true
                    }
                }
            }
        });

        if (!user) {
            return Promise.reject(new NotFoundError(`User not found with email: ${email}`));
        }

        const userDTO = toUserDTO(user, user.buildings.cities, user.buildings);
        return userDTO;
    }

    public async create(user: UserDTO): Promise<UserDTO> {
        const newUser = await this.db.users.create({
            data: {
                username: user.username!,
                first_name: user.firstName!,
                last_name: user.lastName!,
                email: user.email!,
                building_id: user.building!.buildingId!,
                floor: user.floor!,
                desk: user.desk!,
                role: user.role ?? "staff",
                is_active: user.isActive ?? true,
                bookings: {
                    create: []
                },
                events: {
                    create: []
                }
            }
        });
        const getBuilding = await this.db.buildings.findUnique({
            where: {
                building_id: user.building?.buildingId
            },
            include: {
                cities: true
            }
        });
        const newUserDTO = getBuilding ? toUserDTO(newUser, getBuilding.cities, getBuilding) : ({} as UserDTO);
        return newUserDTO;
    }

    public async update(userID: number, user: UserDTO): Promise<UserDTO> {
        const updatedUser = await this.db.users.update({
            where: {
                user_id: userID
            },
            data: {
                username: user.username!,
                first_name: user.firstName!,
                last_name: user.lastName!,
                email: user.email!,
                building_id: user.building!.buildingId!,
                floor: user.floor!,
                desk: user.desk!,
                // role: user.role ?? "staff",
                is_active: user.isActive ?? true
            }
        });

        const getBuilding = await this.db.buildings.findUnique({
            where: {
                building_id: user.building?.buildingId
            },
            include: {
                cities: true
            }
        });
        const updatedUserDTO = getBuilding ? toUserDTO(updatedUser, getBuilding.cities, getBuilding) : ({} as UserDTO);
        return updatedUserDTO;
    }

    public async upload(
        userName: string,
        firstName: string,
        lastName: string,
        email: string,
        floor: number,
        desk: number,
        cityID: string,
        buildingCode: number
    ): Promise<UserDTO> {
        const buildingID = await this.getBuildingId(cityID, buildingCode);

        const user = await this.db.users.create({
            data: {
                username: userName,
                first_name: firstName,
                last_name: lastName,
                email: email,
                building_id: buildingID,
                floor: floor,
                desk: desk,
                role: "staff",
                is_active: true
            }
        });

        const getBuilding = await this.db.buildings.findUnique({
            where: {
                building_id: buildingID
            },
            include: {
                cities: true
            }
        });

        if (!getBuilding) {
            return Promise.reject(new NotFoundError(`Building not found`));
        }
        return toUserDTO(user, getBuilding.cities, getBuilding);
    }

    private async getBuildingId(city_id: string, code: number): Promise<number> {
        const building = await this.db.buildings.findUnique({
            where: {
                city_id_code: {
                    city_id: city_id,
                    code: code
                }
            },
            select: {
                building_id: true
            }
        });

        if (!building) {
            return Promise.reject(new NotFoundError(`Building not found with`));
        }
        return building.building_id;
    }
}
