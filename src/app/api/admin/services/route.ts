// /app/api/admin/services/route.ts

import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { connectToDatabase } from "@/app/lib/mongodb"
import Service from "@/app/models/service"

// GET - Fetch all services
export async function GET(request: NextRequest) {
  // ... (No changes needed in GET, it was correct)
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    await connectToDatabase()
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const query = search ? { name: { $regex: search, $options: "i" } } : {}
    const skip = (page - 1) * limit
    const services = await Service.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit)
    const total = await Service.countDocuments(query)
    return NextResponse.json({
      services,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error("Error fetching services:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Create a new service
export async function POST(request: NextRequest) {
  // ... (No major changes, but this logic now works with the updated schema)
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    await connectToDatabase()
    const body = await request.json()
    const { title, name, description, category, subServices = [], isActive = true, moves = [] } = body
    const serviceName = name || title

    if (!serviceName || !description || !category) {
      return NextResponse.json({ error: "Name, description, and category are required" }, { status: 400 })
    }
    
    // ... (rest of the validation logic for subServices can remain)

    const existingService = await Service.findOne({
      name: { $regex: new RegExp(`^${serviceName.trim()}$`, "i") },
    })

    if (existingService) {
      return NextResponse.json({ error: "A service with this name already exists" }, { status: 409 })
    }

    const newService = new Service({
      name: serviceName.trim(),
      // +++ FIX: Ensure title is saved, defaulting to name if not provided +++
      title: (title || serviceName).trim(),
      description: description.trim(),
      category: category.trim(),
      isActive: isActive !== undefined ? isActive : true,
      subServices: subServices || [],
      moves: moves || [],
    })

    const savedService = await newService.save()

    return NextResponse.json({ message: "Service created successfully", service: savedService, }, { status: 201 })
  } catch (error) {
    // ... (Error handling remains the same)
    console.error("Error creating service:", error)
    if (error.name === "ValidationError") {
      return NextResponse.json({ error: "Validation error", details: error.message }, { status: 400 })
    }
    if (error.code === 11000) {
      return NextResponse.json({ error: "A service with this name already exists" }, { status: 409 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}