import express from 'express';
import { registerController,loginController,testController } from '../controllers/authController.js';
import {isAdmin, requireSignIn} from '../middlewares/authMiddleware.js'

const router = express.Router();

//Register
router.post('/register', registerController);

//Login
router.post('/login',loginController)

//Protected Routes
router.get('/test',requireSignIn,isAdmin,testController);

export default router;
