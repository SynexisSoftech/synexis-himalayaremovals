// models/contact.ts
import mongoose, { Schema, type Document } from "mongoose"
import { SERVICE_TYPES } from "../lib/constant" // Import the constant

export interface IContact extends Document {
  fullname: string
  email: string
  phonenumber: number
  serviceRequired: (typeof SERVICE_TYPES)[number] // Use typeof SERVICE_TYPES[number] for type safety
  message: string
  createdAt: Date
}

const ContactSchema: Schema = new Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true },
  phonenumber: { type: Number, required: true },
  serviceRequired: {
    type: String,
    required: true,
    enum: SERVICE_TYPES, // Use the imported constant
  },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

// Check if the model already exists to prevent Mongoose from recompiling it
// Export it as ContactModel to avoid naming conflicts with the React component
const ContactModel = mongoose.models.Contact || mongoose.model<IContact>("Contact", ContactSchema)
export default ContactModel
