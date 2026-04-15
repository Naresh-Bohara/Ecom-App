import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            dbName: process.env.MONGODB_NAME,
            autoCreate: true,
            autoIndex: true,
        });
        console.log(`Successfully connected to the database: ${process.env.MONGODB_NAME}`);
    } catch (exception) {
        console.error("Error establishing database connection:", exception.message);
        process.exit(1);
    }
};

// Connect to the database
dbConnect();
