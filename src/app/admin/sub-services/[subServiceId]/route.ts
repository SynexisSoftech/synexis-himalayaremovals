import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { connectToDatabase } from "@/app/lib/mongodb"
import SubService from "@/app/models/sub-service"


export async function PUT(request: NextRequest, { params }: { params: { subServiceId: string } }) {
  try {
    const session = await auth()
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, description, price, priceType, estimatedDuration, features, isActive } = await request.json()

    await connectToDatabase()

    const subService = await SubService.findByIdAndUpdate(
      params.subServiceId,
      { name, description, price, priceType, estimatedDuration, features, isActive },
      { new: true },
    )

    if (!subService) {
      return NextResponse.json({ error: "Sub-service not found" }, { status: 404 })
    }

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
    console.error("Error updating sub-service:", error)
    return NextResponse.json({ error: "Failed to update sub-service" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { subServiceId: string } }) {
  try {
    const session = await auth()
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const subService = await SubService.findByIdAndDelete(params.subServiceId)

    if (!subService) {
      return NextResponse.json({ error: "Sub-service not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Sub-service deleted successfully" })
  } catch (error) {
    console.error("Error deleting sub-service:", error)
    return NextResponse.json({ error: "Failed to delete sub-service" }, { status: 500 })
  }
}
