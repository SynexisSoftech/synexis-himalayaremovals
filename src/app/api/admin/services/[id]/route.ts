// /app/api/admin/services/[id]/route.ts

import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { connectToDatabase } from "@/app/lib/mongodb"
import Service from "@/app/models/service"

// PUT - Update an existing service
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()
    
    // +++ FIX: Get ID from params, not body +++
    const { id } = params
    const body = await request.json()
    // --- REMOVED: No longer need to get id from body: const { id, title, ... } = body
    const { title, name, description, category, subServices, isActive, moves } = body

    if (!id) {
        return NextResponse.json({ error: "Service ID is required" }, { status: 400 })
    }

    const serviceName = name || title

    if (!serviceName || !description || !category) {
      return NextResponse.json({ error: "Name, description, and category are required" }, { status: 400 })
    }
    
    // ... (rest of the validation for subServices can remain)

    const existingService = await Service.findOne({
      name: { $regex: new RegExp(`^${serviceName.trim()}$`, "i") },
      _id: { $ne: id },
    })

    if (existingService) {
      return NextResponse.json({ error: "A service with this name already exists" }, { status: 409 })
    }

    const updatedService = await Service.findByIdAndUpdate(
      id,
      {
        name: serviceName.trim(),
        title: (title || serviceName).trim(),
        description: description.trim(),
        category: category.trim(),
        isActive: isActive !== undefined ? isActive : true,
        subServices: subServices || [],
        moves: moves || [],
      },
      { new: true, runValidators: true }
    )

    if (!updatedService) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Service updated successfully",
      service: updatedService,
    })
  } catch (error) {
    // ... (Error handling remains the same)
    console.error("Error updating service:", error)
    if (error.name === "ValidationError") {
      return NextResponse.json({ error: "Validation error", details: error.message }, { status: 400 })
    }
    if (error.name === "CastError") {
      return NextResponse.json({ error: "Invalid service ID" }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE - Delete a service
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    await connectToDatabase()

    // +++ FIX: Get ID from URL parameters, not query string +++
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: "Service ID is required" }, { status: 400 })
    }

    const deletedService = await Service.findByIdAndDelete(id)

    if (!deletedService) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Service deleted successfully",
      service: deletedService,
    })
  } catch (error) {
    // ... (Error handling remains the same)
    console.error("Error deleting service:", error)
    if (error.name === "CastError") {
      return NextResponse.json({ error: "Invalid service ID" }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}