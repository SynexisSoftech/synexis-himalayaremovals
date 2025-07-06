import mongoose, { Schema, type Document } from "mongoose"

export interface ISubService extends Document {
  serviceId: mongoose.Types.ObjectId
  name: string
  description: string
  price: number
  priceType: "fixed" | "hourly" | "per_item"
  estimatedDuration?: string
  isActive: boolean
  features: string[]
  createdAt: Date
  updatedAt: Date
}

const subServiceSchema = new Schema(
  {
    serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    priceType: {
      type: String,
      enum: ["fixed", "hourly", "per_item"],
      required: true,
    },
    estimatedDuration: { type: String },
    isActive: { type: Boolean, default: true },
    features: [{ type: String }],
  },
  { timestamps: true },
)

const SubService = mongoose.models.SubService || mongoose.model<ISubService>("SubService", subServiceSchema)
export default SubService
