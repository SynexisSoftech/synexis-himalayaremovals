import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { connectToDatabase } from "@/app/lib/mongodb"
import Booking from "@/app/models/booking"

// Helper function to safely convert date to ISO string
const safeToISOString = (date: any): string => {
  if (!date) return new Date().toISOString()
  if (date instanceof Date) return date.toISOString()
  if (typeof date === "string") return new Date(date).toISOString()
  if (date.$date) return new Date(date.$date).toISOString()
  return new Date().toISOString()
}

// GET - Get all bookings with optional filters
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 401 })
    }

    await connectToDatabase()

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const search = searchParams.get("search")
    const dateFrom = searchParams.get("dateFrom")
    const dateTo = searchParams.get("dateTo")

    console.log("Fetching bookings with filters:", { status, search, dateFrom, dateTo })

    // Build filter object
    const filter: any = {}

    // Status filter
    if (status && status !== "all") {
      filter.status = status
    }

    // Search filter
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { emailAddress: { $regex: search, $options: "i" } },
        { bookingId: { $regex: search, $options: "i" } },
        { serviceName: { $regex: search, $options: "i" } },
      ]
    }

    // Date filters
    if (dateFrom || dateTo) {
      filter.submittedAt = {}
      if (dateFrom) {
        filter.submittedAt.$gte = new Date(dateFrom)
      }
      if (dateTo) {
        filter.submittedAt.$lte = new Date(dateTo + "T23:59:59.999Z")
      }
    }

    console.log("MongoDB filter:", JSON.stringify(filter, null, 2))

    // Fetch bookings with filters, sorted by most recent first
    const bookings = await Booking.find(filter).sort({ submittedAt: -1 }).lean()

    console.log(`Found ${bookings.length} bookings`)

    // Format bookings for frontend with safe date handling
    const formattedBookings = bookings.map((booking) => {
      console.log("Processing booking:", booking.bookingId, {
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
        submittedAt: booking.submittedAt,
      })

      return {
        _id: booking._id.toString(),
        bookingId: booking.bookingId || "",
        fullName: booking.fullName || "",
        emailAddress: booking.emailAddress || "",
        phoneNumber: booking.phoneNumber || "",
        serviceId: booking.serviceId || "",
        serviceName: booking.serviceName || "",
        subServiceId: booking.subServiceId || "",
        subServiceName: booking.subServiceName || "",
        subServicePrice: booking.subServicePrice || 0,
        details: booking.details || "",
        status: booking.status || "pending",
        createdAt: safeToISOString(booking.createdAt),
        updatedAt: safeToISOString(booking.updatedAt),
        submittedAt: safeToISOString(booking.submittedAt),
      }
    })

    console.log("Formatted bookings sample:", formattedBookings.slice(0, 1))

    return NextResponse.json({
      success: true,
      bookings: formattedBookings,
      total: formattedBookings.length,
    })
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch bookings",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
