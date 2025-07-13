// app/api/contact/route.ts
import { NextResponse } from "next/server"
 // Adjusted path
import ContactModel from "@/app/models/contact"
import { connectToDatabase } from "@/app/lib/mongodb"


export async function POST(req: Request) {
  try {
    await connectToDatabase()
    const body = await req.json()
    const { fullname, email, phonenumber, message, serviceRequired } = body
    // Validation
    if (!fullname || !email || !phonenumber || !message || !serviceRequired) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 })
    }
    // Use ContactModel.create()
    const newContact = await ContactModel.create({ fullname, email, phonenumber, message, serviceRequired })
    return NextResponse.json({
      success: true,
      message: "✅ Contact saved successfully.",
      data: newContact,
    })
  } catch (error) {
    console.error("❌ Error saving contact:", error)
    return NextResponse.json({ success: false, error: "❌ Failed to save contact." }, { status: 500 })
  }
}

