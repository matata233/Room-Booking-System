import express from 'express';
import userRouter from './routes/router';
import {UserController} from "./controller/UserController";

const app = express();

// example below, to be removed later
// keep in mind there will be dependency between controller-service-repository, and they are likely singleton
const userController: UserController = new UserController();
const endpoint: string = "/awsome-booking/api/v1";

// Home route
app.get('/', (req, res) => res.send('Welcome to the Awsome Booking app!'));

// Another route
app.get('/api/data', (req, res) => {
    res.json({ message: 'Here is your data from Awsome Booking!' });
});

// Additional routes can be added here following the same pattern
app.use(`${endpoint}/user`, userRouter);

export default app;