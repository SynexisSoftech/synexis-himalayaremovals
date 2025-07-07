import { NextResponse } from "next/server"
import { connectToDatabase } from "@/app/lib/mongodb"
import Booking from "@/app/models/booking"

export async function GET() {
  try {
    await connectToDatabase()
    
    // Get a sample booking
    const booking = await Booking.findOne().lean()
    
    console.log("Test booking - Found booking:", booking ? "Yes" : "No")
    
    if (booking) {
      console.log("Test booking - Booking ID:", (booking as any).bookingId)
      console.log("Test booking - Status:", (booking as any).status)
    }
    
    return NextResponse.json({
      databaseConnected: true,
      hasBookings: !!booking,
      sampleBooking: booking ? {
        bookingId: (booking as any).bookingId,
        status: (booking as any).status,
        fullName: (booking as any).fullName,
      } : null,
    })
  } catch (error) {
    console.error("Test booking error:", error)
    return NextResponse.json({
      error: "Booking test failed",
      details: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 })
  }
} 