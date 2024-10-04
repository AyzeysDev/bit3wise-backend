import express from 'express';
import { json } from 'body-parser';
import 'express-async-errors';
import mongoose from 'mongoose';
import admin from 'firebase-admin';

import { userCreatedRouter } from './routes/create-user';
import { deleteUserRouter } from './routes/delete-user';
import { createFoodRouter } from './routes/create-food';
import { deleteFoodRouter } from './routes/delete-food';
import { getFoodRouter } from './routes/get-food';
import { getFoodHistoryReportRouter } from './routes/get-food-history-report';
import { errorHandler } from './middlewares/error-handler';
import { RouteNotFoundError } from './errors/route-not-found-error';
import { DatabaseConnectionError } from './errors/database-connection-error';

const app = express();
app.use(json());

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

//User
app.use(userCreatedRouter);
app.use(deleteUserRouter);

//Food
app.use(createFoodRouter);
app.use(deleteFoodRouter);
app.use(getFoodRouter);

//REPORT
app.use(getFoodHistoryReportRouter);

app.all('*', async (req, res) => {
    throw new RouteNotFoundError();
  });
  
app.use(errorHandler);

const start = async () => {
  try {

    await mongoose.connect('mongodb+srv://admin:admin@cluster0.wcweg.mongodb.net/bitewise?retryWrites=true&w=majority&appName=Cluster0');
    console.log('Connected to MongoDb Service');

  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    throw new DatabaseConnectionError();
  }

  app.listen(process.env.PORT || 3000, () => {
    console.log('BiteWise has arrived!');
  });
};

start();



