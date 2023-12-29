import mongoose from 'mongoose';

const connectDB = async () =>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log('Connected to db');
    }
    catch{
        console.log("Error in connecting to MongoDb database");
    }
}

export default connectDB;