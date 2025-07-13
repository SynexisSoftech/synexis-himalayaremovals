import { NextResponse } from "next/server"
import { connectToDatabase } from "@/app/lib/mongodb"

import { auth } from "@/auth"
import ContactModel from "@/app/models/contact"

export async function GET() {
  try {
   const session = await auth()
   
       if (!session || session.user?.role !== "admin") {
         return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
       }
    

    await connectToDatabase()
    const contacts = await ContactModel.find().sort({ _id: -1 })

    return NextResponse.json({
      success: true,
      message: "✅ Contacts fetched successfully.",
      data: contacts,
    })
  } catch (error) {
    console.error("❌ Error fetching contacts:", error)
    return NextResponse.json({ success: false, error: "❌ Failed to fetch contacts." }, { status: 500 })
  }
}
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const deletedContact = await Contact.findByIdAndDelete(params.id)

    if (!deletedContact) {
      return NextResponse.json(
        { success: false, error: "Contact not found." },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "✅ Contact deleted successfully.",
      data: deletedContact,
    })
  } catch (error) {
    console.error("❌ Error deleting contact:", error)
    return NextResponse.json(
      { success: false, error: "❌ Failed to delete contact." },
      { status: 500 }
    )
  }
}