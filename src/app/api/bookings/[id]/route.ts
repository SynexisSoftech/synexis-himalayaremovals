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

// GET - Get specific booking details
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 401 })
    }

    // Await params before accessing properties
    const { id } = await params
    console.log("Fetching booking with ID:", id)

    await connectToDatabase()

    // Find booking by bookingId (not MongoDB _id)
    const booking = await Booking.findOne({ bookingId: id }).lean()

    if (!booking) {
      console.log("Booking not found:", id)
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    console.log("Found booking:", (booking as any).bookingId)

    const formattedBooking = {
      _id: (booking as any)._id.toString(),
      bookingId: (booking as any).bookingId || "",
      fullName: (booking as any).fullName || "",
      emailAddress: (booking as any).emailAddress || "",
      phoneNumber: (booking as any).phoneNumber || "",
      serviceId: (booking as any).serviceId || "",
      serviceName: (booking as any).serviceName || "",
      subServiceId: (booking as any).subServiceId || "",
      subServiceName: (booking as any).subServiceName || "",
      subServicePrice: (booking as any).subServicePrice || 0,
      details: (booking as any).details || "",
      status: (booking as any).status || "pending",
      createdAt: safeToISOString((booking as any).createdAt),
      updatedAt: safeToISOString((booking as any).updatedAt),
      submittedAt: safeToISOString((booking as any).submittedAt),
    }

    return NextResponse.json({
      success: true,
      booking: formattedBooking,
    })
  } catch (error) {
    console.error("Error fetching booking:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch booking",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// PUT - Update booking status and details
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 401 })
    }

    // Await params before accessing properties
    const { id } = await params
    console.log("Updating booking with ID:", id)

    const body = await request.json()
    const { status, notes, details } = body

    console.log("Update data:", { status, notes, details })

    // Validate status if provided
    if (status && !["pending", "confirmed", "in_progress", "completed", "cancelled"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    await connectToDatabase()

    // Build update object
    const updateData: any = {}
    if (status) updateData.status = status
    if (notes) updateData.notes = notes
    if (details) updateData.details = details

    console.log("MongoDB update data:", updateData)

    // Find and update booking by bookingId
    const booking = await Booking.findOneAndUpdate({ bookingId: id }, updateData, { new: true }).lean()

    if (!booking) {
      console.log("Booking not found for update:", id)
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    console.log("Successfully updated booking:", (booking as any).bookingId)

    const formattedBooking = {
      _id: (booking as any)._id.toString(),
      bookingId: (booking as any).bookingId,
      status: (booking as any).status,
      details: (booking as any).details,
      updatedAt: safeToISOString((booking as any).updatedAt),
    }

    return NextResponse.json({
      success: true,
      message: `Booking ${status ? `status updated to ${status}` : "updated successfully"}`,
      booking: formattedBooking,
    })
  } catch (error) {
    console.error("Error updating booking:", error)
    return NextResponse.json(
      {
        error: "Failed to update booking",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// DELETE - Delete booking
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    console.log("DELETE request received")
    
    const session = await auth()
    console.log("Session:", session ? "Authenticated" : "Not authenticated")
    console.log("User role:", session?.user?.role)
    
    if (!session || session.user?.role !== "admin") {
      console.log("Unauthorized access attempt")
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 401 })
    }

    // Await params before accessing properties
    const { id } = await params
    console.log("Deleting booking with ID:", id)

    await connectToDatabase()
    console.log("Database connected")

    // Find and delete booking by bookingId
    const booking = await Booking.findOneAndDelete({ bookingId: id }).lean()
    console.log("Delete query result:", booking ? "Found and deleted" : "Not found")

    if (!booking) {
      console.log("Booking not found for deletion:", id)
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    console.log("Successfully deleted booking:", (booking as any).bookingId)

    const response = {
      success: true,
      message: "Booking deleted successfully",
      deletedBookingId: (booking as any).bookingId,
    }
    
    console.log("Sending response:", response)
    return NextResponse.json(response)
  } catch (error) {
    console.error("Error deleting booking:", error)
    return NextResponse.json(
      {
        error: "Failed to delete booking",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
} 