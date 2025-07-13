import { NextResponse } from "next/server"
import ContactModel from "@/app/models/contact"
import { connectToDatabase } from "@/app/lib/mongodb"
import nodemailer from "nodemailer" // Import nodemailer directly

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: Number(process.env.EMAIL_PORT) === 465, // Use true if port is 465 (SSL), false for other ports (TLS)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

// Function to send email (now internal to this file)
async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    })
    console.log(`✅ Email sent successfully to ${to}`)
  } catch (error) {
    console.error(`❌ Error sending email to ${to}:`, error)
    throw new Error(`Failed to send email: ${error instanceof Error ? error.message : String(error)}`)
  }
}

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

    // Send email notification to the user
    try {
      await sendEmail({
        to: email,
        subject: "Thank you for contacting us!",
        html: `
          <p>Dear ${fullname},</p>
          <p>Thank you for reaching out to us. We have received your message and will get back to you shortly.</p>
          <p>Here's a summary of your submission:</p>
          <ul>
            <li><strong>Full Name:</strong> ${fullname}</li>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Phone Number:</strong> ${phonenumber}</li>
            <li><strong>Service Required:</strong> ${serviceRequired}</li>
            <li><strong>Message:</strong> ${message}</li>
          </ul>
          <p>Best regards,</p>
          <p>The Team</p>
        `,
      })
    } catch (emailError) {
      console.warn("⚠️ Failed to send confirmation email to user:", emailError)
      // Continue processing the main request even if email fails
    }

    // Send email notification to the admin
    try {
      await sendEmail({
        to: process.env.ADMIN_EMAIL as string, // Ensure ADMIN_EMAIL is set in your environment variables
        subject: `New Contact Form Submission from ${fullname}`,
        html: `
          <p>A new contact form has been submitted:</p>
          <ul>
            <li><strong>Full Name:</strong> ${fullname}</li>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Phone Number:</strong> ${phonenumber}</li>
            <li><strong>Service Required:</strong> ${serviceRequired}</li>
            <li><strong>Message:</strong> ${message}</li>
          </ul>
          <p>Please respond to them as soon as possible.</p>
        `,
      })
    } catch (emailError) {
      console.warn("⚠️ Failed to send admin notification email:", emailError)
      // Continue processing the main request even if email fails
    }

    return NextResponse.json({
      success: true,
      message: "✅ Contact saved successfully and notifications sent.",
      data: newContact,
    })
  } catch (error) {
    console.error("❌ Error saving contact or sending notifications:", error)
    return NextResponse.json(
      { success: false, error: "❌ Failed to save contact or send notifications." },
      { status: 500 },
    )
  }
}
