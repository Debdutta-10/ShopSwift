import express from 'express'
import {isAdmin, requireSignIn} from '../middlewares/authMiddleware.js'
import { createProductController,deleteProductController,getProductController,getSingleProductController,productPhotoController, updateProductController,productFiltersController,searchProductController } from '../controllers/productController.js';
import formidable from 'express-formidable';

const router = express.Router();

//routes
router.post('/create-product',requireSignIn,isAdmin,formidable(),createProductController);
router.get('/get-product',getProductController);
router.get('/get-product/:slug',getSingleProductController);
router.get('/product-photo/:pid',productPhotoController);
router.delete('/delete-product/:pid', deleteProductController);
router.put('/update-product/:pid',requireSignIn,isAdmin,formidable(),updateProductController);
router.post("/product-filters", productFiltersController);
router.get("/search/:keyword", searchProductController);
export default router
