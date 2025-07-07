import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { connectToDatabase } from "@/app/lib/mongodb"
import Booking from "@/app/models/booking"

// GET - Get booking statistics
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 401 })
    }

    await connectToDatabase()

    // Get current date ranges
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Aggregate statistics
    const [totalBookings, recentBookings, monthlyBookings, statusCounts, revenueData] = await Promise.all([
      // Total bookings
      Booking.countDocuments(),

      // Recent bookings (last 30 days)
      Booking.countDocuments({
        submittedAt: { $gte: last30Days },
      }),

      // Monthly bookings
      Booking.countDocuments({
        submittedAt: { $gte: startOfMonth },
      }),

      // Status counts
      Booking.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),

      // Revenue data
      Booking.aggregate([
        {
          $match: {
            subServicePrice: { $exists: true, $gt: 0 },
          },
        },
        {
          $group: {
            _id: "$status",
            totalRevenue: { $sum: "$subServicePrice" },
            count: { $sum: 1 },
          },
        },
      ]),
    ])

    // Process status counts
    const statusMap = statusCounts.reduce((acc, item) => {
      acc[item._id] = item.count
      return acc
    }, {})

    // Process revenue data
    const completedRevenue = revenueData.find((item) => item._id === "completed")
    const estimatedRevenue = revenueData.reduce((total, item) => total + item.totalRevenue, 0)

    const stats = {
      totalBookings,
      recentBookings,
      monthlyBookings,
      pending: statusMap.pending || 0,
      confirmed: statusMap.confirmed || 0,
      in_progress: statusMap.in_progress || 0,
      completed: statusMap.completed || 0,
      cancelled: statusMap.cancelled || 0,
      estimatedRevenue: Math.round(estimatedRevenue),
      completedRevenue: Math.round(completedRevenue?.totalRevenue || 0),
      completedWithPrice: completedRevenue?.count || 0,
    }

    return NextResponse.json({
      success: true,
      stats,
    })
  } catch (error) {
    console.error("Error fetching booking stats:", error)
    return NextResponse.json({ error: "Failed to fetch booking statistics" }, { status: 500 })
  }
}
