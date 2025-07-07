import { NextResponse } from "next/server"
import { connectToDatabase } from "@/app/lib/mongodb"
import Booking from "@/app/models/booking"

// POST - Create a new booking (public endpoint)
export async function POST(request: Request) {
  try {
    const data = await request.json()
    console.log("Received booking data:", JSON.stringify(data, null, 2))

    const {
      bookingId,
      fullName,
      emailAddress,
      phoneNumber,
      serviceId,
      serviceName,
      subServiceId,
      subServiceName,
      subServicePrice,
      notes,
      submittedAt,
    } = data

    console.log("Extracted fields:", {
      bookingId: !!bookingId,
      fullName: !!fullName,
      emailAddress: !!emailAddress,
      phoneNumber: !!phoneNumber,
      serviceId: !!serviceId,
      serviceName: !!serviceName,
      notes: !!notes,
    })

    // Validate required fields
    if (!bookingId || !fullName || !emailAddress || !phoneNumber || !serviceId || !serviceName || !notes) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(emailAddress)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Validate phone format
    const phoneRegex = /^[+]?[0-9\-\s()]{10,}$/
    if (!phoneRegex.test(phoneNumber)) {
      return NextResponse.json({ error: "Invalid phone number format" }, { status: 400 })
    }

    // Validate notes length
    if (notes.trim().length < 10) {
      return NextResponse.json({ error: "Notes must be at least 10 characters long" }, { status: 400 })
    }

    await connectToDatabase()

    // Check if booking ID already exists
    const existingBooking = await Booking.findOne({ bookingId })
    if (existingBooking) {
      return NextResponse.json({ error: "Booking ID already exists" }, { status: 409 })
    }

    // Create new booking
    const booking = await Booking.create({
      bookingId,
      fullName: fullName.trim(),
      emailAddress: emailAddress.trim().toLowerCase(),
      phoneNumber: phoneNumber.trim(),
      serviceId,
      serviceName,
      subServiceId: subServiceId || undefined,
      subServiceName: subServiceName || undefined,
      subServicePrice: subServicePrice || undefined,
      notes: notes.trim(), // ← Now using 'notes' consistently
      submittedAt: submittedAt || new Date(),
    })

    return NextResponse.json({
      success: true,
      bookingId: booking.bookingId,
      message: "Booking submitted successfully",
      booking: {
        _id: booking._id.toString(),
        bookingId: booking.bookingId,
        fullName: booking.fullName,
        emailAddress: booking.emailAddress,
        serviceName: booking.serviceName,
        subServiceName: booking.subServiceName,
        status: booking.status,
        submittedAt: booking.submittedAt,
      },
    })
  } catch (error) {
    console.error("Error creating booking:", error)

    // Handle duplicate key error
    if (error instanceof Error && error.message.includes("duplicate key")) {
      return NextResponse.json({ error: "Booking with this ID already exists" }, { status: 409 })
    }

    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}
