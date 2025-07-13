"use client"

import type React from "react"
import { useState } from "react"
import axios from "axios"



interface ContactFormData {
  fullname: string
  email: string
  phonenumber: string
  serviceRequired: string
  message: string
}

export default function Contact() {
  const [formData, setFormData] = useState<ContactFormData>({
    fullname: "",
    email: "",
    phonenumber: "",
    serviceRequired: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage(null)

    try {
      // Convert phonenumber to number for API
      const submitData = {
        ...formData,
        phonenumber: Number.parseInt(formData.phonenumber, 10),
      }

      // Send data to API using axios
      const response = await axios.post("/api/contact", submitData, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      console.log("Form submitted successfully:", response.data)

      setSubmitMessage("Message sent successfully! We'll get back to you soon.")
      setFormData({
        fullname: "",
        email: "",
        phonenumber: "",
        serviceRequired: "",
        message: "",
      })
    } catch (error) {
      console.error("Form submission error:", error)

      // Handle different types of errors
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Server responded with error status
          setSubmitMessage(`Failed to send message: ${error.response.data?.error || "Server error"}`)
        } else if (error.request) {
          // Request was made but no response received
          setSubmitMessage("Failed to send message: No response from server. Please check your connection.")
        } else {
          // Something else happened
          setSubmitMessage("Failed to send message: Request setup error.")
        }
      } else {
        setSubmitMessage("Failed to send message. Please try again later.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div>
      
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Get In Touch</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ready to start your move? Contact us today for a free quote and consultation. We&apos;re here to make your
              relocation smooth and stress-free.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h3>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <title>Address Icon</title>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-1">Address</h4>
                      <p className="text-gray-600">Australia</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <title>Phone Icon</title>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-1">Phone</h4>
                      <a href="tel:0452272533" className="text-gray-600 hover:text-teal-600 transition-colors">
                        0452272533
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <title>Email Icon</title>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-1">Email</h4>
                      <a
                        href="mailto:himalayaremovals7@gmail.com"
                        className="text-gray-600 hover:text-teal-600 transition-colors"
                      >
                        himalayaremovals7@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <title>Business Hours Icon</title>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-1">Business Hours</h4>
                      <p className="text-gray-600">Mon - Sat: 8:00 AM - 6:00 PM</p>
                      <p className="text-gray-600">Sunday: 9:00 AM - 4:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
             
            </div>

            {/* Contact Form */}
            <div className="bg-gradient-to-br from-slate-50 to-teal-50 rounded-2xl p-8 border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Send Us a Message</h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="fullname"
                      name="fullname"
                      required
                      value={formData.fullname}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      placeholder="Your full name"
                      aria-required="true"
                    />
                  </div>

                  <div>
                    <label htmlFor="phonenumber" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phonenumber"
                      name="phonenumber"
                      required
                      value={formData.phonenumber}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      placeholder="Your phone number"
                      aria-required="true"
                      pattern="[0-9]+"
                      title="Please enter a valid phone number"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    placeholder="your.email@example.com"
                    aria-required="true"
                  />
                </div>

                <div>
                  <label htmlFor="serviceRequired" className="block text-sm font-medium text-gray-700 mb-2">
                    Service Required *
                  </label>
                  <select
                    id="serviceRequired"
                    name="serviceRequired"
                    required
                    value={formData.serviceRequired}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    aria-required="true"
                  >
                    <option value="">Select a service</option>
                    <option value="House Removal">Removal</option>
                    <option value="Rubbish Removal">Rubbish Removal</option>
                     <option value="Pest Control">Pest Control</option>
                    
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
                    placeholder="Tell us about your moving requirements..."
                    aria-required="true"
                  />
                </div>

                {submitMessage && (
                  <p
                    className={`text-center text-sm ${
                      submitMessage.includes("successfully") ? "text-green-600" : "text-red-600"
                    }`}
                    role="alert"
                  >
                    {submitMessage}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white py-3 rounded-lg font-semibold hover:from-teal-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending Message..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    
    </div>
  )
}
