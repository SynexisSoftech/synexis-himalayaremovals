import { NextResponse } from "next/server"
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

// POST - Create a new booking (public endpoint)
export async function POST(request: Request) {
  try {
    const data = await request.json()
    console.log('Received booking data:', JSON.stringify(data, null, 2))

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
      details,
      submittedAt,
    } = data

    console.log('Extracted fields:', {
      bookingId: !!bookingId,
      fullName: !!fullName,
      emailAddress: !!emailAddress,
      phoneNumber: !!phoneNumber,
      serviceId: !!serviceId,
      serviceName: !!serviceName,
      details: !!details,
    })

    // Validate required fields
    if (
      !bookingId ||
      !fullName ||
      !emailAddress ||
      !phoneNumber ||
      !serviceId ||
      !serviceName ||
      !details
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(emailAddress)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate phone format
    const phoneRegex = /^[+]?[0-9\-\s()]{10,}$/
    if (!phoneRegex.test(phoneNumber)) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      )
    }

    // Validate details length
    if (details.trim().length < 10) {
      return NextResponse.json(
        { error: 'Details must be at least 10 characters long' },
        { status: 400 }
      )
    }

    await connectToDatabase()

    // Check if booking ID already exists
    const existingBooking = await Booking.findOne({ bookingId })
    if (existingBooking) {
      return NextResponse.json(
        { error: 'Booking ID already exists' },
        { status: 409 }
      )
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
      details: details.trim(),
      status: "pending",
      submittedAt: submittedAt || new Date(),
    })

    return NextResponse.json({
      success: true,
      bookingId: booking.bookingId,
      message: 'Booking submitted successfully',
      booking: {
        _id: (booking as any)._id.toString(),
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
    console.error('Error creating booking:', error)

    // Handle duplicate key error
    if (error instanceof Error && error.message.includes('duplicate key')) {
      return NextResponse.json(
        { error: 'Booking with this ID already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}

// GET - Fetch all bookings (admin only)
export async function GET(request: Request) {
  try {
    const session = await auth()

    // Check if user is authenticated and is admin
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    await connectToDatabase()
    const bookings = await Booking.find({}).sort({ createdAt: -1 }).lean()

    const formattedBookings = bookings.map((booking) => ({
      _id: (booking as any)._id.toString(),
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
      createdAt: safeToISOString((booking as any).createdAt),
      updatedAt: safeToISOString((booking as any).updatedAt),
      submittedAt: safeToISOString(booking.submittedAt),
    }))

    return NextResponse.json({
      success: true,
      bookings: formattedBookings,
      total: formattedBookings.length,
    })
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
} 