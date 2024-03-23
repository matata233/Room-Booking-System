import "reflect-metadata";
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
import Authenticator from "./util/Authenticator";
import EventController from "./controller/EventController";
import EventService from "./service/EventService";
import EventRepository from "./repository/EventRepository";
import multer from "multer";

const app = express();
// Registers middleware
app.use(express.json()); // Enable JSON body parsing for all routes
app.use(cors()); // Enable CORS for all routes, COURS is a security feature to prevent unauthorized access to the server

const database = new PrismaClient();

export const authenticator = Authenticator.getInstance(new UserRepository(database));

const bookingController = new BookingController(new BookingService(new BookingRepository(database)));
const roomController = new RoomController(new RoomService(new RoomRepository(database)));
const userController = new UserController(new UserService(new UserRepository(database)));
const buildingController = new BuildingController(new BuildingService(new BuildingRepository(database)));
const eventController = new EventController(new EventService(new EventRepository(database)));
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
app.put(`${endpoint}/rooms/:id`, roomController.update);

//login route
app.post(`${endpoint}/users/login`, userController.login);

// User routes
app.get(`${endpoint}/users`, userController.getAll);
app.get(`${endpoint}/users/all-email`, userController.getAllEmail);
app.get(`${endpoint}/users/email`, userController.getByEmail); // register order matter in express
app.get(`${endpoint}/users/:id`, userController.getById);
app.post(`${endpoint}/users/create`, userController.create);
app.put(`${endpoint}/users/update/:id`, userController.update);

// User upload route
const upload = multer({storage: multer.memoryStorage()}); // multer is a middleware to handle file upload
app.post(`${endpoint}/users/upload`, upload.single(`file`), userController.upload);

// Booking route
app.get(`${endpoint}/booking`, bookingController.getAll);
/*
    input:
    {
        "start_time": "YYYY-MM-DDTHH:MM:SS.MMMZ",
        "end_time": "YYYY-MM-DDTHH:MM:SS.MMMZ",
        "duration": "TT UNIT", //e.g. 2 hours
        "attendees": [ "email1", "email2", ... ],
        "equipments": [ "eq1", "eq2", ... ],
        "step_size": "TT UNIT" //optional, e.g. 15 minutes
    }

    returns:
    {
    "result": [
        {
            "start_time": "2024-03-26T00:00:00.000Z",
            "end_time": "2024-03-26T01:30:00.000Z"
        },
        {
            "start_time": "2024-03-26T02:00:00.000Z",
            "end_time": "2024-03-26T03:30:00.000Z"
        },...
*/
app.post(`${endpoint}/booking/time-suggestion`, bookingController.getSuggestedTimes);
/*
    Currently taking the following input as parameter:
    {
        startTime: 'YYYY-MM-DDTHH:MM:SS.MMMZ',
        endTime: 'YYYY-MM-DDTHH:MM:SS.MMMZ',
        attendees: ['email1,email2,email3,...'],
        equipments: ['eq1,eq2,eq3,...'],
        priority: ['prio1,prio2,prio3,...']
    }

    out:
    {
    "groups":[
        {
            "attendees":[
                {
                "id":1,
                "email":"attendee1@example.com"
                },
                {
                "id":2,
                "email":"attendee2@example.com"
                },
                {
                "id":3,
                "email":"attendee3@example.com"
                }
            ],
            "rooms":[
                {
                "roomId":1,
                "cityId":"YVR",
                "buildingCode":32,
                "floorNumber":1,
                "roomCode":"101",
                "roomName":"A",
                "numberOfSeats":4,
                "has_av": true,
                },
*/
app.post(`${endpoint}/booking/available-room`, bookingController.getAvailableRooms);
app.get(`${endpoint}/booking/currentUser`, bookingController.getByCurrentUserId);
app.get(`${endpoint}/booking/:id`, bookingController.getById);
/*
    new Date().now()
    changes:
        - backend is responsible for timeCreateAt

*/
app.post(`${endpoint}/booking/create`, bookingController.create);
app.put(`${endpoint}/booking/:id`, bookingController.update);

// Building routes
app.get(`${endpoint}/buildings`, buildingController.getAll);
app.get(`${endpoint}/buildings/:id`, buildingController.getById);

// Event routes
app.get(`${endpoint}/events`, eventController.getAllByCurrentUser);
app.get(`${endpoint}/events/:id`, eventController.getById);
app.post(`${endpoint}/events/create`, eventController.create);
app.put(`${endpoint}/events/:id`, eventController.update);
app.delete(`${endpoint}/events/:id`, eventController.delete);

export default app;
