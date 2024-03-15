import {PrismaClient} from "@prisma/client";
import {expect, use} from "chai";
import chaiAsPromised from "chai-as-promised";
import BookingService from "../src/service/BookingService";
import BookingRepository from "../src/repository/BookingRepository";
import {getInitQueries, initDatabase} from "./Util";
import {BadRequestError, RequestConflictError} from "../src/util/exception/AWSRoomBookingSystemError";
import BookingDTO from "../src/model/dto/BookingDTO";
import UserDTO from "../src/model/dto/UserDTO";
import RoomDTO from "../src/model/dto/RoomDTO";

use(chaiAsPromised);

describe("Booking tests", () => {
    const db = new PrismaClient();
    const initQueries = getInitQueries();
    let basicBooking: BookingDTO;
    const bookingService = new BookingService(new BookingRepository(db));

    beforeEach(async () => {
        await initDatabase(initQueries, db);

        basicBooking = new BookingDTO();
        basicBooking.createdBy = 1;
        basicBooking.createdAt = new Date();
        basicBooking.startTime = new Date("2025-01-01T14:00:00");
        basicBooking.endTime = new Date("2025-01-01T15:00:00");
        const user = new UserDTO();
        user.userId = 2;
        basicBooking.userDTOs = [[user]];
        const room = new RoomDTO();
        room.roomId = 1;
        basicBooking.roomDTOs = [room];
    });

    describe("Fetching bookings", () => {
        it("should get all bookings", () => {
            const result = bookingService.getAll();
            return expect(result).to.eventually.have.lengthOf(1);
        });
    });

    describe("Create bookings", () => {
        it("should create valid booking", () => {
            const result = bookingService.create(basicBooking);
            return expect(result).to.eventually.equal({});
        });

        it("should create valid bookings consecutively", async () => {
            await bookingService.create(basicBooking);
            basicBooking.startTime?.setHours(15);
            basicBooking.endTime?.setHours(16);
            const result = bookingService.create(basicBooking);
            return expect(result).to.eventually.equal({});
        });

        it("should create bookings with same timeslot but different rooms", async () => {
            await bookingService.create(basicBooking);
            basicBooking.roomDTOs![0].roomId = 2;
            const result = bookingService.create(basicBooking);
            return expect(result).to.eventually.equal({});
        });

        it("should reject if booking creator does not exist", () => {
            basicBooking.createdBy = 0;
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
