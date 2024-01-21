import express from "express";
import dotenv from 'dotenv'
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from './routes/authRoutes.js'
import cors from 'cors'

//Configuring dotenv
dotenv.config();

//Connecting to database
connectDB();

const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

//routes
app.use('/api/v1/auth',authRoutes);

//port
const PORT = process.env.PORT || 8000;

//app listening
app.listen(PORT,()=>{
    console.log(`App running at port ${PORT}`);
})