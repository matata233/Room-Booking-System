import express from "express";
import {PrismaClient} from "@prisma/client";
import RoomController from "./controller/RoomController";
import RoomService from "./service/RoomService";
import RoomRepository from "./repository/RoomRepository";
import UserController from "./controller/UserController";
import UserService from "./service/UserService";
import UserRepository from "./repository/UserRepository";
import cors from "cors";

import UserController from "./controller/UserController";
import UserService from "./service/UserService";
import UserRepository from "./repository/UserRepository";

const app = express();
// Registers middleware
app.use(express.json());
app.use(cors());

const database = new PrismaClient();

const userController = new UserController(new UserService(new UserRepository(database)));
const roomController = new RoomController(new RoomService(new RoomRepository(database)));
const userController = new UserController(new UserService(new UserRepository(database)));

const endpoint: string = "/aws-room-booking/api/v1";

// Sample route
app.get(`${endpoint}/`, (req, res) => res.send("Welcome to the Awsome Booking app!"));

// Sample route with data
app.get(`${endpoint}/api/data`, (req, res) => {
    res.json({message: "Here is your data from Awsome Booking!"});
});

// Room routes
app.get(`${endpoint}/rooms`, roomController.getAll);


//login route
app.post(`${endpoint}/users/login`, userController.login);

// User routes
app.get(`${endpoint}/users`, userController.getAll);


export default app;
