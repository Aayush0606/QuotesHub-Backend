import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const mongoURI = process.env.DATABASE_ENTRY_POINT;

const connectToMongo = () => {
  mongoose.connect(mongoURI, () => {
    console.log("Connected");
  });
};

export default connectToMongo;
