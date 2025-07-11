import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { Service } from "@/app/models/service"
import { connectToDatabase } from "@/app/lib/mongodb"

// POST /api/admin/services

interface ServiceData {
  title: string
  subServices: string[]
}

export async function POST(req: Request) {
  try {
    const session = await auth()

    // Check if user is authenticated and an admin
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Connect to MongoDB
    await connectToDatabase()

    // Parse request body
    const body = await req.json()

    // Determine if we're creating single or multiple services
    let servicesToCreate: ServiceData[] = []

    if (Array.isArray(body)) {
      // Handle array of services
      servicesToCreate = body
    } else if (body.services && Array.isArray(body.services)) {
      // Handle { services: [...] } format
      servicesToCreate = body.services
    } else if (body.title && body.subServices) {
      // Handle single service format
      servicesToCreate = [{ title: body.title, subServices: body.subServices }]
    } else {
      return NextResponse.json(
        { message: "Invalid request format. Expected single service or array of services." },
        { status: 400 },
      )
    }

    // Validate all services
    for (const service of servicesToCreate) {
      if (!service.title || !Array.isArray(service.subServices)) {
        return NextResponse.json({ message: "Each service must have a title and subServices array" }, { status: 400 })
      }
    }

    // Check for duplicates in the request
    const titles = servicesToCreate.map((service) => service.title)
    const uniqueTitles = new Set(titles)
    if (titles.length !== uniqueTitles.size) {
      return NextResponse.json({ message: "Duplicate titles found in request" }, { status: 400 })
    }

    // Check if any services with these titles already exist
    const existingServices = await Service.find({
      title: { $in: titles },
    })

    if (existingServices.length > 0) {
      const existingTitles = existingServices.map((service) => service.title)
      return NextResponse.json(
        {
          message: "Services with the following titles already exist",
          existingTitles,
        },
        { status: 409 },
      )
    }

    // Create all services
    const createdServices = await Service.insertMany(servicesToCreate)

    // Return appropriate response based on input format
    if (servicesToCreate.length === 1) {
      return NextResponse.json(createdServices[0], { status: 201 })
    } else {
      return NextResponse.json(
        {
          message: `Successfully created ${createdServices.length} services`,
          services: createdServices,
        },
        { status: 201 },
      )
    }
  } catch (error) {
    console.error("Error creating service(s):", error)

    // Handle duplicate key errors specifically
    if (error.code === 11000) {
      return NextResponse.json(
        {
          message: "One or more services with this information already exist",
        },
        { status: 409 },
      )
    }

    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}


export async function GET() {
  try {
    const session = await auth()

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()
    const services = await Service.find().sort({ createdAt: -1 })

    return NextResponse.json(services)
  } catch (error) {
    console.error("Error fetching services:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}
