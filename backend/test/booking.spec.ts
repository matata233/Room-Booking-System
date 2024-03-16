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
    const bookingResult = {
        booking_id: 5,
        bookings_rooms: [
            {
                booking_id: 5,
                room_id: 1,
                rooms: {
                    building_id: 1,
                    code: "101",
                    floor: 1,
                    is_active: true,
                    name: "Stanley",
                    room_id: 1,
                    seats: 4
                }
            }
        ],
        created_at: new Date("0"),
        created_by: 1,
        end_time: new Date("2025-01-01T23:00:00.000Z"),
        start_time: new Date("2025-01-01T22:00:00.000Z"),
        status: "confirmed",
        users: {
            building_id: 1,
            desk: 105,
            email: "bbrown5888@example.com",
            first_name: "Bob",
            floor: 1,
            is_active: true,
            last_name: "Brown",
            role: "staff",
            user_id: 1,
            username: "bbrown5888"
        },
        users_bookings: [
            {
                booking_id: 5,
                room_id: 1,
                user_id: 1,
                users: {
                    building_id: 1,
                    desk: 105,
                    email: "bbrown5888@example.com",
                    first_name: "Bob",
                    floor: 1,
                    is_active: true,
                    last_name: "Brown",
                    role: "staff",
                    user_id: 1,
                    username: "bbrown5888"
                }
            },
            {
                booking_id: 5,
                room_id: 1,
                user_id: 2,
                users: {
                    building_id: 2,
                    desk: 101,
                    email: "cdavis1530@example.com",
                    first_name: "Charlie",
                    floor: 1,
                    is_active: false,
                    last_name: "Davis",
                    role: "admin",
                    user_id: 2,
                    username: "cdavis1530"
                }
            }
        ]
    };

    beforeEach(async () => {
        await initDatabase(initQueries, db);

        basicBooking = new BookingDTO();
        basicBooking.createdBy = 1;
        basicBooking.createdAt = new Date();
        basicBooking.startTime = new Date("2025-01-01T14:00:00");
        basicBooking.endTime = new Date("2025-01-01T15:00:00");
        const user1 = new UserDTO();
        user1.userId = basicBooking.createdBy;
        user1.email = "bbrown5888@example.com";
        const user2 = new UserDTO();
        user2.userId = 2;
        user2.email = "cdavis1530@example.com";
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
    });

    describe("Checking for available rooms", () => {
        it("distance check YVR", async () => {
            const result = await bookingService.getAvailableRooms(
                basicBooking.startTime!.toISOString(),
                basicBooking.endTime!.toISOString(),
                ["team7awsome01@gmail.com", "team7awsomeuser01@gmail.com", "hsiangyi1025@gmail.com"],
                ["AV", "VC"],
                []
            );
            // @ts-expect-error temp
            expect(result.groups[0].rooms).to.have.lengthOf(283);
        });


        it("room count check YVR", async () => {
            const result = await bookingService.getAvailableRooms(
                basicBooking.startTime!.toISOString(),
                basicBooking.endTime!.toISOString(),
                ["bbrown5888@example.com"],
                ["AV", "VC"],
                []
            );
            // @ts-expect-error temp
            expect(result.groups[0].rooms).to.have.lengthOf(283);
        });

        it("room count check YVR 1 conflict room", async () => {
            await bookingService.create(basicBooking);
            const result = await bookingService.getAvailableRooms(
                "2024-03-26T19:00:00.000Z",
                "2024-03-26T20:00:00.000Z",
                ["bbrown5888@example.com"],
                ["AV", "VC"],
                []
            );
            // @ts-expect-error temp
            expect(result.groups[0].rooms).to.have.lengthOf(281);
        });

        it("room count check YUL", async () => {
            const result = await bookingService.getAvailableRooms(
                basicBooking.startTime!.toISOString(),
                basicBooking.endTime!.toISOString(),
                ["hgarcia1209@example.com"],
                ["AV", "VC"],
                []
            );
            // @ts-expect-error temp
            expect(result.groups[0].rooms).to.have.lengthOf(10);
        });

        it("should resolve if no conflicting booking", async () => {
            await bookingService.create(basicBooking);
            const result = await bookingService.getAvailableRooms(
                basicBooking.startTime!.toISOString(),
                basicBooking.endTime!.toISOString(),
                ["djohnson5652@example.com"],
                ["AV", "VC"],
                []
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
                []
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
            bookingResult.created_at = result.created_at;
            expect(result).to.deep.equal(bookingResult);
        });

        it("should create valid bookings consecutively", async () => {
            await bookingService.create(basicBooking);
            basicBooking.startTime?.setHours(15);
            basicBooking.endTime?.setHours(16);
            const result = await bookingService.create(basicBooking);
            ++bookingResult.booking_id;
            ++bookingResult.bookings_rooms[0].booking_id;
            ++bookingResult.users_bookings[0].booking_id;
            ++bookingResult.users_bookings[1].booking_id;
            bookingResult.start_time.setHours(15);
            bookingResult.end_time.setHours(16);
            bookingResult.created_at = result.created_at;
            expect(result).to.deep.equal(bookingResult);
        });

        it("should create bookings with same timeslot but different rooms", async () => {
            await bookingService.create(basicBooking);
            basicBooking.roomDTOs![0].roomId = 2;
            const result = await bookingService.create(basicBooking);
            bookingResult.created_at = result.created_at;
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
