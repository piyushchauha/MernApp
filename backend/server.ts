import { Application } from 'express';
import { CorsOptions } from 'cors';

//Express
import express from 'express';

//Mongoose
const mongoose = require('mongoose');

//Dotenv
const dotenv = require('dotenv');

//Cors
import cors from 'cors';

//BodyParser
const bodyParser = require('body-parser');

dotenv.config();

const app: Application = express();

app.use(bodyParser.json());
const userRoute = require('./routes/userRoute');
app.use(express.json());

const allowedorigin = 'http://localhost:3000';

const corsoption: CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allowed?: boolean) => void
  ) => {
    if (origin === allowedorigin || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by Cors'));
    }
  },
  methods: ['GET', 'POST', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsoption));
// app.use(cors());
mongoose.connect(process.env.URI).then(() => {
  console.log('Connected Successfully');
  app.listen(process.env.PORT || 8000, () => {
    console.log('Running Successfully at', process.env.PORT);
  });
});
app.use('/user', userRoute);
