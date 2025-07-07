import { NextResponse } from "next/server"
import { auth } from "@/auth"

export async function GET() {
  try {
    const session = await auth()
    
    console.log("Test auth - Session:", session)
    console.log("Test auth - User:", session?.user)
    console.log("Test auth - Role:", session?.user?.role)
    
    return NextResponse.json({
      authenticated: !!session,
      user: session?.user ? {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
      } : null,
      isAdmin: session?.user?.role === "admin",
    })
  } catch (error) {
    console.error("Test auth error:", error)
    return NextResponse.json({
      error: "Auth test failed",
      details: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 })
  }
} 