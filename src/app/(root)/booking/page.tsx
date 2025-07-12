"use client"

import type React from "react"
import { useState, useEffect } from "react"

import Header from "../component/header/header"
import Footer from "../component/footer/footer"

interface Service {
  _id: string
  title: string
  subServices: SubService[]
  createdAt: string
  updatedAt: string
}

interface SubService {
  title: string
  description: string
  price?: number
}

export default function BookingPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    fromAddress: "",
    fromPostcode: "",
    toAddress: "",
    toPostcode: "",
    moveDate: "",
    customDateDescription: "",
    preferredTime: "",
    service: "",
    subServices: [] as string[],
  })

  const [services, setServices] = useState<Service[]>([])
  const [isLoadingServices, setIsLoadingServices] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [submitMessage, setSubmitMessage] = useState("")
  const [serviceError, setServiceError] = useState<string | null>(null)

  // Fetch services
  const fetchServices = async () => {
    try {
      setIsLoadingServices(true)
      setServiceError(null)

      const response = await fetch("/api/services", {
        headers: {
          "Cache-Control": "no-cache",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to load services")
      }

      const servicesData = await response.json()
      console.log("Fetched services:", servicesData) // Debug log
      setServices(servicesData) // Remove the filter since we don't have isActive property
    } catch (error) {
      console.error("Error fetching services:", error)
      setServiceError("Unable to load services. Please try again later.")
    } finally {
      setIsLoadingServices(false)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubServiceToggle = (subServiceTitle: string) => {
    setFormData((prev) => ({
      ...prev,
      subServices: prev.subServices.includes(subServiceTitle)
        ? prev.subServices.filter((s) => s !== subServiceTitle)
        : [...prev.subServices, subServiceTitle],
    }))
  }

  const selectedService = services.find((s) => s._id === formData.service)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")
    setSubmitMessage("")

    try {
      // Validation
      const requiredFields = [
        "fullName",
        "phoneNumber",
        "email",
        "fromAddress",
        "fromPostcode",
        "toAddress",
        "toPostcode",
        "moveDate",
        "preferredTime",
        "service",
      ]

      const missingFields = requiredFields.filter((field) => {
        return !formData[field as keyof typeof formData]
      })

      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(", ")}`)
      }

      if (formData.subServices.length === 0) {
        throw new Error("Please select at least one sub-service")
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        throw new Error("Please enter a valid email address")
      }

      // Phone validation
      const phoneRegex = /^[+]?[0-9\-\s()]{10,}$/
      if (!phoneRegex.test(formData.phoneNumber)) {
        throw new Error("Please enter a valid phone number")
      }

      const bookingData = {
        fullName: formData.fullName.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        email: formData.email.trim().toLowerCase(),
        fromAddress: formData.fromAddress.trim(),
        fromPostcode: formData.fromPostcode.trim(),
        toAddress: formData.toAddress.trim(),
        toPostcode: formData.toPostcode.trim(),
        moveDate: new Date(formData.moveDate).toISOString(),
        customDateDescription: formData.customDateDescription.trim() || null,
        preferredTime: formData.preferredTime,
        service: formData.service,
        subServices: formData.subServices,
      }

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || `Server error: ${response.status}`)
      }

      setSubmitStatus("success")
      setSubmitMessage(
        `Thank you ${formData.fullName.split(" ")[0]}! Your booking request has been submitted successfully. We'll contact you within 24 hours to confirm the details.`,
      )

      // Reset form after success
      setTimeout(() => {
        setFormData({
          fullName: "",
          phoneNumber: "",
          email: "",
          fromAddress: "",
          fromPostcode: "",
          toAddress: "",
          toPostcode: "",
          moveDate: "",
          customDateDescription: "",
          preferredTime: "",
          service: "",
          subServices: [],
        })
        setSubmitStatus("idle")
        setSubmitMessage("")
      }, 5000)
    } catch (error) {
      console.error("Submission error:", error)
      setSubmitStatus("error")
      setSubmitMessage(error instanceof Error ? error.message : "An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get minimum date (today) for date input
  const today = new Date().toISOString().split("T")[0]

  return ( 
   <div><Header/>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Book Your Moving Service</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Fill out the form below and we'll get back to you with a personalized quote for your moving needs.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#00968a] to-[#00968a] text-white p-6">
            <h2 className="text-2xl font-bold">Booking Request Form</h2>
            <p className="text-blue-100 mt-2">Please provide all the required information for an accurate quote</p>
          </div>

          <div className="p-8">
            {/* Status Messages */}
            {submitStatus !== "idle" && (
              <div
                className={`mb-6 p-4 rounded-lg border flex items-start ${
                  submitStatus === "success"
                    ? "bg-green-50 border-green-200 text-green-800"
                    : "bg-red-50 border-red-200 text-red-800"
                }`}
              >
                <div className="flex-shrink-0 mr-3 mt-0.5">
                  {submitStatus === "success" ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <span className="font-medium">{submitMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="your.email@example.com"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                      <input
                        type="tel"
                        id="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                        placeholder="+1-234-567-8900"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <h3 className="text-xl font-semibold text-gray-900">Moving Details</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                      From Address
                    </h4>
                    <div>
                      <label htmlFor="fromAddress" className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        id="fromAddress"
                        value={formData.fromAddress}
                        onChange={(e) => handleInputChange("fromAddress", e.target.value)}
                        placeholder="123 Main Street, Apt 4B"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="fromPostcode" className="block text-sm font-medium text-gray-700 mb-1">
                        Postcode *
                      </label>
                      <input
                        type="text"
                        id="fromPostcode"
                        value={formData.fromPostcode}
                        onChange={(e) => handleInputChange("fromPostcode", e.target.value)}
                        placeholder="12345"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                      To Address
                    </h4>
                    <div>
                      <label htmlFor="toAddress" className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        id="toAddress"
                        value={formData.toAddress}
                        onChange={(e) => handleInputChange("toAddress", e.target.value)}
                        placeholder="456 Oak Avenue, Unit 2A"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="toPostcode" className="block text-sm font-medium text-gray-700 mb-1">
                        Postcode *
                      </label>
                      <input
                        type="text"
                        id="toPostcode"
                        value={formData.toPostcode}
                        onChange={(e) => handleInputChange("toPostcode", e.target.value)}
                        placeholder="67890"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Date and Time */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-900">Schedule</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="moveDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Move Date *
                    </label>
                    <input
                      type="date"
                      id="moveDate"
                      value={formData.moveDate}
                      onChange={(e) => handleInputChange("moveDate", e.target.value)}
                      min={today}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Time *
                    </label>
                    <select
                      id="preferredTime"
                      value={formData.preferredTime}
                      onChange={(e) => handleInputChange("preferredTime", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    >
                      <option value="">Select time</option>
                      <option value="Morning">Morning (8AM - 12PM)</option>
                      <option value="Afternoon">Afternoon (12PM - 5PM)</option>
                      <option value="Evening">Evening (5PM - 8PM)</option>
                      <option value="Flexible">Flexible</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="customDateDescription" className="block text-sm font-medium text-gray-700 mb-1">
                      Special Date Notes
                    </label>
                    <input
                      type="text"
                      id="customDateDescription"
                      value={formData.customDateDescription}
                      onChange={(e) => handleInputChange("customDateDescription", e.target.value)}
                      placeholder="e.g., End of lease, flexible dates"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Service Selection */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Select Services</h3>
                  <button
                    type="button"
                    onClick={fetchServices}
                    disabled={isLoadingServices}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg
                      className={`w-4 h-4 mr-2 ${isLoadingServices ? "animate-spin" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Refresh
                  </button>
                </div>

                {isLoadingServices ? (
                  <div className="text-center py-8">
                    <svg
                      className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    <p className="text-gray-600">Loading services...</p>
                  </div>
                ) : serviceError ? (
                  <div className="text-center py-8 text-red-600">
                    <svg className="w-8 h-8 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                    <p>{serviceError}</p>
                  </div>
                ) : (
                  <>
                    {/* Main Service Selection */}
                    <div>
                      <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
                        Main Service *
                      </label>
                      <select
                        id="service"
                        value={formData.service}
                        onChange={(e) => {
                          handleInputChange("service", e.target.value)
                          handleInputChange("subServices", []) // Reset sub-services
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      >
                        <option value="">Select a service</option>
                        {services.map((service) => (
                          <option key={service._id} value={service._id}>
                            {service.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Sub-Services Selection */}
                    {selectedService && selectedService.subServices.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Sub-Services * (Select at least one)
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedService.subServices.map((subService, index) => (
                            <div
                              key={index}
                              className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <input
                                type="checkbox"
                                id={`subservice-${index}`}
                                checked={formData.subServices.includes(subService.title)}
                                onChange={() => handleSubServiceToggle(subService.title)}
                                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <div className="flex-1">
                                <label
                                  htmlFor={`subservice-${index}`}
                                  className="font-medium cursor-pointer text-gray-900"
                                >
                                  {subService.title}
                                </label>
                                <p className="text-sm text-gray-600 mt-1">{subService.description}</p>
                                {subService.price && (
                                  <p className="text-sm font-medium text-green-600 mt-1">${subService.price}</p>
                                )}
                              </div>
                              
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={isSubmitting || isLoadingServices || !!serviceError}
                  className="w-full py-3 px-6 text-lg font-semibold text-white bg-gradient-to-r from-[#00968a] to-[#00968a] hover:[#00968a] hover:to-[#04786e] rounded-md shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      Submitting Request...
                    </span>
                  ) : (
                    "Submit Booking Request"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Contact Information */}
        <div className="text-center mt-8">
          <p className="text-gray-600 mb-4">Need help or have questions? Contact us directly:</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+1234567890"
              className="inline-flex items-center px-6 py-3 border-2 border-blue-500 text-blue-600 rounded-lg font-semibold hover:bg-blue-500 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              Call:0452272533
            </a>
            <a
              href="mailto:info@movingcompany.com"
              className="inline-flex items-center px-6 py-3 border-2 border-green-500 text-green-600 rounded-lg font-semibold hover:bg-green-500 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Email Us
            </a>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </div>
  )
}
