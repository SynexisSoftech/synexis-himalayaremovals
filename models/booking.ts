import mongoose from "mongoose"

export enum ServiceType {
  HOUSEHOLD_MOVING = "Household Moving",
  OFFICE_COMMERCIAL_MOVING = "Office/Commercial Moving",
  PACKING_ONLY = "Packing",
  STORAGE_SERVICE = "Storage",
}

export enum PreferredTime {
  MORNING = "Morning(8:00 A.M-12:00 P.M)",
  AFTERNOON = "Afternoon(12:00 P.M-5:00 P.M)",
  EVENING = "Evening(5:00 P.M-8:00 P.M)",
}

export enum ProperSize {
  STUDIO = "1 Studio",
  ONE_BEDROOM = "1 Bedroom",
  TWO_BEDROOM = "2 Bedrooms",
  THREE_BEDROOM = "3 Bedrooms",
  FOUR_BEDROOM = "4+ Bedrooms",
  OFFICE_SPACE = "Office Space",
}

export enum EstimatedWeight {
  LIGHT = "Light Under 500kg ",
  MEDIUM = "Medium 500kg-1000kg",
  HEAVY = "Heavy Over 1000kg",
  VERY_HEAVY = " Very Heavy Over 2000kg",
}

export enum AdditionalService {
  PACKING = "Packing materials included",
  FURNITURE_DISMANTLING = "Furniture dismantling included",
  STORAGE_SERVICE = "Storage Service",
  INSURANCE = "Insurance Coverage",
  CLEANING_SERVICES = "Cleaning Services",
  PIANO = "Piano/special item moving",
}

const bookingSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    emailAddress: { type: String, required: true },
    phoneNumber: { type: String, required: true }, // Changed from Number to String
    serviceType: {
      type: String,
      enum: Object.values(ServiceType),
      required: true,
    },
    fromLocation: { type: String, required: true },
    toLocation: { type: String, required: true },
    preferredMovingdate: { type: Date, required: true }, // Changed from Number to Date
    preferredTime: {
      type: String,
      enum: Object.values(PreferredTime),
      required: true,
    },
    ProperSize: {
      type: String,
      enum: Object.values(ProperSize),
      required: true,
    },
    EstimatedWeight: {
      type: String,
      enum: Object.values(EstimatedWeight),
      required: true,
    },
    SpecialRequirement: { type: String, required: true },
    AdditionalService: {
      type: String,
      enum: Object.values(AdditionalService),
      required: true,
    },
  },
  {
    timestamps: true, // This will add createdAt and updatedAt fields
  },
)

const Booking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema)
export default Booking
