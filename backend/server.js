//Express
const express = require('express');
const app = express();

//Mongoose
const mongoose = require('mongoose');

//Dotenv
const dotenv = require('dotenv');

//Cors
const cors = require('cors');

//BodyParser
const bodyParser = require('body-parser');

dotenv.config();
app.use(bodyParser.json());
const userRoute = require('./routes/userRoute');
app.use(express.json());

const allowedorigin = 'http://localhost:3000';

const corsoption = {
  origin: (origin, callback) => {
    if (origin == allowedorigin || !origin) {
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
  app.listen(process.env.PORT || 8000, err => {
    if (err) console.log(err);
    console.log('Running Successfully at', process.env.PORT);
  });
});
app.use('/user', userRoute);
