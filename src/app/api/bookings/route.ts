// src/app/api/bookings/route.ts

import { NextResponse } from "next/server"
import { connectToDatabase } from "@/app/lib/mongodb"
import { auth } from "@/auth"
import { Booking } from "@/app/models/booking"
import { Service } from "@/app/models/service"

export async function POST(req: Request) {
  try {
    await connectToDatabase()
    const data = await req.json()

    const {
      fullName,
      phoneNumber,
      email,
      fromAddress,
      fromPostcode,
      toAddress,
      toPostcode,
      moveDate,
      customDateDescription,
      preferredTime,
      service,
      subServices,
    } = data

    if (
      !fullName || !phoneNumber || !email ||
      !fromAddress || !fromPostcode ||
      !toAddress || !toPostcode ||
      !moveDate || !preferredTime || !service || !subServices?.length
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Fetch service and validate subservices
    const existingService = await Service.findById(service)
    if (!existingService) {
      return NextResponse.json({ error: "Invalid service ID" }, { status: 400 })
    }

    const validSubTitles = existingService.subServices.map((s: any) => s.title)

    const invalidSubServices = subServices.filter(
      (sub: string) => !validSubTitles.includes(sub)
    )

    if (invalidSubServices.length > 0) {
      return NextResponse.json({
        error: `Invalid sub-services: ${invalidSubServices.join(", ")}`,
      }, { status: 400 })
    }

    const newBooking = await Booking.create({
      fullName,
      phoneNumber,
      email,
      fromAddress,
      fromPostcode,
      toAddress,
      toPostcode,
      moveDate,
      customDateDescription: customDateDescription || null,
      preferredTime,
      service,
      subServices,
    })

    return NextResponse.json({ success: true, booking: newBooking }, { status: 201 })

  } catch (error) {
    console.error("Booking creation failed:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await auth()
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()
    const bookings = await Booking.find().populate("service")
    return NextResponse.json(bookings)
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
