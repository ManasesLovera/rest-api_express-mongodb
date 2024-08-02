import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();

app.use(cors({
    credentials: true
}))

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(3001, () => {
    console.log('Server running on http://localhost:3001/')
})

// you must change the username and password with your own credentials
//const MONGO_URL = "mongodb+srv://<username>:<password>@cluster0.e4rojqs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const MONGO_URL = "mongodb+srv://manaseslovera:manaseslovera@cluster0.e4rojqs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on('error', (error: Error) => console.log("Server working? -> Error: "+error));