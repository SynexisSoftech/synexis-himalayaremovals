import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { connectToDatabase } from "@/app/lib/mongodb"
import Service from "@/app/models/service"
import SubService from "@/app/models/sub-service"

export async function PUT(request: NextRequest, { params }: { params: { serviceId: string } }) {
  try {
    const session = await auth()
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, description, basePrice, priceType, category, isActive } = await request.json()

    await connectToDatabase()

    const service = await Service.findByIdAndUpdate(
      params.serviceId,
      { name, description, basePrice, priceType, category, isActive },
      { new: true },
    )

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

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
    console.error("Error updating service:", error)
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { serviceId: string } }) {
  try {
    const session = await auth()
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    // Delete all sub-services first
    await SubService.deleteMany({ serviceId: params.serviceId })

    // Delete the service
    const service = await Service.findByIdAndDelete(params.serviceId)

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Service deleted successfully" })
  } catch (error) {
    console.error("Error deleting service:", error)
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 })
  }
}
