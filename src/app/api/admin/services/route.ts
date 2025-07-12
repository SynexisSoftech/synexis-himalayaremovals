import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { Service } from "@/app/models/service"
import { connectToDatabase } from "@/app/lib/mongodb"

interface ServiceData {
  title: string
  subServices: string[]
}

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    // Ensure proper indexes exist
    try {
      const collection = Service.collection

      // Drop old name index if it exists
      try {
        await collection.dropIndex("name_1")
        console.log("Dropped old name_1 index")
      } catch (error) {
        // Index doesn't exist, which is fine
      }

      // Ensure title index exists
      await collection.createIndex({ title: 1 }, { unique: true })
    } catch (error) {
      console.log("Index management:", error.message)
    }

    const body = await req.json()

    let servicesToCreate: ServiceData[] = []

    if (Array.isArray(body)) {
      servicesToCreate = body
    } else if (body.services && Array.isArray(body.services)) {
      servicesToCreate = body.services
    } else if (body.title && body.subServices) {
      servicesToCreate = [{ title: body.title, subServices: body.subServices }]
    } else {
      return NextResponse.json(
        { message: "Invalid request format. Expected single service or array of services." },
        { status: 400 },
      )
    }

    // Validate and normalize data
    for (const service of servicesToCreate) {
      if (!service.title?.trim() || !Array.isArray(service.subServices)) {
        return NextResponse.json({ message: "Each service must have a title and subServices array" }, { status: 400 })
      }
      // Trim whitespace and filter empty strings
      service.title = service.title.trim()
      service.subServices = service.subServices
        .map((sub) => (typeof sub === "string" ? sub.trim() : sub))
        .filter((sub) => sub && sub.length > 0)
    }

    // Check for duplicates in request (case-insensitive)
    const titles = servicesToCreate.map((service) => service.title.toLowerCase())
    const uniqueTitles = new Set(titles)
    if (titles.length !== uniqueTitles.size) {
      return NextResponse.json({ message: "Duplicate titles found in request" }, { status: 400 })
    }

    // Check if any services with these titles already exist (case-insensitive)
    const existingServices = await Service.find({
      title: {
        $in: servicesToCreate.map((service) => new RegExp(`^${service.title}$`, "i")),
      },
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

    // Create services one by one to handle validation properly
    const createdServices = []

    for (const serviceData of servicesToCreate) {
      try {
        // Create service with proper structure
        const serviceDoc = {
          title: serviceData.title,
          subServices: serviceData.subServices.map((subTitle) => ({ title: subTitle })),
        }

        const newService = new Service(serviceDoc)
        const savedService = await newService.save()
        createdServices.push(savedService)

        console.log(`✅ Created service: ${serviceData.title}`)
      } catch (validationError: any) {
        console.error("Validation error for service:", serviceData.title, validationError)

        // Handle specific MongoDB errors
        if (validationError.code === 11000) {
          const field = validationError.keyPattern ? Object.keys(validationError.keyPattern)[0] : "unknown"
          return NextResponse.json(
            {
              message: `Service with this ${field} already exists: "${serviceData.title}"`,
            },
            { status: 409 },
          )
        }

        return NextResponse.json(
          {
            message: `Validation failed for service "${serviceData.title}": ${validationError.message}`,
            details: validationError.errors,
          },
          { status: 400 },
        )
      }
    }

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
  } catch (error: any) {
    console.error("Error creating service(s):", error)

    if (error.code === 11000) {
      return NextResponse.json({ message: "One or more services with this information already exist" }, { status: 409 })
    }

    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: error.message,
        details: error.errors || null,
      },
      { status: 500 },
    )
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
