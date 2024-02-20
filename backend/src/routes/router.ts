import {Router} from "express";
import RoomController from "../controller/RoomController";
import RoomService from "../service/RoomService";
import RoomRepository from "../repository/RoomRepository";
import {PrismaClient} from "@prisma/client";

const router: Router = Router();
export const database = new PrismaClient();
// const userController = new UserController();
const roomController = new RoomController(new RoomService(new RoomRepository(database)));

// User routes
// router.get("/users", userController.getAll);

// Room routes
router.get("/rooms", roomController.getAll);

export default router;
