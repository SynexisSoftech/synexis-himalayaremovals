import { NextResponse } from "next/server"
import { connectToDatabase } from "@/app/lib/mongodb"
import { auth } from "@/auth"
import ContactModel from "@/app/models/contact" // Assuming ContactModel is the correct import for your Mongoose model

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    await connectToDatabase()
    const deletedContact = await ContactModel.findByIdAndDelete(params.id) // Use ContactModel here
    if (!deletedContact) {
      return NextResponse.json({ success: false, error: "Contact not found." }, { status: 404 })
    }
    return NextResponse.json({
      success: true,
      message: "✅ Contact deleted successfully.",
      data: deletedContact,
    })
  } catch (error) {
    console.error("❌ Error deleting contact:", error)
    return NextResponse.json({ success: false, error: "❌ Failed to delete contact." }, { status: 500 })
  }
}
