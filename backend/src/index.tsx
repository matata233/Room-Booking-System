import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
// import { OAuth2Client } from 'google-auth-library';

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001; // Use port from environment or fallback to 3001

// to parse JSON bodies
app.use(bodyParser.json());
app.use(cors());

// Create an instance of OAuth2Client with Google client ID
const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
// const client = new OAuth2Client(CLIENT_ID);


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});