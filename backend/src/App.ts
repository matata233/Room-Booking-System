import express from "express";
import {PrismaClient} from "@prisma/client";
import RoomController from "./controller/RoomController";
import RoomService from "./service/RoomService";
import RoomRepository from "./repository/RoomRepository";
import UserController from "./controller/UserController";
import UserService from "./service/UserService";
import UserRepository from "./repository/UserRepository";
import BuildingController from "./controller/BuildingController";
import BuildingService from "./service/BuildingService";
import BuildingRepository from "./repository/BuildingRepository";
import cors from "cors";

const app = express();
// Registers middleware
app.use(express.json());
app.use(cors());

const database = new PrismaClient();

const roomController = new RoomController(new RoomService(new RoomRepository(database), new BuildingRepository(database)));
const userController = new UserController(new UserService(new UserRepository(database)));
const buildingController = new BuildingController(new BuildingService(new BuildingRepository(database)));
const endpoint: string = "/aws-room-booking/api/v1";

// Sample route
app.get(`${endpoint}/`, (req, res) => res.send("Welcome to the Awsome Booking app!"));

// Sample route with data
app.get(`${endpoint}/api/data`, (req, res) => {
    res.json({message: "Here is your data from Awsome Booking!"});
});

// Room routes
app.get(`${endpoint}/rooms`, roomController.getAll);
app.get(`${endpoint}/rooms/:id`, roomController.getById);
app.post(`${endpoint}/rooms/create`, roomController.create);

//login route
app.post(`${endpoint}/users/login`, userController.login);

// User routes
app.get(`${endpoint}/users`, userController.getAll);
app.get(`${endpoint}/users/:id`, userController.getById);
app.put(`${endpoint}/users/email`, userController.getByEmail); //using put because get cannot handle req.body
app.post(`${endpoint}/users/create`, userController.create);

// Building routes
app.get(`${endpoint}/buildings`, buildingController.getAll);
app.get(`${endpoint}/buildings/:id`, buildingController.getById);

export default app;
