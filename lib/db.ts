import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI as string;

let isConnected = false;

export async function connectToDatabase() {
  if (isConnected) return;

  if (!MONGO_URI) {
    throw new Error("MONGO_URI is not defined");
  }

  try {
    await mongoose.connect(MONGO_URI);
    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}
