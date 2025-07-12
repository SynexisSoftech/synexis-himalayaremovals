// src/app/models/booking.ts

import { Schema, model, models, Types } from "mongoose"

const bookingSchema = new Schema(
  {
    // 1. Personal Information
    fullName: { type: String, required: [true, "Full name is required"], trim: true },
    phoneNumber: { type: String, required: [true, "Phone number is required"], trim: true },
    email: { type: String, required: [true, "Email is required"], trim: true, lowercase: true },

    // 2. Move Details
    fromAddress: { type: String, required: [true, "Moving from address is required"] },
    fromPostcode: { type: String, required: [true, "From postcode is required"] },
    toAddress: { type: String, required: [true, "Moving to address is required"] },
    toPostcode: { type: String, required: [true, "To postcode is required"] },
    moveDate: { type: Date, required: [true, "Move date is required"] },

    customDateDescription: { type: String, default: null },
    preferredTime: {
      type: String,
      enum: ["Morning", "Afternoon", "Evening", "Custom"],
      required: [true, "Preferred time is required"],
    },
    others: { type: String, default: null },

    // 3. Services
    service: {
      type: Types.ObjectId,
      ref: "Service",
      required: [true, "Service is required"],
    },
    subServices: [
      {
        type: String,
        required: true,
      },
    ],

    // 4. Booking Status
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
)

export const Booking = models.Booking || model("Booking", bookingSchema)
