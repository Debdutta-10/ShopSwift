import express from "express";
import dotenv from 'dotenv'
import morgan from "morgan";
import connectDB from "./config/db.js";

//Configuring dotenv
dotenv.config();

//Connecting to database
connectDB();

const app = express();

//middlewares
app.use(express.json());
app.use(morgan('dev'));

//port
const PORT = process.env.PORT || 8000;

//app listening
app.listen(PORT,()=>{
    console.log(`App running at port ${PORT}`);
})