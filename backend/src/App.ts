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
import BookingController from "./controller/BookingController";
import BookingService from "./service/BookingService";
import BookingRepository from "./repository/BookingRepository";

const app = express();
// Registers middleware
app.use(express.json()); // Enable JSON body parsing for all routes
app.use(cors()); // Enable CORS for all routes, COURS is a security feature to prevent unauthorized access to the server

const database = new PrismaClient();

const bookingController = new BookingController(new BookingService(new BookingRepository(database)));
const roomController = new RoomController(
    new RoomService(new RoomRepository(database), new BuildingRepository(database))
);

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
app.get(`${endpoint}/users/email`, userController.getByEmail); // register order matter in express
app.get(`${endpoint}/users/:id`, userController.getById);
app.post(`${endpoint}/users/create`, userController.create);

// Booking route
/*
    Currently taking the following input as parameter:
    {
        startTime: 'YYYY-MM-DDTHH-MM-SS.MMMZ',
        endTime: 'YYYY-MM-DDTHH-MM-SS.MMMZ',
        attendees: 'id1,id2,id3,...',
        equipments: 'eq1,eq2,eq3,...',
        priority: 'prio1,prio2,prio3,...'
    }
*/
app.get(`${endpoint}/booking/available-room`, bookingController.getAvailableRooms);
app.post(`${endpoint}/booking/create`, bookingController.create);

// Building routes
app.get(`${endpoint}/buildings`, buildingController.getAll);
app.get(`${endpoint}/buildings/:id`, buildingController.getById);

export default app;
