// /app/models/service.ts

import { Document, Schema, model, models } from "mongoose";

// Define the ISubService interface directly in this file
export interface ISubService {
  title: string;
  description?: string;
  price?: number;
}

// Define the IService document interface
export interface IService extends Document {
  name: string;
  // +++ ADDED: title, description, and category to the interface +++
  title: string;
  description: string;
  category: string;
  moves: string[];
  isActive: boolean;
  subServices: ISubService[];
  createdAt: Date;
  updatedAt: Date;
}

// Define the SubServiceSchema directly in this file
const SubServiceSchema: Schema = new Schema<ISubService>({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number },
});

// Define the main ServiceSchema
const ServiceSchema: Schema = new Schema<IService>(
  {
    name: { type: String, required: true, unique: true },
    // +++ ADDED: The missing fields to the schema to match the API logic +++
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    moves: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
    subServices: { type: [SubServiceSchema], default: [] },
  },
  { timestamps: true }
);

// Export the model
export default models.Service || model<IService>("Service", ServiceSchema);