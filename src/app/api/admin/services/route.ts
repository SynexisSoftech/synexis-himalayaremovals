import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { connectToDatabase } from "@/app/lib/mongodb"
import Service from "@/app/models/service"

export async function GET() {
  try {
    const session = await auth()
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const services = await Service.find({}).sort({ createdAt: -1 }).lean()
    const formattedServices = services.map((service) => ({
      ...service,
      _id: service._id.toString(),
      createdAt: service.createdAt.toISOString(),
      updatedAt: service.updatedAt.toISOString(),
    }))

    return NextResponse.json({ services: formattedServices })
  } catch (error) {
    console.error("Error fetching services:", error)
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, description, basePrice, priceType, category } = await request.json()

    if (!name || !description || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await connectToDatabase()

    const service = await Service.create({
      name,
      description,
      basePrice,
      priceType,
      category,
    })

    return NextResponse.json({
      success: true,
      service: {
        _id: service._id.toString(),
        name: service.name,
        description: service.description,
        basePrice: service.basePrice,
        priceType: service.priceType,
        category: service.category,
        isActive: service.isActive,
      },
    })
  } catch (error) {
    console.error("Error creating service:", error)
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 })
  }
}
