import express from "express";
import router from "./routes/router";

const app = express();
const endpoint: string = "/aws-room-booking/api/v1";

app.use(`${endpoint}`, router);

// sample route
// app.get("/", (req, res) => res.send("Welcome to the Awsome Booking app!"));
//
// // Another sample route
// app.get("/api/data", (req, res) => {
//     res.json({ message: "Here is your data from Awsome Booking!" });
// });

export default app;
