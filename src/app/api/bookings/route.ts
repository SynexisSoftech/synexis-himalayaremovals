import { NextResponse } from "next/server"
import { connectToDatabase } from "@/app/lib/mongodb"
import { auth } from "@/auth"
import { Booking } from "@/app/models/booking"
import { Service } from "@/app/models/service"
import nodemailer from "nodemailer"

// Configure your email transporter
// It's highly recommended to use environment variables for sensitive information
// like EMAIL_USER, EMAIL_PASS, EMAIL_HOST, EMAIL_PORT.
// For production, consider using a dedicated transactional email service like SendGrid, Mailgun, or AWS SES.
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com", // e.g., smtp.sendgrid.net, smtp.mailgun.org
  port: Number.parseInt(process.env.EMAIL_PORT || "587"), // 587 for TLS, 465 for SSL
  secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER ,
    pass: process.env.EMAIL_PASS ,
  },
})

interface SendEmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || `"Booking System" <${process.env.EMAIL_USER}>`, // Sender address
      to, // List of receivers
      subject, // Subject line
      html, // HTML body
      text: text || html.replace(/<[^>]*>?/gm, ""), // Plain text body (optional)
    })
    console.log(`Email sent successfully to ${to}`)
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error)
    // In a real application, you might want to log this error to a monitoring service
    // or implement a retry mechanism.
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase()
    const data = await req.json()
    const {
      fullName,
      phoneNumber,
      email,
      fromAddress,
      fromPostcode,
      toAddress,
      toPostcode,
      moveDate,
      customDateDescription,
      preferredTime,
      service,
      subServices,
    } = data

    if (
      !fullName ||
      !phoneNumber ||
      !email ||
      !fromAddress ||
      !fromPostcode ||
      !toAddress ||
      !toPostcode ||
      !moveDate ||
      !preferredTime ||
      !service ||
      !subServices?.length
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Fetch service and validate subservices
    const existingService = await Service.findById(service)
    if (!existingService) {
      return NextResponse.json({ error: "Invalid service ID" }, { status: 400 })
    }

    const validSubTitles = existingService.subServices.map((s: any) => s.title)
    const invalidSubServices = subServices.filter((sub: string) => !validSubTitles.includes(sub))
    if (invalidSubServices.length > 0) {
      return NextResponse.json(
        {
          error: `Invalid sub-services: ${invalidSubServices.join(", ")}`,
        },
        { status: 400 },
      )
    }

    const newBooking = await Booking.create({
      fullName,
      phoneNumber,
      email,
      fromAddress,
      fromPostcode,
      toAddress,
      toPostcode,
      moveDate,
      customDateDescription: customDateDescription || null,
      preferredTime,
      service,
      subServices,
    })

    // --- Send Email Notifications ---
    // 1. Email to the user
    const userEmailSubject = "Your Booking Confirmation"
    const userEmailHtml = `
      <p>Dear ${fullName},</p>
      <p>Thank you for your booking! Your request has been successfully received and is currently <strong>pending</strong> review.</p>
      <p><strong>Booking Details:</strong></p>
      <ul>
        <li><strong>Service:</strong> ${existingService.name}</li>
        <li><strong>Sub-services:</strong> ${subServices.join(", ")}</li>
        <li><strong>Move Date:</strong> ${new Date(moveDate).toLocaleDateString()}</li>
        <li><strong>Preferred Time:</strong> ${preferredTime}</li>
        <li><strong>From:</strong> ${fromAddress}, ${fromPostcode}</li>
        <li><strong>To:</strong> ${toAddress}, ${toPostcode}</li>
        ${customDateDescription ? `<li><strong>Custom Date Description:</strong> ${customDateDescription}</li>` : ""}
      </ul>
      <p>We will review your booking and get back to you shortly. You will receive another notification once your booking status changes.</p>
      <p>If you have any questions, please do not hesitate to contact us.</p>
      <p>Best regards,<br/>The Booking Team</p>
    `
    await sendEmail({
      to: email,
      subject: userEmailSubject,
      html: userEmailHtml,
    })

    // 2. Email to the admin
    const adminEmailSubject = "New Booking Received!"
    const adminEmailHtml = `
      <p>Hello Admin,</p>
      <p>A new booking has been submitted:</p>
      <p><strong>Customer Details:</strong></p>
      <ul>
        <li><strong>Name:</strong> ${fullName}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Phone:</strong> ${phoneNumber}</li>
      </ul>
      <p><strong>Booking Details:</strong></p>
      <ul>
        <li><strong>Service:</strong> ${existingService.name}</li>
        <li><strong>Sub-services:</strong> ${subServices.join(", ")}</li>
        <li><strong>Move Date:</strong> ${new Date(moveDate).toLocaleDateString()}</li>
        <li><strong>Preferred Time:</strong> ${preferredTime}</li>
        <li><strong>From:</strong> ${fromAddress}, ${fromPostcode}</li>
        <li><strong>To:</strong> ${toAddress}, ${toPostcode}</li>
        ${customDateDescription ? `<li><strong>Custom Date Description:</strong> ${customDateDescription}</li>` : ""}
        <li><strong>Booking ID:</strong> ${newBooking._id.toString()}</li>
      </ul>
      <p>Please log in to the admin panel to review and manage this booking.</p>
    `
    await sendEmail({
      to: process.env.ADMIN_EMAIL || "poudelbiplove04@gmail.com", // Admin's email address
      subject: adminEmailSubject,
      html: adminEmailHtml,
    })

    return NextResponse.json({ success: true, booking: newBooking }, { status: 201 })
  } catch (error) {
    console.error("Booking creation failed:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await auth()
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()
    const bookings = await Booking.find().populate("service")
    return NextResponse.json(bookings)
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
