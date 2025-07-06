import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { connectToDatabase } from "@/app/lib/mongodb"
import User from "@/app/models/user"

export async function PUT(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const session = await auth()

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { role } = await request.json()

    if (!role || !["user", "admin"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    // Prevent admin from removing their own admin privileges
    if (params.userId === session.user.id && role === "user") {
      return NextResponse.json({ error: "Cannot remove your own admin privileges" }, { status: 400 })
    }

    await connectToDatabase()

    const user = await User.findById(params.userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    user.role = role
    await user.save()

    return NextResponse.json({
      success: true,
      message: `User role updated to ${role}`,
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Error updating user role:", error)
    return NextResponse.json({ error: "Failed to update user role" }, { status: 500 })
  }
}
