import {PrismaClient} from "@prisma/client";
import RoomRepository from "../src/repository/RoomRepository";
import RoomDTO from "../src/model/dto/RoomDTO";
import RoomService from "../src/service/RoomService";

it("test api /rooms/", async function () {
    // 1. Make sure you have correctly installed PostgreSQL locally
    // 2. Make sure you have correctly set up the DATABASE_URL in the .env file
    // 3. Run "prisma db push" to sync the schema.prisma file with the db
    const db = new PrismaClient();
    const roomRepo = new RoomRepository(db);
    const roomService = new RoomService(roomRepo);

    // Remove all existing data
    await db.rooms_equipments.deleteMany({});
    await db.rooms.deleteMany({});
    await db.equipments.deleteMany({});
    await db.buildings.deleteMany({});
    await db.cities.deleteMany({});

    await db.bookings.deleteMany({});
    await db.bookings_rooms.deleteMany({});
    await db.users.deleteMany({});
    await db.users_bookings.deleteMany({});

    // Create cities
    await db.cities.createMany({
        data: [
            {city_id: "YVR", name: "Vancouver", province_state: "BC"},
            {city_id: "YYZ", name: "Toronto", province_state: "ON"},
            {city_id: "YUL", name: "Montreal", province_state: "QC"}
        ]
    });

    // Create buildings
    const YVR32 = await db.buildings.create({
        data: {city_id: "YVR", code: 32, address: "BC", lon: 0.11111, lat: 0.22222, is_active: true}
    });

    // Create equipments
    const AV = await db.equipments.create({
        data: {equipment_id: "AV", description: "Audio/Video Equipment"}
    });

    const VC = await db.equipments.create({
        data: {equipment_id: "VC", description: "Video Conference Equipment"}
    });

    // Create rooms
    const YVR32_01_101 = await db.rooms.create({
        data: {building_id: YVR32.building_id, floor: 1, code: "101", name: "Stanley", seats: 4, is_active: true}
    });

    await db.rooms_equipments.create({
        data: {room_id: YVR32_01_101.room_id, equipment_id: AV.equipment_id}
    });

    await db.rooms_equipments.create({
        data: {room_id: YVR32_01_101.room_id, equipment_id: VC.equipment_id}
    });

    const YVR32_01_102 = await db.rooms.create({
        data: {building_id: YVR32.building_id, floor: 1, code: "102", name: "Trafalgar", seats: 6, is_active: true}
    });

    let roomDTOs: RoomDTO[] = await roomRepo.findAll();

    // console.log("cities:", await db.cities.findMany());
    // console.log("equipments:", await db.equipments.findMany());
    // console.log("rooms:", await db.rooms.findMany());
    // console.log("rooms_equipments:", await db.rooms_equipments.findMany());
    console.dir(roomDTOs, {depth: null});
    console.log(JSON.stringify(roomDTOs, null, 2));
    roomDTOs = await roomService.getAll();
    console.dir(roomDTOs, {depth: null});
    console.log(JSON.stringify(roomDTOs, null, 2));
});
