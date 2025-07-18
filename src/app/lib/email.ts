import nodemailer from "nodemailer"

// Configure your email transporter
// It's highly recommended to use environment variables for sensitive information
// like EMAIL_USER, EMAIL_PASS, EMAIL_HOST, EMAIL_PORT.
// For production, consider using a dedicated transactional email service like SendGrid, Mailgun, or AWS SES.
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.ethereal.email", // e.g., smtp.sendgrid.net, smtp.mailgun.org
  port: Number.parseInt(process.env.EMAIL_PORT || "587"), // 587 for TLS, 465 for SSL
  secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || "your_email@example.com", // Your email address
    pass: process.env.EMAIL_PASS || "your_email_password", // Your email password or API key
  },
})

interface SendEmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
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
