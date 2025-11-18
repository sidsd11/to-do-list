import express from 'express';
import userAuth from '../middleware/authUser.js';
import { getUserData } from '../controllers/dataControllers.js';

const dataRouter = express.Router();

dataRouter.get('/get-user-data', userAuth, getUserData);

export default dataRouter;