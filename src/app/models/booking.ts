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
  details: string
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
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
    details: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    submittedAt: { type: Date, required: true },
  },
  { timestamps: true }
)

// Remove these duplicate index lines:
// bookingSchema.index({ bookingId: 1 })
// bookingSchema.index({ emailAddress: 1 })
// bookingSchema.index({ status: 1 })
// bookingSchema.index({ createdAt: -1 })

// Replace with just the essential unique index:
bookingSchema.index({ bookingId: 1 }, { unique: true })

const Booking =
  mongoose.models.Booking || mongoose.model<IBooking>('Booking', bookingSchema)
export default Booking
