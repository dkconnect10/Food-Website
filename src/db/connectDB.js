import mongoose from "mongoose";
import { db_name } from "../../DATABASE.js";

// Set the strictQuery option
mongoose.set('strictQuery', false); // Or set to true if you want to keep the strict mode

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_DB}/${db_name}`
    );
    console.log(
      `\n MongoDB connected !! DB HOST : ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MONGODB connection FAILED", error);
    process.exit(1);
  }
};

export default connectDB;
