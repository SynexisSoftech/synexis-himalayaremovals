import { Schema, model, models } from "mongoose"

// SubService schema
const subServiceSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Subservice title is required"],
      trim: true,
      minLength: [1, "Subservice title cannot be empty"],
    },
  },
  { _id: true },
)

// Service schema
const serviceSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Service title is required"],
      unique: true,
      trim: true,
      minLength: [1, "Service title cannot be empty"],
    },
    subServices: {
      type: [subServiceSchema],
      validate: {
        validator: (v: any[]) => v && v.length > 0,
        message: "At least one subservice is required",
      },
    },
  },
  { timestamps: true },
)

// Drop any existing indexes before creating new ones
serviceSchema.pre("init", async function () {
  try {
    const collection = this.collection
    if (collection) {
      // Try to drop old name index if it exists
      try {
        await collection.dropIndex("name_1")
        console.log("Dropped old name_1 index")
      } catch (error) {
        // Index doesn't exist, which is fine
      }
    }
  } catch (error) {
    // Ignore errors during index cleanup
  }
})

// Ensure correct indexes
serviceSchema.index({ title: 1 }, { unique: true })

export const Service = models.Service || model("Service", serviceSchema)
