import mongoose, { Schema, type Document } from "mongoose"

export interface IBooking extends Document {
  bookingId: string
  fullName: string
  emailAddress: string
  phoneNumber: string
  serviceId: string
  serviceName: string
  subServiceId?: string
  subServiceName?: string
  subServicePrice?: number
  notes: string // ← Changed from 'details' to 'notes'
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled"
  submittedAt: Date
  createdAt: Date
  updatedAt: Date
}

const bookingSchema = new Schema(
  {
    bookingId: { type: String, required: true, unique: true },
    fullName: { type: String, required: true, trim: true },
    emailAddress: { type: String, required: true, trim: true, lowercase: true },
    phoneNumber: { type: String, required: true, trim: true },
    serviceId: { type: String, required: true },
    serviceName: { type: String, required: true },
    subServiceId: { type: String },
    subServiceName: { type: String },
    subServicePrice: { type: Number, min: 0 },
    notes: { type: String, required: true, trim: true }, // ← Changed from 'details' to 'notes'
    status: {
      type: String,
      enum: ["pending", "confirmed", "in_progress", "completed", "cancelled"],
      default: "pending",
    },
    submittedAt: { type: Date, required: true },
  },
  { timestamps: true },
)

bookingSchema.index({ bookingId: 1 }, { unique: true })

const Booking = mongoose.models.Booking || mongoose.model<IBooking>("Booking", bookingSchema)

export default Booking
