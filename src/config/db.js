<<<<<<< HEAD
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Failed");
=======
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB Connection Failed');
>>>>>>> origin/master
    console.error(error.message);
    process.exit(1);
  }
};

<<<<<<< HEAD
export default connectDB;
=======
export default connectDB;
>>>>>>> origin/master
