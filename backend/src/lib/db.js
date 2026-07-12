import mongoose from'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export const connectDB = async () => {
    const mongoUris = [process.env.MONGO_URI, process.env.MONGO_URI_FALLBACK, 'mongodb://127.0.0.1:27017/streamify_db'].filter(Boolean);

    try {
        for (const mongoUri of mongoUris) {
            try {
                const conn = await mongoose.connect(mongoUri);
                console.log(`MongoDB connected...${conn.connection.host}`);
                return true;
            } catch (error) {
                console.error('MongoDB connection attempt failed:', error.message);
            }
        }

        console.warn('MongoDB is not available. The server will continue running without a database connection.');
        return false;
    } catch (error) {
        console.log('error  in startning ',error);
        return false;
    }
};