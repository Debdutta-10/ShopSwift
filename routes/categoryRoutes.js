import express from 'express'
import {isAdmin, requireSignIn} from '../middlewares/authMiddleware.js'
import { createCategoryController,updateCategoryController,categoryController, singlecategoryController,deletecategoryController } from "../controllers/categoryController.js";


const router = express.Router();

router.post('/create-category',requireSignIn,isAdmin,createCategoryController)
router.put('/update-category/:id',requireSignIn,isAdmin,updateCategoryController);
router.get('/get-category',categoryController)
router.get('/get-singlecategory/:slug',singlecategoryController)
router.delete('/delete-category/:id',deletecategoryController)

export default router