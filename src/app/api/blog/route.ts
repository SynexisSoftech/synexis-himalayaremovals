import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/app/lib/mongodb"
import Blog from "@/app/models/blog"
import { auth } from "@/auth"

// GET all blogs
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || "published"
    const featured = searchParams.get("featured")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const page = Number.parseInt(searchParams.get("page") || "1")

    const query: any = { status }
    if (featured === "true") {
      query.featured = true
    }

    const blogs = await Blog.find(query)
      .populate("author", "name email")
      .sort({ publishedDate: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean()

    const total = await Blog.countDocuments(query)

    // This response structure is correct
    return NextResponse.json({
      success: true, // Explicitly adding success property
      blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching blogs:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch blogs" }, { status: 500 })
  }
}

// POST create new blog
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const data = await request.json()

    const blog = await Blog.create({
      ...data,
      author: session.user.id,
    })

    await blog.populate("author", "name email")

    return NextResponse.json(blog, { status: 201 })
  } catch (error) {
    console.error("Error creating blog:", error)
    return NextResponse.json({ error: "Failed to create blog" }, { status: 500 })
  }
}