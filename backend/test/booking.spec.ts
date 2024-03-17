import {PrismaClient} from "@prisma/client";
import {expect, use} from "chai";
import chaiAsPromised from "chai-as-promised";
import BookingService from "../src/service/BookingService";
import BookingRepository from "../src/repository/BookingRepository";
import {getInitQueries, initDatabase} from "./Util";
import {
    BadRequestError,
    RequestConflictError,
    UnavailableAttendeesError
} from "../src/util/exception/AWSRoomBookingSystemError";
import BookingDTO from "../src/model/dto/BookingDTO";
import UserDTO from "../src/model/dto/UserDTO";
import RoomDTO from "../src/model/dto/RoomDTO";
import EventService from "../src/service/EventService";
import EventRepository from "../src/repository/EventRepository";
import EventDTO from "../src/model/dto/EventDTO";

use(chaiAsPromised);

describe("Booking tests", () => {
    const db = new PrismaClient();
    const initQueries = getInitQueries();
    let basicBooking: BookingDTO;
    const bookingService = new BookingService(new BookingRepository(db));
    const eventService = new EventService(new EventRepository(db));

    beforeEach(async () => {
        await initDatabase(initQueries, db);

        basicBooking = new BookingDTO();
        basicBooking.createdBy = 1;
        basicBooking.createdAt = new Date();
        basicBooking.startTime = new Date("2025-01-01T14:00:00");
        basicBooking.endTime = new Date("2025-01-01T15:00:00");
        const user1 = new UserDTO();
        user1.userId = basicBooking.createdBy;
        user1.email = "YVR32_01_1@aws.ca";
        const user2 = new UserDTO();
        user2.userId = 6;
        user2.email = "YVR41_01_1@aws.ca";
        basicBooking.userDTOs = [[user1, user2]];
        const room = new RoomDTO();
        room.roomId = 1;
        basicBooking.roomDTOs = [room];
    });

    describe("Fetching bookings", () => {
        it("should get all bookings", () => {
            const result = bookingService.getAll();
            return expect(result).to.eventually.have.lengthOf(4);
        });

        it("should get current user's bookings", async () => {
            const result = await bookingService.getByUserId(11);
            expect(result).to.have.lengthOf(2);
        });
    });

    describe("Checking for available rooms", () => {
        it("distance check YVR", async () => {
            const result = await bookingService.getAvailableRooms(
                basicBooking.startTime!.toISOString(),
                basicBooking.endTime!.toISOString(),
                ["YVR32_01_1@aws.ca", "team7awsome01@gmail.com", "team7awsomeuser01@gmail.com", "hsiangyi1025@gmail.com"],
                ["VC"],
                ["seats", "equipments", "distance"]
            );
            // @ts-expect-error temp
            expect(result.groups[0].rooms).to.have.lengthOf(283);
        });

        it("room count check YVR", async () => {
            const result = await bookingService.getAvailableRooms(
                basicBooking.startTime!.toISOString(),
                basicBooking.endTime!.toISOString(),
                ["YVR32_01_1@aws.ca"],
                ["AV", "VC"],
                ["distance", "seats", "equipments"]
            );
            // @ts-expect-error temp
            expect(result.groups[0].rooms).to.have.lengthOf(283);
        });

        it("room count check YVR 1 conflict room", async () => {
            await bookingService.create(basicBooking);
            const result = await bookingService.getAvailableRooms(
                "2024-03-26T19:00:00.000Z",
                "2024-03-26T20:00:00.000Z",
                ["YVR32_01_1@aws.ca"],
                ["AV", "VC"],
                ["distance", "seats", "equipments"]
            );
            // @ts-expect-error temp
            expect(result.groups[0].rooms).to.have.lengthOf(281);
        });

        it("room count check YUL", async () => {
            const result = await bookingService.getAvailableRooms(
                basicBooking.startTime!.toISOString(),
                basicBooking.endTime!.toISOString(),
                ["YUL22_01_1@aws.ca"],
                ["AV", "VC"],
                ["distance", "seats", "equipments"]
            );
            // @ts-expect-error temp
            expect(result.groups[0].rooms).to.have.lengthOf(10);
        });

        it("should resolve if no conflicting booking", async () => {
            await bookingService.create(basicBooking);
            const result = await bookingService.getAvailableRooms(
                basicBooking.startTime!.toISOString(),
                basicBooking.endTime!.toISOString(),
                ["YVR74_01_1@aws.ca"],
                ["AV", "VC"],
                ["distance", "seats", "equipments"]
            );
            expect(result).to.exist;
        });

        it("should reject if conflicting booking as organizer", async () => {
            await bookingService.create(basicBooking);
            const result = bookingService.getAvailableRooms(
                basicBooking.startTime!.toISOString(),
                basicBooking.endTime!.toISOString(),
                [basicBooking.userDTOs![0][0].email!],
                ["AV", "VC"],
                []
            );
            return expect(result).to.eventually.be.rejectedWith(UnavailableAttendeesError);
        });

        it("should reject if conflicting booking as participant", async () => {
            await bookingService.create(basicBooking);
            const result = bookingService.getAvailableRooms(
                basicBooking.startTime!.toISOString(),
                basicBooking.endTime!.toISOString(),
                [basicBooking.userDTOs![0][1].email!],
                ["AV", "VC"],
                []
            );
            return expect(result).to.eventually.be.rejectedWith(UnavailableAttendeesError);
        });

        it("should reject if no conflicting events", async () => {
            const event = new EventDTO();
            event.title = "event";
            event.created_by = ++basicBooking.createdBy!;
            event.startTime = basicBooking.startTime;
            event.endTime = basicBooking.endTime;
            await eventService.create(event);
            const result = await bookingService.getAvailableRooms(
                basicBooking.startTime!.toISOString(),
                basicBooking.endTime!.toISOString(),
                [basicBooking.userDTOs![0][0].email!],
                ["AV", "VC"],
                ["distance", "seats", "equipments"]
            );
            expect(result).to.exist;
        });

        it("should reject if conflicting events", async () => {
            const event = new EventDTO();
            event.title = "event";
            event.created_by = basicBooking.createdBy;
            event.startTime = basicBooking.startTime;
            event.endTime = basicBooking.endTime;
            await eventService.create(event);
            const result = bookingService.getAvailableRooms(
                basicBooking.startTime!.toISOString(),
                basicBooking.endTime!.toISOString(),
                [basicBooking.userDTOs![0][0].email!],
                ["AV", "VC"],
                []
            );
            return expect(result).to.eventually.be.rejectedWith(UnavailableAttendeesError);
        });
    });

    describe("Create bookings", () => {
        it("should create valid booking", async () => {
            const result = await bookingService.create(basicBooking);
            expect(result).to.exist;
        });

        it("should create valid bookings consecutively", async () => {
            await bookingService.create(basicBooking);
            basicBooking.startTime?.setHours(15);
            basicBooking.endTime?.setHours(16);
            const result = await bookingService.create(basicBooking);
            expect(result).to.exist;
        });

        it("should create bookings with same timeslot but different rooms", async () => {
            await bookingService.create(basicBooking);
            basicBooking.roomDTOs![0].roomId = 2;
            const result = await bookingService.create(basicBooking);
            expect(result).to.exist;
        });

        it("should reject if booking creator does not exist", () => {
            basicBooking.createdBy = 0;
            basicBooking.userDTOs![0][0].userId = 0;
            const result = bookingService.create(basicBooking);

            return expect(result).to.be.eventually.rejectedWith(BadRequestError);
        });

        it("should reject if start time has already passed", () => {
            basicBooking.startTime!.setFullYear(2023);
            basicBooking.endTime!.setFullYear(2023);
            const result = bookingService.create(basicBooking);

            return expect(result).to.be.eventually.rejectedWith(BadRequestError);
        });

        it("should reject if end time is before start time", () => {
            basicBooking.endTime!.setHours(13);
            const result = bookingService.create(basicBooking);

            return expect(result).to.be.eventually.rejectedWith(BadRequestError);
        });

        it("should reject if room has already been booked in that timeslot", async () => {
            await bookingService.create(basicBooking);
            const result = bookingService.create(basicBooking);

            return expect(result).to.eventually.be.rejectedWith(RequestConflictError);
        });
    });
});
