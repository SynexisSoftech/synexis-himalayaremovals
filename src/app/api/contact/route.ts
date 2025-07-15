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
          <div style="font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333333; background-color: #f0f4f8; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
              <div style="background-color: #e2e8f0; padding: 25px; text-align: center; border-bottom: 1px solid #d1d8e0;">
                <h1 style="margin: 0; font-size: 28px; color: #334155; font-weight: 600;">Thank You for Your Inquiry!</h1>
              </div>
              <div style="padding: 30px;">
                <p style="font-size: 16px; margin-bottom: 15px;">Dear ${fullname},</p>
                <p style="font-size: 16px; margin-bottom: 25px;">Thank you for reaching out to us. We have received your message and will get back to you shortly.</p>
                <p style="font-size: 16px; margin-bottom: 15px; font-weight: 600;">Here's a summary of your submission:</p>
                <ul style="list-style: none; padding: 0; margin: 0;">
                  <li style="margin-bottom: 12px; padding: 10px 15px; background-color: #f8fafd; border-left: 4px solid #60a5fa; border-radius: 6px; font-size: 15px;"><strong>Full Name:</strong> ${fullname}</li>
                  <li style="margin-bottom: 12px; padding: 10px 15px; background-color: #f8fafd; border-left: 4px solid #60a5fa; border-radius: 6px; font-size: 15px;"><strong>Email:</strong> ${email}</li>
                  <li style="margin-bottom: 12px; padding: 10px 15px; background-color: #f8fafd; border-left: 4px solid #60a5fa; border-radius: 6px; font-size: 15px;"><strong>Phone Number:</strong> ${phonenumber}</li>
                  <li style="margin-bottom: 12px; padding: 10px 15px; background-color: #f8fafd; border-left: 4px solid #60a5fa; border-radius: 6px; font-size: 15px;"><strong>Service Required:</strong> ${serviceRequired}</li>
                  <li style="margin-bottom: 12px; padding: 10px 15px; background-color: #f8fafd; border-left: 4px solid #60a5fa; border-radius: 6px; font-size: 15px;"><strong>Message:</strong> ${message}</li>
                </ul>
                <p style="margin-top: 30px; font-size: 16px;">We appreciate your patience and look forward to assisting you.</p>
                <p style="font-size: 16px; margin-top: 20px;">Best regards,</p>
                <p style="font-size: 16px; font-weight: 600; margin-top: 5px;">The Team</p>
              </div>
              <div style="background-color: #e2e8f0; padding: 20px; text-align: center; font-size: 13px; color: #555555; border-top: 1px solid #d1d8e0;">
                &copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.
              </div>
            </div>
          </div>
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
          <div style="font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333333; background-color: #f0f4f8; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
              <div style="background-color: #e2e8f0; padding: 25px; text-align: center; border-bottom: 1px solid #d1d8e0;">
                <h1 style="margin: 0; font-size: 28px; color: #334155; font-weight: 600;">New Contact Form Submission</h1>
              </div>
              <div style="padding: 30px;">
                <p style="font-size: 16px; margin-bottom: 15px;">A new contact form has been submitted:</p>
                <ul style="list-style: none; padding: 0; margin: 0;">
                  <li style="margin-bottom: 12px; padding: 10px 15px; background-color: #f8fafd; border-left: 4px solid #60a5fa; border-radius: 6px; font-size: 15px;"><strong>Full Name:</strong> ${fullname}</li>
                  <li style="margin-bottom: 12px; padding: 10px 15px; background-color: #f8fafd; border-left: 4px solid #60a5fa; border-radius: 6px; font-size: 15px;"><strong>Email:</strong> ${email}</li>
                  <li style="margin-bottom: 12px; padding: 10px 15px; background-color: #f8fafd; border-left: 4px solid #60a5fa; border-radius: 6px; font-size: 15px;"><strong>Phone Number:</strong> ${phonenumber}</li>
                  <li style="margin-bottom: 12px; padding: 10px 15px; background-color: #f8fafd; border-left: 4px solid #60a5fa; border-radius: 6px; font-size: 15px;"><strong>Service Required:</strong> ${serviceRequired}</li>
                  <li style="margin-bottom: 12px; padding: 10px 15px; background-color: #f8fafd; border-left: 4px solid #60a5fa; border-radius: 6px; font-size: 15px;"><strong>Message:</strong> ${message}</li>
                </ul>
                <p style="margin-top: 30px; font-size: 16px;">Please respond to them as soon as possible.</p>
              </div>
              <div style="background-color: #e2e8f0; padding: 20px; text-align: center; font-size: 13px; color: #555555; border-top: 1px solid #d1d8e0;">
                This is an automated notification.
              </div>
            </div>
          </div>
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
