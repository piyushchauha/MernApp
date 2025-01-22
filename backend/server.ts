import express, { Application } from 'express';
//Express

//Mongoose
import mongoose from 'mongoose';
//Dotenv
import dotenv from 'dotenv';
//Cors
import cors, { CorsOptions } from 'cors';

//BodyParser
import bodyParser from 'body-parser';

//Useroute
import userRoute from './routes/userRoute';

dotenv.config();

const app: Application = express();

app.use(bodyParser.json());

app.use(express.json());

const allowedorigin = 'http://localhost:3000';

const corsoption: CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
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
mongoose.connect(process.env.URI || '').then(() => {
  console.log('Connected Successfully');
  app.listen(process.env.PORT || 8000, () => {
    console.log('Running Successfully at', process.env.PORT);
  });
});
app.use('/user', userRoute);
