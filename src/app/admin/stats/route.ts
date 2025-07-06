import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { connectToDatabase } from "@/app/lib/mongodb"
import User from "@/app/models/user"

export async function GET() {
  try {
    const session = await auth()

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const totalUsers = await User.countDocuments()
    const adminUsers = await User.countDocuments({ role: "admin" })
    const regularUsers = await User.countDocuments({ role: "user" })

    return NextResponse.json({
      totalUsers,
      adminUsers,
      regularUsers,
    })
  } catch (error) {
    console.error("Error getting user stats:", error)
    return NextResponse.json({ error: "Failed to get user statistics" }, { status: 500 })
  }
}
