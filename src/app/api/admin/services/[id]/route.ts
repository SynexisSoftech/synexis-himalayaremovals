import { NextResponse } from "next/server"
import { connectToDatabase } from "@/app/lib/mongodb"
import { Service } from "@/app/models/service"
import { auth } from "@/auth"

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()

  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  await connectToDatabase()
  const service = await Service.findById(id)

  if (!service) {
    return NextResponse.json({ message: "Service not found" }, { status: 404 })
  }

  return NextResponse.json(service)
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()

  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { title, subServices } = body

    if (!title?.trim()) {
      return NextResponse.json({ message: "Title is required" }, { status: 400 })
    }

    await connectToDatabase()

    // Check if another service with this title exists (excluding current one)
    const existingService = await Service.findOne({
      title: new RegExp(`^${title.trim()}$`, "i"),
      _id: { $ne: id },
    })

    if (existingService) {
      return NextResponse.json({ message: `Service with title "${title}" already exists` }, { status: 409 })
    }

    // Transform subServices data
    const formattedSubServices = Array.isArray(subServices)
      ? subServices
          .map((sub) => (typeof sub === "string" ? { title: sub.trim() } : { title: sub.title?.trim() || "" }))
          .filter((sub) => sub.title)
      : []

    const updated = await Service.findByIdAndUpdate(
      id,
      {
        title: title.trim(),
        subServices: formattedSubServices,
      },
      { new: true },
    )

    if (!updated) {
      return NextResponse.json({ message: "Service not found" }, { status: 404 })
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Error updating service:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()

  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    await connectToDatabase()
    const deleted = await Service.findByIdAndDelete(id)

    if (!deleted) {
      return NextResponse.json({ message: "Service not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Service deleted successfully" })
  } catch (error) {
    console.error("Error deleting service:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}
