import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Connect to MongoDB
const DB = process.env.MONGODB_URI;

const connectDB = async () => {
    if (!DB) {
        console.error('Error: MONGODB_URI environment variable not set.');
        return { isConnected: false, connection: null };
        // process.exit(1);
    }
    try {
        console.log("📡 Attempting to connect to MongoDB...");
        const connection = await mongoose.connect(DB);
        console.log("✅ MongoDB connected successfully.");
        return { isConnected: true, connection };
    } catch (error) {
        console.error('Failed to Connect to MongoDB...', error.message);
        return { isConnected: false, connection: null };
        //process.exit(1); // Exit the process with failure
    }
}


export default connectDB;