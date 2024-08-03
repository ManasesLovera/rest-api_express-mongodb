import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';

import router from './router';

const app = express();

app.use(cors({
    credentials: true
}))

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());


app.listen(8080, () => {
    console.log('Server running on http://localhost:8080/')
})

// you must change the username and password with your own credentials
 const MONGO_URL = "mongodb+srv://<username>:<password>@<your_cluster>";


mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on('error', (error: Error) => console.log("Server working? -> "+error));
app.use('/', router)