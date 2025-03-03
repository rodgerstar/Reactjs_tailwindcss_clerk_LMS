import mongoose from "mongoose";

// Connect to DB
const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/lms`);
        console.log('DB Connected');
    } catch (error) {
        console.error('DB Connection Error:', error);
        throw error;
    }
}

export default connectDB;