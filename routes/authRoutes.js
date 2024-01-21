import express from 'express';
import { registerController,loginController,testController,forgotPasswordController } from '../controllers/authController.js';
import {isAdmin, requireSignIn} from '../middlewares/authMiddleware.js'

const router = express.Router();

//Register
router.post('/register', registerController);

//Login
router.post('/login',loginController)

//Test Routes
router.get('/test',requireSignIn,isAdmin,testController);

//Forgot Password
router.post('/forgot-password',forgotPasswordController);

//Protected Routes
router.get("/user-auth",requireSignIn,(req,res)=>{
    res.status(200).send({ok:true});
})

export default router;
