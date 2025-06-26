"use client"

import type React from "react"
import { useState } from "react"

interface FormData {
  fromLocation: string
  toLocation: string
  name: string
  phone: string
  email: string
  movingDate: string
}

interface FormErrors {
  service?: string
  fromLocation?: string
  toLocation?: string
  name?: string
  phone?: string
  email?: string
  movingDate?: string
}

export default function BookingForm() {
  const [selectedService, setSelectedService] = useState("household")
  const [formData, setFormData] = useState<FormData>({
    fromLocation: "",
    toLocation: "",
    name: "",
    phone: "",
    email: "",
    movingDate: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const services = [
    { id: "household", label: "Household Moving" },
    { id: "office", label: "Office Moving" },
    { id: "storage", label: "Storage" },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  const getTomorrowDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split("T")[0]
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!selectedService) {
      newErrors.service = "Please select a service"
    }
    if (!formData.fromLocation.trim()) {
      newErrors.fromLocation = "From location is required"
    }
    if (!formData.toLocation.trim()) {
      newErrors.toLocation = "To location is required"
    }
    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!/^\d{10,}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid phone number"
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }
    if (!formData.movingDate) {
      newErrors.movingDate = "Moving date is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateAndSubmit = async () => {
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Reset form on success
      setFormData({
        fromLocation: "",
        toLocation: "",
        name: "",
        phone: "",
        email: "",
        movingDate: "",
      })
      setSelectedService("household")
      setSubmitStatus("success")

      // Clear success message after 5 seconds
      setTimeout(() => setSubmitStatus("idle"), 5000)
    } catch {
      setSubmitStatus("error")
      setTimeout(() => setSubmitStatus("idle"), 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="text-gray-800" style={{ backgroundColor: "#f5fcfb" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-3xl font-bold mb-4">
              MOVING ANYTHING TO EVERYWHERE <span className="text-amber-300">Globally</span>
            </h3>
            <p className="text-lg opacity-90">
              Your trusted partner in all things moving. Local Move, Interstate move, Rubbish Removal. Sydney Based.
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 text-gray-800 shadow-2xl">
            <h4 className="text-xl font-bold mb-4 text-center">BOOK YOUR MOVE NOW</h4>

            {submitStatus === "success" && (
              <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                <span className="font-semibold">Booking Confirmed!</span>
                <p className="text-sm mt-1">{"We'll contact you shortly to confirm the details."}</p>
              </div>
            )}
            {submitStatus === "error" && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                <span className="font-semibold">Booking Failed.</span>
                <p className="text-sm mt-1">Please try again or contact us directly.</p>
              </div>
            )}

            <div className="mb-4">
              <div className="grid grid-cols-2 gap-2">
                {services.map((service) => (
                  <label
                    key={service.id}
                    className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      name="service"
                      value={service.id}
                      checked={selectedService === service.id}
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-sm">{service.label}</span>
                  </label>
                ))}
              </div>
              {errors.service && <p className="text-red-500 text-xs mt-1">{errors.service}</p>}
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <input
                  type="text"
                  name="fromLocation"
                  placeholder="From Location *"
                  value={formData.fromLocation}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${errors.fromLocation ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.fromLocation && <p className="text-red-500 text-xs mt-1">{errors.fromLocation}</p>}
              </div>
              <div>
                <input
                  type="text"
                  name="toLocation"
                  placeholder="To Location *"
                  value={formData.toLocation}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${errors.toLocation ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.toLocation && <p className="text-red-500 text-xs mt-1">{errors.toLocation}</p>}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name *"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${errors.name ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number *"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${errors.phone ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address *"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${errors.email ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <input
                  type="date"
                  name="movingDate"
                  placeholder="Moving Date *"
                  value={formData.movingDate}
                  onChange={handleInputChange}
                  min={getTomorrowDate()}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${errors.movingDate ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.movingDate && <p className="text-red-500 text-xs mt-1">{errors.movingDate}</p>}
              </div>
            </div>

            <button
              type="button"
              onClick={validateAndSubmit}
              disabled={isSubmitting}
              className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-orange-400 to-orange-500 text-white hover:from-orange-500 hover:to-orange-600"}`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                "Book Now"
              )}
            </button>
            <p className="text-xs text-gray-500 mt-3 text-center">
              * Required fields. By booking, you agree to our terms.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
