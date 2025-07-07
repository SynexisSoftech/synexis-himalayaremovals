import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { connectToDatabase } from "@/app/lib/mongodb"
import Booking from "@/app/models/booking"

// GET - Get specific booking details
export async function GET(request: NextRequest, { params }: { params: Promise<{ bookingId: string }> }) {
  try {
    const session = await auth()

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 401 })
    }

    // Await params before accessing properties
    const { bookingId } = await params

    await connectToDatabase()

    const booking = await Booking.findOne({ bookingId }).lean()

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    const formattedBooking = {
      ...booking,
      _id: booking._id.toString(),
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
      submittedAt: booking.submittedAt.toISOString(),
    }

    return NextResponse.json({
      success: true,
      booking: formattedBooking,
    })
  } catch (error) {
    console.error("Error fetching booking:", error)
    return NextResponse.json({ error: "Failed to fetch booking" }, { status: 500 })
  }
}

// PUT - Update booking status
export async function PUT(request: NextRequest, { params }: { params: Promise<{ bookingId: string }> }) {
  try {
    const session = await auth()

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 401 })
    }

    // Await params before accessing properties
    const { bookingId } = await params

    const { status } = await request.json()

    if (!status || !["pending", "confirmed", "in_progress", "completed", "cancelled"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    await connectToDatabase()

    const booking = await Booking.findOneAndUpdate({ bookingId }, { status }, { new: true })

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: `Booking status updated to ${status}`,
      booking: {
        _id: booking._id.toString(),
        bookingId: booking.bookingId,
        status: booking.status,
        updatedAt: booking.updatedAt.toISOString(),
      },
    })
  } catch (error) {
    console.error("Error updating booking:", error)
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 })
  }
}

// DELETE - Delete booking
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ bookingId: string }> }) {
  try {
    const session = await auth()

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 401 })
    }

    // Await params before accessing properties
    const { bookingId } = await params

    await connectToDatabase()

    const booking = await Booking.findOneAndDelete({ bookingId })

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Booking deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting booking:", error)
    return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 })
  }
}
