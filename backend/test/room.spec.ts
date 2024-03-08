import {PrismaClient} from "@prisma/client";
import RoomRepository from "../src/repository/RoomRepository";
import RoomService from "../src/service/RoomService";
import * as fs from "fs";
import BuildingRepository from "../src/repository/BuildingRepository";
import RoomDTO from "../src/model/dto/RoomDTO";
import {expect, use} from "chai";
import BuildingDTO from "../src/model/dto/BuildingDTO";
import EquipmentDTO from "../src/model/dto/EquipmentDTO";
import {BadRequestError, NotFoundError} from "../src/util/exception/AWSRoomBookingSystemError";
import CityDTO from "../src/model/dto/CityDTO";
import chaiAsPromised from "chai-as-promised";

use(chaiAsPromised);

describe("Room tests", function() {
    const db = new PrismaClient();
    let initQueries: string[];
    const roomService = new RoomService(new RoomRepository(db), new BuildingRepository(db));

    before(function() {
        initQueries = fs.readFileSync("./init.sql").toString().split(";");
    });

    beforeEach(async function() {
        for (const query of initQueries) {
            await db.$queryRawUnsafe(query);
        }
    });

    describe("Get rooms", function() {
        let room17: RoomDTO;

        before(function() {
            room17 = new RoomDTO();
            room17.roomId = 17;
            room17.floorNumber = 3;
            room17.roomName = "Ravine";
            room17.roomCode = "406";
            room17.numberOfSeats = 10;
            room17.isActive = true;

            const expectedBuilding = new BuildingDTO();
            expectedBuilding.buildingId = 1;
            expectedBuilding.code = 32;
            expectedBuilding.address = "32 Vancouver St, Vancouver, BC A1B 2C3";
            expectedBuilding.isActive = true;
            room17.building = expectedBuilding;

            const expectedCity = new CityDTO();
            expectedCity.cityId = "YVR";
            expectedCity.name = "Vancouver";
            expectedCity.province_state = "BC";
            room17.city = expectedCity;

            const equipment1 = new EquipmentDTO();
            equipment1.equipmentId = "AV";
            equipment1.description = "Audio visual equipment in room";
            const equipment2 = new EquipmentDTO();
            equipment2.equipmentId = "VC";
            equipment2.description = "Video Conference equipment in room";
            room17.equipmentList = [];
            room17.equipmentList.push(equipment1);
            room17.equipmentList.push(equipment2);
        });

        it("should get all rooms", async function() {
            const result = await roomService.getAll();

            expect(result).to.have.lengthOf(348);
            expect(result[16]).to.deep.equals(room17);
        });

        it("should get room by id", function() {
            const result = roomService.getById(17);

            return expect(result).to.eventually.deep.equals(room17);
        });

        it("should reject if room does not exist", function() {
            const result = roomService.getById(0);

            return expect(result).to.eventually.be.rejectedWith(NotFoundError);
        });
    });

    describe("Create rooms", function() {
        let sampleRoom: RoomDTO;

        beforeEach(async function() {
            sampleRoom = new RoomDTO();
            sampleRoom.building = new BuildingDTO();
            sampleRoom.building.buildingId = 1;
            sampleRoom.floorNumber = 1;
            sampleRoom.roomName = null;
            sampleRoom.roomCode = "1012";
            sampleRoom.numberOfSeats = 10;
            sampleRoom.equipmentList = [];
            const AV = new EquipmentDTO();
            AV.equipmentId = "AV";
            sampleRoom.equipmentList.push(AV);
            sampleRoom.isActive = true;
        });

        it("should create valid room", function() {
            const expected = new RoomDTO();
            expected.roomId = 349;

            const result = roomService.create(sampleRoom);

            return expect(result).to.eventually.deep.equals(expected);
        });

        it("should not create duplicate room", function() {
            sampleRoom.roomCode = "101";

            const result = roomService.create(sampleRoom);

            return expect(result).to.eventually.be.rejectedWith(BadRequestError);
        });

        it("should not create room when building does not exist", function() {
            sampleRoom.building!.buildingId = 0;

            const result = roomService.create(sampleRoom);

            return expect(result).to.eventually.be.rejectedWith(BadRequestError);
        });

        it("should not create room with invalid equipments", function() {
            const DNE = new EquipmentDTO();
            DNE.equipmentId = "DNE";
            sampleRoom.equipmentList?.push(DNE);

            const result = roomService.create(sampleRoom);

            return expect(result).to.eventually.be.rejectedWith(BadRequestError);
        });

        it("should not create room when floor number is not a number", function() {
            sampleRoom.floorNumber = [] as unknown as number;

            const result = roomService.create(sampleRoom);

            return expect(result).to.eventually.be.rejectedWith(BadRequestError);
        });
    });
});

// it("sample tests", async function() {
//     // 1. Make sure you have correctly installed PostgreSQL locally
//     // 2. Make sure you have correctly set up the DATABASE_URL in the .env file
//     // 3. Run "prisma db push" to sync the schema.prisma file with the db
//     const db = new PrismaClient();
//     const roomRepo = new RoomRepository(db);
//     const roomService = new RoomService(roomRepo);
//
//     // Remove all existing data
//     await db.rooms_equipments.deleteMany({});
//     await db.rooms.deleteMany({});
//     await db.equipments.deleteMany({});
//     await db.buildings.deleteMany({});
//     await db.cities.deleteMany({});
//
//     await db.bookings.deleteMany({});
//     await db.bookings_rooms.deleteMany({});
//     await db.users.deleteMany({});
//     await db.users_bookings.deleteMany({});
//
//     // Create cities
//     await db.cities.createMany({
//         data: [
//             {city_id: "YVR", name: "Vancouver", province_state: "BC"},
//             {city_id: "YYZ", name: "Toronto", province_state: "ON"},
//             {city_id: "YUL", name: "Montreal", province_state: "QC"}
//         ]
//     });
//
//     // Create buildings
//     const YVR32 = await db.buildings.create({
//         data: {city_id: "YVR", code: 32, address: "BC", lon: 0.11111, lat: 0.22222, is_active: true}
//     });
//
//     // Create equipments
//     const AV = await db.equipments.create({
//         data: {equipment_id: "AV", description: "Audio/Video Equipment"}
//     });
//
//     const VC = await db.equipments.create({
//         data: {equipment_id: "VC", description: "Video Conference Equipment"}
//     });
//
//     // Create rooms
//     const YVR32_01_101 = await db.rooms.create({
//         data: {building_id: YVR32.building_id, floor: 1, code: "101", name: "Stanley", seats: 4, is_active: true}
//     });
//
//     await db.rooms_equipments.create({
//         data: {room_id: YVR32_01_101.room_id, equipment_id: AV.equipment_id}
//     });
//
//     await db.rooms_equipments.create({
//         data: {room_id: YVR32_01_101.room_id, equipment_id: VC.equipment_id}
//     });
//
//     const YVR32_01_102 = await db.rooms.create({
//         data: {building_id: YVR32.building_id, floor: 1, code: "102", name: "Trafalgar", seats: 6, is_active: true}
//     });
//
//     let roomDTOs: RoomDTO[] = await roomRepo.findAll();
//
//     // console.log("cities:", await db.cities.findMany());
//     // console.log("equipments:", await db.equipments.findMany());
//     // console.log("rooms:", await db.rooms.findMany());
//     // console.log("rooms_equipments:", await db.rooms_equipments.findMany());
//     console.dir(roomDTOs, {depth: null});
//     console.log(JSON.stringify(roomDTOs, null, 2));
//     roomDTOs = await roomService.getAll();
//     console.dir(roomDTOs, {depth: null});
//     console.log(JSON.stringify(roomDTOs, null, 2));
// });
