import mongoose from "mongoose";
import {DB_NAME} from "../constants.js";

const connectDB = async () =>{
    try {
       const connct = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
       console.log(`MongoDB connected: ${connct.connection.host}`);       
    } catch (error) {
        console.log("mogodb connection error", error);
        process.exit(1);
    }
}

export default connectDB;