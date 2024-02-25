import app from "./App";

const port = 3000;
const endpoint: string = "/aws-room-booking/api/v1";

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}${endpoint}`);
});
