"use client"

import type React from "react"
import { useState, useEffect } from "react"

interface Service {
  _id: string
  name: string
  description: string
  isActive: boolean
  category: string
}

interface SubService {
  _id: string
  serviceId: string
  name: string
  description: string
  price: number
  priceType: string
  isActive: boolean
}

export function SimpleBookingForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    emailAddress: "",
    phoneNumber: "",
    serviceId: "",
    subServiceId: "",
    notes: "",
  })

  const [services, setServices] = useState<Service[]>([])
  const [subServices, setSubServices] = useState<SubService[]>([])
  const [isLoadingOptions, setIsLoadingOptions] = useState(true)
  const [errorOptions, setErrorOptions] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [submitMessage, setSubmitMessage] = useState("")

  useEffect(() => {
    fetchServices()
  }, [])

  useEffect(() => {
    if (formData.serviceId) {
      fetchSubServices(formData.serviceId)
    } else {
      setSubServices([])
      setFormData((prev) => ({ ...prev, subServiceId: "" }))
    }
  }, [formData.serviceId])

  const fetchServices = async () => {
    try {
      setIsLoadingOptions(true)
      setErrorOptions(null)
      const response = await fetch("/api/services")
      if (!response.ok) {
        throw new Error("Failed to load services. Please try refreshing the page.")
      }
      const data = await response.json()
      setServices(data.services.filter((service: Service) => service.isActive))
    } catch (error) {
      if (error instanceof Error) {
        setErrorOptions(error.message)
      } else {
        setErrorOptions("An unknown error occurred.")
      }
    } finally {
      setIsLoadingOptions(false)
    }
  }

  const fetchSubServices = async (serviceId: string) => {
    try {
      const response = await fetch(`/api/services/${serviceId}/sub-services`)
      if (response.ok) {
        const data = await response.json()
        setSubServices(data.subServices.filter((subService: SubService) => subService.isActive))
      }
    } catch (error) {
      console.error("Error fetching sub-services:", error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const requiredFields = ["fullName", "emailAddress", "phoneNumber", "serviceId"]
      const missingFields = requiredFields.filter((field) => !formData[field as keyof typeof formData])

      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(", ")}`)
      }

      const selectedService = services.find((s) => s._id === formData.serviceId)
      const selectedSubService = subServices.find((s) => s._id === formData.subServiceId)

      const bookingData = {
        ...formData,
        serviceName: selectedService?.name,
        subServiceName: selectedSubService?.name,
        subServicePrice: selectedSubService?.price,
        bookingId: `BK-${Date.now()}`,
        submittedAt: new Date().toISOString(),
      }

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      })

      if (!response.ok) {
        throw new Error("Failed to submit booking. Please try again.")
      }

      const result = await response.json()
      setSubmitStatus("success")
      setSubmitMessage(`Booking submitted successfully! Your booking ID is: ${result.bookingId}`)

      // Reset form after 5 seconds
      setTimeout(() => {
        setFormData({
          fullName: "",
          emailAddress: "",
          phoneNumber: "",
          serviceId: "",
          subServiceId: "",
          notes: "",
        })
        setSubmitStatus("idle")
        setSubmitMessage("")
      }, 5000)
    } catch (error) {
      setSubmitStatus("error")
      setSubmitMessage(error instanceof Error ? error.message : "An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="booking" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-teal-50 via-slate-50 to-orange-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">Book Your Service</h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Fill out the form below to request our services. We'll get back to you shortly with a quote.
          </p>
        </div>

        {/* Booking Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
          <form onSubmit={handleSubmit}>
            {/* Error loading options message */}
            {errorOptions && (
              <div className="mb-6 p-4 rounded-lg border bg-red-50 border-red-200 text-red-800">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">{errorOptions}</span>
                </div>
              </div>
            )}

            {/* Status Messages */}
            {submitStatus !== "idle" && (
              <div
                className={`mb-6 p-4 rounded-lg border ${
                  submitStatus === "success"
                    ? "bg-green-50 border-green-200 text-green-800"
                    : "bg-red-50 border-red-200 text-red-800"
                }`}
              >
                <div className="flex items-center">
                  {submitStatus === "success" ? (
                    <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  <span className="font-medium text-sm sm:text-base">{submitMessage}</span>
                </div>
              </div>
            )}

            {/* Personal Information */}
            <div className="space-y-6">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="md:col-span-1">
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm sm:text-base"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="md:col-span-1">
                  <label htmlFor="emailAddress" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="emailAddress"
                    name="emailAddress"
                    required
                    value={formData.emailAddress}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm sm:text-base"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="md:col-span-1">
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    required
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm sm:text-base"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div className="md:col-span-1">
                  <label htmlFor="serviceId" className="block text-sm font-medium text-gray-700 mb-2">
                    Service Type *
                  </label>
                  <select
                    id="serviceId"
                    name="serviceId"
                    required
                    value={formData.serviceId}
                    onChange={handleInputChange}
                    disabled={isLoadingOptions || !!errorOptions}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm sm:text-base disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">{isLoadingOptions ? "Loading..." : "Select service type"}</option>
                    {services.map((service) => (
                      <option key={service._id} value={service._id}>
                        {service.name} - {service.category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sub-Service Selection */}
                {formData.serviceId && subServices.length > 0 && (
                  <div className="md:col-span-2">
                    <label htmlFor="subServiceId" className="block text-sm font-medium text-gray-700 mb-2">
                      Specific Service (Optional)
                    </label>
                    <select
                      id="subServiceId"
                      name="subServiceId"
                      value={formData.subServiceId}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm sm:text-base"
                    >
                      <option value="">Choose specific service (optional)</option>
                      {subServices.map((subService) => (
                        <option key={subService._id} value={subService._id}>
                          {subService.name} - ${subService.price} ({subService.priceType})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Service Information Display */}
                {formData.serviceId && (
                  <div className="md:col-span-2">
                    <div className="bg-gradient-to-r from-teal-50 to-orange-50 rounded-lg p-4 sm:p-6 border border-teal-200">
                      <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">
                        Selected Service
                      </h4>
                      <div className="space-y-2 text-sm sm:text-base">
                        <div>
                          <span className="font-medium text-gray-700">Service:</span>{" "}
                          <span className="text-gray-900">
                            {services.find((s) => s._id === formData.serviceId)?.name}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Category:</span>{" "}
                          <span className="text-gray-900">
                            {services.find((s) => s._id === formData.serviceId)?.category}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Description:</span>{" "}
                          <span className="text-gray-900">
                            {services.find((s) => s._id === formData.serviceId)?.description}
                          </span>
                        </div>
                        {formData.subServiceId && (
                          <div className="mt-3 pt-3 border-t border-teal-200">
                            <div>
                              <span className="font-medium text-gray-700">Specific Service:</span>{" "}
                              <span className="text-gray-900">
                                {subServices.find((s) => s._id === formData.subServiceId)?.name}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Price:</span>{" "}
                              <span className="text-green-600 font-semibold">
                                ${subServices.find((s) => s._id === formData.subServiceId)?.price} (
                                {subServices.find((s) => s._id === formData.subServiceId)?.priceType})
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Additional Notes */}
                <div className="md:col-span-2">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                    Special Requirements or Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={4}
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none text-sm sm:text-base"
                    placeholder="Please describe any special requirements, fragile items, access restrictions, or additional information..."
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting || isLoadingOptions || !!errorOptions}
                className={`w-full px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base ${
                  isSubmitting || isLoadingOptions || !!errorOptions
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700"
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </div>
                ) : (
                  "Submit Booking Request"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Contact Information */}
        <div className="text-center mt-8 sm:mt-12">
          <p className="text-gray-600 mb-4 text-sm sm:text-base">
            Need help with your booking? Our team is here to assist you.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md mx-auto">
            <a
              href="tel:+977-9851331114"
              className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 border-2 border-teal-500 text-teal-600 rounded-lg font-semibold hover:bg-teal-500 hover:text-white transition-all duration-300 text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              Call: 0452272533
            </a>
            <a
              href="mailto:info@himalayaremovals.com.np"
              className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 border-2 border-orange-500 text-orange-600 rounded-lg font-semibold hover:bg-orange-500 hover:text-white transition-all duration-300 text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    </section>
  )
}
