import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

// function to connect to mongoDb database
const connectDb = async () => {
    try {
        mongoose.connection.on('connected', () => console.log('Database connected'));

        mongoose.connection.on('error', (err) => console.log('MongoDB connection error:', err));

        await mongoose.connect(`${process.env.MONGODB_URI}`);

    } catch (error) {
        console.error('Error connecting to the database:', error);
        process.exit(1); // Exit the process with failure code
    }
}

export default connectDb;
