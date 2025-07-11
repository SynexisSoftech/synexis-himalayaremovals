import { Schema, model, models } from "mongoose"

// SubService schema
const subServiceSchema = new Schema(
  {
    title: { type: String, required: true },
  },
  { _id: true },
)

// Service schema
const serviceSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    subServices: [subServiceSchema],
  },
  { timestamps: true },
)

// Ensure indexes are properly set
serviceSchema.index({ title: 1 }, { unique: true })

export const Service = models.Service || model("Service", serviceSchema)
