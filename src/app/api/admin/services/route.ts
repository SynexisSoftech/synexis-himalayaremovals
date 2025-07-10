import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { connectToDatabase } from "@/app/lib/mongodb"
import Service from "@/app/models/service"

// GET - Fetch all services
export async function GET(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin (you might want to adjust this based on your user model)
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 })
    }

    await connectToDatabase()

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""

    // Build query - search by name instead of title
    const query = search ? { name: { $regex: search, $options: "i" } } : {}

    // Calculate skip value for pagination
    const skip = (page - 1) * limit

    // Fetch services with pagination
    const services = await Service.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit)

    // Get total count for pagination
    const total = await Service.countDocuments(query)

    return NextResponse.json({
      services,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching services:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Create a new service
export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 })
    }

    await connectToDatabase()

    const body = await request.json()
    const { title, name, description, category, subServices = [], isActive = true, moves = [] } = body

    // Use name if provided, otherwise use title, or vice versa
    const serviceName = name || title
    const serviceTitle = title || name

    // Validation for required fields
    if (!serviceName || typeof serviceName !== "string" || serviceName.trim().length === 0) {
      return NextResponse.json(
        {
          error: "Name is required and must be a non-empty string",
          expectedFields: {
            name: "string (required)",
            description: "string (required)",
            category: "string (required)",
            title: "string (optional) - will use name if not provided",
            subServices: "array (optional)",
            isActive: "boolean (optional, defaults to true)",
            moves: "array (optional)",
          },
        },
        { status: 400 },
      )
    }

    if (!description || typeof description !== "string" || description.trim().length === 0) {
      return NextResponse.json({ error: "Description is required and must be a non-empty string" }, { status: 400 })
    }

    if (!category || typeof category !== "string" || category.trim().length === 0) {
      return NextResponse.json({ error: "Category is required and must be a non-empty string" }, { status: 400 })
    }

    // Validate subServices if provided
    if (subServices && Array.isArray(subServices)) {
      for (const subService of subServices) {
        if (!subService.title || typeof subService.title !== "string") {
          return NextResponse.json({ error: "Each sub-service must have a valid title" }, { status: 400 })
        }
        if (subService.price && typeof subService.price !== "number") {
          return NextResponse.json({ error: "Sub-service price must be a number" }, { status: 400 })
        }
      }
    }

    // Check if service with same name already exists
    const existingService = await Service.findOne({
      name: { $regex: new RegExp(`^${serviceName.trim()}$`, "i") },
    })

    if (existingService) {
      return NextResponse.json({ error: "A service with this name already exists" }, { status: 409 })
    }

    // Create new service with all required fields
    const newService = new Service({
      name: serviceName.trim(),
      title: serviceTitle?.trim() || serviceName.trim(), // Use name as title if title not provided
      description: description.trim(),
      category: category.trim(),
      isActive: isActive !== undefined ? isActive : true,
      subServices: subServices || [],
      moves: moves || [],
    })

    const savedService = await newService.save()

    return NextResponse.json(
      {
        message: "Service created successfully",
        service: savedService,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating service:", error)

    // Handle mongoose validation errors
    if (error.name === "ValidationError") {
      return NextResponse.json({ error: "Validation error", details: error.message }, { status: 400 })
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json({ error: "A service with this name already exists" }, { status: 409 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT - Update an existing service
export async function PUT(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 })
    }

    await connectToDatabase()

    const body = await request.json()
    const { id, title, name, description, category, subServices, isActive, moves } = body

    // Validation
    if (!id) {
      return NextResponse.json({ error: "Service ID is required" }, { status: 400 })
    }

    const serviceName = name || title
    const serviceTitle = title || name

    if (!serviceName || typeof serviceName !== "string" || serviceName.trim().length === 0) {
      return NextResponse.json({ error: "Name is required and must be a non-empty string" }, { status: 400 })
    }

    if (!description || typeof description !== "string" || description.trim().length === 0) {
      return NextResponse.json({ error: "Description is required and must be a non-empty string" }, { status: 400 })
    }

    if (!category || typeof category !== "string" || category.trim().length === 0) {
      return NextResponse.json({ error: "Category is required and must be a non-empty string" }, { status: 400 })
    }

    // Validate subServices if provided
    if (subServices && Array.isArray(subServices)) {
      for (const subService of subServices) {
        if (!subService.title || typeof subService.title !== "string") {
          return NextResponse.json({ error: "Each sub-service must have a valid title" }, { status: 400 })
        }
        if (subService.price && typeof subService.price !== "number") {
          return NextResponse.json({ error: "Sub-service price must be a number" }, { status: 400 })
        }
      }
    }

    // Check if another service with same name exists (excluding current service)
    const existingService = await Service.findOne({
      name: { $regex: new RegExp(`^${serviceName.trim()}$`, "i") },
      _id: { $ne: id },
    })

    if (existingService) {
      return NextResponse.json({ error: "A service with this name already exists" }, { status: 409 })
    }

    // Update service
    const updatedService = await Service.findByIdAndUpdate(
      id,
      {
        name: serviceName.trim(),
        title: serviceTitle?.trim() || serviceName.trim(),
        description: description.trim(),
        category: category.trim(),
        isActive: isActive !== undefined ? isActive : true,
        subServices: subServices || [],
        moves: moves || [],
      },
      { new: true, runValidators: true },
    )

    if (!updatedService) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Service updated successfully",
      service: updatedService,
    })
  } catch (error) {
    console.error("Error updating service:", error)

    // Handle mongoose validation errors
    if (error.name === "ValidationError") {
      return NextResponse.json({ error: "Validation error", details: error.message }, { status: 400 })
    }

    // Handle invalid ObjectId
    if (error.name === "CastError") {
      return NextResponse.json({ error: "Invalid service ID" }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE - Delete a service
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 })
    }

    await connectToDatabase()

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Service ID is required" }, { status: 400 })
    }

    // Delete service
    const deletedService = await Service.findByIdAndDelete(id)

    if (!deletedService) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Service deleted successfully",
      service: deletedService,
    })
  } catch (error) {
    console.error("Error deleting service:", error)

    // Handle invalid ObjectId
    if (error.name === "CastError") {
      return NextResponse.json({ error: "Invalid service ID" }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
