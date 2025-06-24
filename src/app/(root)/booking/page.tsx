"use client"

import type React from "react"

import { useState } from "react"

import Footer from "../component/footer/footer"
import Header from "../component/header/header"

export default function BookingSection() {
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    fromLocation: "",
    toLocation: "",
    moveDate: "",
    moveTime: "",
    serviceType: "",
    roomSize: "",
    specialRequirements: "",
    estimatedWeight: "",
  })

  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Booking submitted:", formData)
    // Handle booking submission
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
      <Header/>
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
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fade-in-up">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Personal Information</h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      placeholder="Enter your full name"
                    />
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
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    >
                      <option value="">Select service type</option>
                      <option value="household">Household Moving</option>
                      <option value="office">Office/Commercial Moving</option>
                      <option value="storage">Storage Services</option>
                      <option value="packing">Packing Only</option>
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
                    <label htmlFor="moveDate" className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Move Date *
                    </label>
                    <input
                      type="date"
                      id="moveDate"
                      name="moveDate"
                      required
                      value={formData.moveDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="moveTime" className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Time
                    </label>
                    <select
                      id="moveTime"
                      name="moveTime"
                      value={formData.moveTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    >
                      <option value="">Select preferred time</option>
                      <option value="morning">Morning (8:00 AM - 12:00 PM)</option>
                      <option value="afternoon">Afternoon (12:00 PM - 5:00 PM)</option>
                      <option value="evening">Evening (5:00 PM - 8:00 PM)</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="roomSize" className="block text-sm font-medium text-gray-700 mb-2">
                      Property Size
                    </label>
                    <select
                      id="roomSize"
                      name="roomSize"
                      value={formData.roomSize}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    >
                      <option value="">Select property size</option>
                      <option value="studio">Studio/1 Room</option>
                      <option value="1bedroom">1 Bedroom</option>
                      <option value="2bedroom">2 Bedroom</option>
                      <option value="3bedroom">3 Bedroom</option>
                      <option value="4bedroom">4+ Bedroom</option>
                      <option value="office">Office Space</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="estimatedWeight" className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Weight
                    </label>
                    <select
                      id="estimatedWeight"
                      name="estimatedWeight"
                      value={formData.estimatedWeight}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    >
                      <option value="">Select estimated weight</option>
                      <option value="light">Light (Under 500kg)</option>
                      <option value="medium">Medium (500kg - 1000kg)</option>
                      <option value="heavy">Heavy (1000kg - 2000kg)</option>
                      <option value="very-heavy">Very Heavy (Over 2000kg)</option>
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
                  <label htmlFor="specialRequirements" className="block text-sm font-medium text-gray-700 mb-2">
                    Special Requirements or Notes
                  </label>
                  <textarea
                    id="specialRequirements"
                    name="specialRequirements"
                    rows={6}
                    value={formData.specialRequirements}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
                    placeholder="Please describe any special requirements, fragile items, access restrictions, or additional services needed..."
                  />
                </div>

                {/* Services Checklist */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Additional Services</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      "Packing materials included",
                      "Furniture disassembly/assembly",
                      "Storage services",
                      "Insurance coverage",
                      "Cleaning services",
                      "Piano/special item moving",
                    ].map((service, index) => (
                      <label key={index} className="flex items-center space-x-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500 transition-all"
                        />
                        <span className="text-gray-700 group-hover:text-teal-600 transition-colors">{service}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-gradient-to-r from-teal-50 to-orange-50 rounded-lg p-6 border border-teal-200">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Booking Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Name:</span> {formData.name || "Not specified"}
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
                      <span className="font-medium">Date:</span> {formData.moveDate || "Not specified"}
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
                  className="bg-gradient-to-r from-orange-400 to-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-orange-500 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Submit Booking
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Contact Info */}
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
 <Footer/>
    </div>
  )
}
