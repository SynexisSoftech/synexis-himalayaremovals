import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { connectToDatabase } from "@/app/lib/mongodb"
import SubService from "@/app/models/sub-service"

export async function GET(request: NextRequest, { params }: { params: { serviceId: string } }) {
  try {
    const session = await auth()
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const subServices = await SubService.find({ serviceId: params.serviceId }).sort({ createdAt: -1 }).lean()
    const formattedSubServices = subServices.map((subService) => ({
      ...subService,
      _id: subService._id.toString(),
      serviceId: subService.serviceId.toString(),
      createdAt: subService.createdAt.toISOString(),
      updatedAt: subService.updatedAt.toISOString(),
    }))

    return NextResponse.json({ subServices: formattedSubServices })
  } catch (error) {
    console.error("Error fetching sub-services:", error)
    return NextResponse.json({ error: "Failed to fetch sub-services" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { serviceId: string } }) {
  try {
    const session = await auth()
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, description, price, priceType, estimatedDuration, features } = await request.json()

    if (!name || !description || !price || !priceType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await connectToDatabase()

    const subService = await SubService.create({
      serviceId: params.serviceId,
      name,
      description,
      price,
      priceType,
      estimatedDuration,
      features: features || [],
    })

    return NextResponse.json({
      success: true,
      subService: {
        _id: subService._id.toString(),
        serviceId: subService.serviceId.toString(),
        name: subService.name,
        description: subService.description,
        price: subService.price,
        priceType: subService.priceType,
        estimatedDuration: subService.estimatedDuration,
        features: subService.features,
        isActive: subService.isActive,
      },
    })
  } catch (error) {
    console.error("Error creating sub-service:", error)
    return NextResponse.json({ error: "Failed to create sub-service" }, { status: 500 })
  }
}
