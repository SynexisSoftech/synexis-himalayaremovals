import { NextResponse } from "next/server";

// Enums defined in your schema. It's good practice to have these
// in a central place, maybe a types or config file, so they can be
// imported both by your Mongoose schema and your API routes.

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


/**
 * @swagger
 * /api/booking-data:
 * get:
 * summary: Retrieve data for booking form dropdowns
 * description: Fetches the enumerated values for service types, preferred times, property sizes, estimated weights, and additional services to populate the frontend booking form.
 * responses:
 * 200:
 * description: Successfully retrieved booking form data.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * serviceTypes:
 * type: array
 * items:
 * type: string
 * example: ["Household Moving", "Office/Commercial Moving", "Packing", "Storage"]
 * preferredTimes:
 * type: array
 * items:
 * type: string
 * example: ["Morning(8:00 A.M-12:00 P.M)", "Afternoon(12:00 P.M-5:00 P.M)", "Evening(5:00 P.M-8:00 P.M)"]
 * propertySizes:
 * type: array
 * items:
 * type: string
 * example: ["1 Studio", "1 Bedroom", "2 Bedrooms", "3 Bedrooms", "4+ Bedrooms", "Office Space"]
 * estimatedWeights:
 * type: array
 * items:
 * type: string
 * example: ["Light Under 500kg ", "Medium 500kg-1000kg", "Heavy Over 1000kg", " Very Heavy Over 2000kg"]
 * additionalServices:
 * type: array
 * items:
 * type: string
 * example: ["Packing materials included", "Furniture dismantling included", "Storage Service", "Insurance Coverage", "Cleaning Services", "Piano/special item moving"]
 * 500:
 * description: Internal Server Error
 */
export async function GET() {
  try {
    // This route simply transforms the enums into arrays of their values.
    // This is useful for populating dropdowns or radio buttons in a UI.
    const bookingOptions = {
      serviceTypes: Object.values(ServiceType),
      preferredTimes: Object.values(PreferredTime),
      propertySizes: Object.values(ProperSize),
      estimatedWeights: Object.values(EstimatedWeight),
      additionalServices: Object.values(AdditionalService),
    };

    return NextResponse.json(bookingOptions);
  } catch (error) {
    console.error("Failed to retrieve booking data:", error);
    // In case of any unexpected errors, return a 500 status code.
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
