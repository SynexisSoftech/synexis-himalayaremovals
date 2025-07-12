import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/app/lib/mongodb"
import { Booking } from "@/app/models/booking"
import { auth } from "@/auth"

// ✅ Update booking status — Only Admin
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    // Await the params in newer Next.js versions
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: "Booking ID not found in URL" }, { status: 400 })
    }

    const { status } = await req.json()

    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 })
    }

    const updatedBooking = await Booking.findByIdAndUpdate(id, { status }, { new: true })

    if (!updatedBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: `Booking ${status}`,
      booking: updatedBooking,
    })
  } catch (error) {
    console.error("Error updating booking status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// ✅ Get booking by ID — Only Admin
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    // Await the params in newer Next.js versions
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: "Booking ID not found in URL" }, { status: 400 })
    }

    const booking = await Booking.findById(id).populate("service")

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    return NextResponse.json(booking)
  } catch (error) {
    console.error("Error fetching booking:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// ✅ Delete booking by ID — Only Admin
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    // Await the params in newer Next.js versions
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: "Booking ID not found in URL" }, { status: 400 })
    }

    const deleted = await Booking.findByIdAndDelete(id)

    if (!deleted) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Booking deleted" })
  } catch (error) {
    console.error("Error deleting booking:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
