import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const DB_URL =
  process.env.NODE_ENV === "production"
    ? process.env.MONGODB_URL
    : "mongodb://localhost:27017/intervuePoll";

const connectdatabase = async () => {
  try {
    await mongoose.set("strictQuery", true);
    await mongoose.connect(DB_URL);
    console.log("connected to database successfully");
  } catch (err) {
    console.log("error while connecting to database ", err.message);
  }
};

export default connectdatabase;
