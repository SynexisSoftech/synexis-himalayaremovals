import { connectToDatabase } from "@/app/lib/mongodb"
import { Service } from "@/app/models/service"
import { NextResponse } from "next/server"

export async function GET() {
  try {


    await connectToDatabase()
    const services = await Service.find().sort({ createdAt: -1 })

    return NextResponse.json(services)
  } catch (error) {
    console.error("Error fetching services:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}
