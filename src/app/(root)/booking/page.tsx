"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Header from "../component/header/header"
import Footer from "../component/footer/footer"

// Interface to define the structure of the booking options data
interface BookingOptions {
  serviceTypes: string[]
  preferredTimes: string[]
  propertySizes: string[]
  estimatedWeights: string[]
  additionalServices: string[]
}

export default function BookingSection() {
  const [formData, setFormData] = useState({
    fullName: "",
    emailAddress: "",
    phoneNumber: "",
    fromLocation: "",
    toLocation: "",
    preferredMovingdate: "",
    preferredTime: "",
    serviceType: "",
    ProperSize: "",
    SpecialRequirement: "",
    EstimatedWeight: "",
    AdditionalService: "",
  })

  // State for storing the options fetched from the API
  const [bookingOptions, setBookingOptions] = useState<BookingOptions>({
    serviceTypes: [],
    preferredTimes: [],
    propertySizes: [],
    estimatedWeights: [],
    additionalServices: [],
  })

  // State to handle loading and error status for the API call
  const [isLoadingOptions, setIsLoadingOptions] = useState(true)
  const [errorOptions, setErrorOptions] = useState<string | null>(null)

  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [submitMessage, setSubmitMessage] = useState("")

  // Fetch booking options from the API when the component mounts
  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        setIsLoadingOptions(true)
        setErrorOptions(null)
        const response = await fetch("/api/booking-data")
        if (!response.ok) {
          throw new Error("Failed to load booking information. Please try refreshing the page.")
        }
        const data = await response.json()
        setBookingOptions(data)
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

    fetchBookingData()
  }, []) // The empty dependency array ensures this effect runs only once

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
      const requiredFields = [
        "fullName",
        "emailAddress",
        "phoneNumber",
        "serviceType",
        "fromLocation",
        "toLocation",
        "preferredMovingdate",
        "preferredTime",
        "ProperSize",
        "EstimatedWeight",
        "SpecialRequirement",
        "AdditionalService",
      ]
      const missingFields = requiredFields.filter((field) => !formData[field as keyof typeof formData])

      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(", ")}`)
      }

      const response = await fetch("/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          submittedAt: new Date().toISOString(),
          bookingId: `BK-${Date.now()}`,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit booking. Please try again.")
      }

      const result = await response.json()
      console.log(result)

      setSubmitStatus("success")
      setSubmitMessage(`Booking submitted successfully! Your booking ID is: ${result.bookingId || `BK-${Date.now()}`}`)

      setTimeout(() => {
        setFormData({
          fullName: "",
          emailAddress: "",
          phoneNumber: "",
          fromLocation: "",
          toLocation: "",
          preferredMovingdate: "",
          preferredTime: "",
          serviceType: "",
          ProperSize: "",
          SpecialRequirement: "",
          EstimatedWeight: "",
          AdditionalService: "",
        })
        setCurrentStep(1)
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

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div>
      <Header />
      <section id="booking" className="py-20 bg-gradient-to-br from-teal-50 via-slate-50 to-orange-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Book Your Move</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Schedule your relocation with our easy 3-step booking process. Get instant quotes and secure your moving
              date.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                      currentStep >= step
                        ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {currentStep > step ? (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      step
                    )}
                  </div>
                  {step < 3 && (
                    <div
                      className={`w-16 h-1 mx-2 transition-all duration-300 ${
                        currentStep > step ? "bg-teal-500" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              <div className="text-sm text-gray-600 font-medium">
                Step {currentStep} of {totalSteps}:{" "}
                {currentStep === 1
                  ? "Personal Information"
                  : currentStep === 2
                    ? "Move Details"
                    : "Additional Requirements"}
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <form onSubmit={handleSubmit}>
              {/* Error loading options message */}
              {errorOptions && (
                <div className="mb-6 p-4 rounded-lg border bg-red-50 border-red-200 text-red-800">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
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
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    <span className="font-medium">{submitMessage}</span>
                  </div>
                </div>
              )}
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-fade-in-up">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Personal Information</h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div>
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                        placeholder="+977-XXXXXXXXX"
                      />
                    </div>

                    <div>
                      <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-2">
                        Service Type *
                      </label>
                      <select
                        id="serviceType"
                        name="serviceType"
                        required
                        value={formData.serviceType}
                        onChange={handleInputChange}
                        disabled={isLoadingOptions || !!errorOptions}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      >
                        <option value="">{isLoadingOptions ? "Loading..." : "Select service type"}</option>
                        {bookingOptions.serviceTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Move Details */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-fade-in-up">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Move Details</h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="fromLocation" className="block text-sm font-medium text-gray-700 mb-2">
                        From Location *
                      </label>
                      <input
                        type="text"
                        id="fromLocation"
                        name="fromLocation"
                        required
                        value={formData.fromLocation}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                        placeholder="Current address"
                      />
                    </div>

                    <div>
                      <label htmlFor="toLocation" className="block text-sm font-medium text-gray-700 mb-2">
                        To Location *
                      </label>
                      <input
                        type="text"
                        id="toLocation"
                        name="toLocation"
                        required
                        value={formData.toLocation}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                        placeholder="Destination address"
                      />
                    </div>

                    <div>
                      <label htmlFor="preferredMovingdate" className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Move Date *
                      </label>
                      <input
                        type="date"
                        id="preferredMovingdate"
                        name="preferredMovingdate"
                        required
                        value={formData.preferredMovingdate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Time
                      </label>
                      <select
                        id="preferredTime"
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={handleInputChange}
                        disabled={isLoadingOptions || !!errorOptions}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      >
                        <option value="">{isLoadingOptions ? "Loading..." : "Select preferred time"}</option>
                        {bookingOptions.preferredTimes.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="ProperSize" className="block text-sm font-medium text-gray-700 mb-2">
                        Property Size
                      </label>
                      <select
                        id="ProperSize"
                        name="ProperSize"
                        value={formData.ProperSize}
                        onChange={handleInputChange}
                        disabled={isLoadingOptions || !!errorOptions}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      >
                        <option value="">{isLoadingOptions ? "Loading..." : "Select property size"}</option>
                        {bookingOptions.propertySizes.map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="EstimatedWeight" className="block text-sm font-medium text-gray-700 mb-2">
                        Estimated Weight
                      </label>
                      <select
                        id="EstimatedWeight"
                        name="EstimatedWeight"
                        value={formData.EstimatedWeight}
                        onChange={handleInputChange}
                        disabled={isLoadingOptions || !!errorOptions}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      >
                        <option value="">{isLoadingOptions ? "Loading..." : "Select estimated weight"}</option>
                        {bookingOptions.estimatedWeights.map((weight) => (
                          <option key={weight} value={weight}>
                            {weight}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Additional Requirements */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-fade-in-up">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Additional Requirements</h3>

                  <div>
                    <label htmlFor="SpecialRequirement" className="block text-sm font-medium text-gray-700 mb-2">
                      Special Requirements or Notes
                    </label>
                    <textarea
                      id="SpecialRequirement"
                      name="SpecialRequirement"
                      rows={6}
                      value={formData.SpecialRequirement}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
                      placeholder="Please describe any special requirements, fragile items, access restrictions, or additional services needed..."
                    />
                  </div>

                  <div>
                    <label htmlFor="AdditionalService" className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Service *
                    </label>
                    <select
                      id="AdditionalService"
                      name="AdditionalService"
                      required
                      value={formData.AdditionalService}
                      onChange={handleInputChange}
                      disabled={isLoadingOptions || !!errorOptions}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    >
                      <option value="">{isLoadingOptions ? "Loading..." : "Select additional service"}</option>
                      {bookingOptions.additionalServices.map((service) => (
                        <option key={service} value={service}>
                          {service}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="bg-gradient-to-r from-teal-50 to-orange-50 rounded-lg p-6 border border-teal-200">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Booking Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Name:</span> {formData.fullName || "Not specified"}
                      </div>
                      <div>
                        <span className="font-medium">Service:</span> {formData.serviceType || "Not specified"}
                      </div>
                      <div>
                        <span className="font-medium">From:</span> {formData.fromLocation || "Not specified"}
                      </div>
                      <div>
                        <span className="font-medium">To:</span> {formData.toLocation || "Not specified"}
                      </div>
                      <div>
                        <span className="font-medium">Date:</span> {formData.preferredMovingdate || "Not specified"}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    currentStep === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-md"
                  }`}
                >
                  Previous
                </button>

                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-teal-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting || isLoadingOptions || !!errorOptions}
                    className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${
                      isSubmitting || isLoadingOptions || !!errorOptions
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-orange-400 to-orange-500 text-white hover:from-orange-500 hover:to-orange-600"
                    }`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
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
                      "Submit Booking"
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Need help with your booking? Our team is here to assist you.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+977-9851331114"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-teal-500 text-teal-600 rounded-lg font-semibold hover:bg-teal-500 hover:text-white transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-orange-500 text-orange-600 rounded-lg font-semibold hover:bg-orange-500 hover:text-white transition-all duration-300"
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
      </section>
      <Footer />
    </div>
  )
}
