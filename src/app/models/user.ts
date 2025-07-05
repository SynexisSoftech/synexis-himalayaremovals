// src/models/User.ts
import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: String,
    email: { type: String, unique: true },
    image: String,
    googleId: { type: String, unique: true }, // Google account ID
    role: { type: String, enum: ["user", "admin"], default: "user" }, // User role
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
