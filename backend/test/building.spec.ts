import "reflect-metadata";
import {PrismaClient} from "@prisma/client";
import BuildingRepository from "../src/repository/BuildingRepository";
import {expect, use} from "chai";
import chaiAsPromised from "chai-as-promised";
import BuildingService from "../src/service/BuildingService";
import BuildingDTO from "../src/model/dto/BuildingDTO";
import CityDTO from "../src/model/dto/CityDTO";
import {NotFoundError} from "../src/util/exception/AWSRoomBookingSystemError";
import {getInitQueries, initDatabase} from "./Util";

use(chaiAsPromised);

describe("Building tests", function () {
    const db = new PrismaClient();
    let initQueries: string[];
    const buildingService = new BuildingService(new BuildingRepository(db));

    before(function () {
        initQueries = getInitQueries();
    });

    beforeEach(async function () {
        await initDatabase(initQueries, db);
    });

    describe("Get buildings", function () {
        let building3: BuildingDTO;

        before(function () {
            building3 = new BuildingDTO();
            building3.code = 74;
            building3.lat = 49.286433;
            building3.lon = -123.130863;
            building3.isActive = true;
            building3.city = new CityDTO();
            building3.city.cityId = "YVR";
        });

        it("should get all buildings", async function () {
            const result = await buildingService.getAll();

            expect(result[2].city!.cityId).to.equal(building3.city?.cityId);
            expect(result).to.have.lengthOf(7);
        });

        it("should get building by id", async function () {
            const result = await buildingService.getById(3);

            expect(result.city!.cityId).to.equal(building3.city!.cityId);
        });

        it("should reject if building does not exist", function () {
            const result = buildingService.getById(0);
            return expect(result).to.eventually.be.rejectedWith(NotFoundError, "Not Found: building does not exist");
        });
    });
});
