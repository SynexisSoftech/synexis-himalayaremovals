import mongoose, { Schema, type Document } from "mongoose"

export interface IService extends Document {
  name: string
  description: string
  isActive: boolean
  basePrice?: number
  priceType: "fixed" | "hourly" | "per_item" | "custom"
  category: string
  createdAt: Date
  updatedAt: Date
}

const serviceSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    basePrice: { type: Number, min: 0 },
    priceType: {
      type: String,
      enum: ["fixed", "hourly", "per_item", "custom"],
      default: "custom",
    },
    category: { type: String, required: true, trim: true },
  },
  { timestamps: true },
)

const Service = mongoose.models.Service || mongoose.model<IService>("Service", serviceSchema)
export default Service
