"use server"

import { auth } from "@/auth"
import { connectToDatabase } from "@/app/lib/mongodb"
import User from "@/app/models/user"
import { revalidatePath } from "next/cache"

export async function updateUserRole(userId: string, newRole: "user" | "admin") {
  try {
    const session = await auth()

    // Check if user is authenticated and is admin
    if (!session || session.user?.role !== "admin") {
      return { success: false, error: "Unauthorized" }
    }

    // Prevent admin from removing their own admin privileges
    if (userId === session.user.id && newRole === "user") {
      return { success: false, error: "Cannot remove your own admin privileges" }
    }

    await connectToDatabase()

    const user = await User.findById(userId)
    if (!user) {
      return { success: false, error: "User not found" }
    }

    user.role = newRole
    await user.save()

    revalidatePath("/admin/users")

    return { success: true }
  } catch (error) {
    console.error("Error updating user role:", error)
    return { success: false, error: "Failed to update user role" }
  }
}

export async function getUserStats() {
  try {
    const session = await auth()

    if (!session || session.user?.role !== "admin") {
      return { success: false, error: "Unauthorized" }
    }

    await connectToDatabase()

    const totalUsers = await User.countDocuments()
    const adminUsers = await User.countDocuments({ role: "admin" })
    const regularUsers = await User.countDocuments({ role: "user" })

    return {
      success: true,
      stats: {
        totalUsers,
        adminUsers,
        regularUsers,
      },
    }
  } catch (error) {
    console.error("Error getting user stats:", error)
    return { success: false, error: "Failed to get user statistics" }
  }
}
