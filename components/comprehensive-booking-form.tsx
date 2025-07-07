"use client"

import { useState, useEffect, useCallback } from "react"
import { useToast } from "./toast"

interface Service {
  _id: string
  name: string
  description: string
  basePrice?: number
  priceType: string
  category: string
  isActive: boolean
}

interface SubService {
  _id: string
  serviceId: string
  name: string
  description: string
  price: number
  priceType: string
  estimatedDuration?: string
  features: string[]
  isActive: boolean
}

interface BookingFormData {
  fullName: string
  emailAddress: string
  phoneNumber: string
  serviceId: string
  serviceName: string
  subServiceId?: string
  subServiceName?: string
  subServicePrice?: number
  details: string
  preferredDate?: string
  preferredTime?: string
  address?: string
  specialRequirements?: string
}

export function ComprehensiveBookingForm() {
  const [services, setServices] = useState<Service[]>([])
  const [subServices, setSubServices] = useState<{ [key: string]: SubService[] }>({})
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedSubService, setSelectedSubService] = useState<SubService | null>(null)
  const [loading, setLoading] = useState(false)
  const [isLoadingServices, setIsLoadingServices] = useState(true)
  const [serviceError, setServiceError] = useState<string | null>(null)
  const { showToast } = useToast()

  const [formData, setFormData] = useState<BookingFormData>({
    fullName: "",
    emailAddress: "",
    phoneNumber: "",
    serviceId: "",
    serviceName: "",
    details: "",
  })

  // Fetch all services and sub-services
  const fetchAllServicesAndSubServices = useCallback(async () => {
    try {
      setIsLoadingServices(true)
      setServiceError(null)

      // Fetch services
      const servicesResponse = await fetch("/api/admin/services", {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      })

      if (!servicesResponse.ok) {
        throw new Error("Failed to load services")
      }

      const servicesData = await servicesResponse.json()
      const activeServices = servicesData.services.filter((service: Service) => service.isActive)
      setServices(activeServices)

      // Fetch all sub-services for all services
      const allSubServicesPromises = activeServices.map(async (service: Service) => {
        try {
          const subServicesResponse = await fetch(`/api/admin/services/${service._id}/sub-services`, {
            headers: {
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
            },
          })

          if (subServicesResponse.ok) {
            const subServicesData = await subServicesResponse.json()
            return subServicesData.subServices.filter((subService: SubService) => subService.isActive)
          }
          return []
        } catch (error) {
          console.error(`Error fetching sub-services for ${service.name}:`, error)
          return []
        }
      })

      const allSubServicesArrays = await Promise.all(allSubServicesPromises)
      const subServicesMap: { [key: string]: SubService[] } = {}

      activeServices.forEach((service: Service, index: number) => {
        subServicesMap[service._id] = allSubServicesArrays[index] || []
      })

      setSubServices(subServicesMap)
    } catch (error) {
      console.error("Error fetching services:", error)
      setServiceError("Failed to load services. Please try again.")
    } finally {
      setIsLoadingServices(false)
    }
  }, [])

  useEffect(() => {
    fetchAllServicesAndSubServices()
  }, [fetchAllServicesAndSubServices])

  const handleServiceChange = (serviceId: string) => {
    const service = services.find((s) => s._id === serviceId)
    setSelectedService(service || null)
    setSelectedSubService(null)
    setFormData((prev) => ({
      ...prev,
      serviceId: serviceId,
      serviceName: service?.name || "",
      subServiceId: "",
      subServiceName: "",
      subServicePrice: undefined,
    }))
  }

  const handleSubServiceChange = (subServiceId: string) => {
    if (!selectedService) return

    const subService = subServices[selectedService._id]?.find((ss) => ss._id === subServiceId)
    setSelectedSubService(subService || null)
    setFormData((prev) => ({
      ...prev,
      subServiceId: subServiceId,
      subServiceName: subService?.name || "",
      subServicePrice: subService?.price || undefined,
    }))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const generateBookingId = () => {
    const timestamp = Date.now().toString()
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    return `BK-${timestamp.slice(-6)}-${random}`
  }

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      showToast("Please enter your full name", "error")
      return false
    }
    if (!formData.emailAddress.trim()) {
      showToast("Please enter your email address", "error")
      return false
    }
    if (!formData.phoneNumber.trim()) {
      showToast("Please enter your phone number", "error")
      return false
    }
    if (!formData.serviceId) {
      showToast("Please select a service", "error")
      return false
    }
    if (!formData.details.trim() || formData.details.trim().length < 10) {
      showToast("Please provide detailed requirements (at least 10 characters)", "error")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const bookingData = {
        ...formData,
        bookingId: generateBookingId(),
        submittedAt: new Date().toISOString(),
      }

      console.log("Submitting booking data:", bookingData)

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      })

      const result = await response.json()

      if (response.ok) {
        showToast(`Booking submitted successfully! Your booking ID is: ${result.bookingId}`, "success")
        // Reset form
        setFormData({
          fullName: "",
          emailAddress: "",
          phoneNumber: "",
          serviceId: "",
          serviceName: "",
          details: "",
        })
        setSelectedService(null)
        setSelectedSubService(null)
      } else {
        showToast(result.error || "Failed to submit booking", "error")
      }
    } catch (error) {
      console.error("Error submitting booking:", error)
      showToast("An unexpected error occurred. Please try again.", "error")
    } finally {
      setLoading(false)
    }
  }

  if (isLoadingServices) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading services...</span>
      </div>
    )
  }

  if (serviceError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{serviceError}</p>
        <button
          onClick={fetchAllServicesAndSubServices}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Book Your Service</h2>
        <p className="text-gray-600">Fill out the form below to request our services</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
              <input
                type="email"
                name="emailAddress"
                value={formData.emailAddress}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address || ""}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Service location address"
              />
            </div>
          </div>
        </div>

        {/* Service Selection */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Selection</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Service *</label>
              <select
                name="serviceId"
                value={formData.serviceId}
                onChange={(e) => handleServiceChange(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Choose a service...</option>
                {services.map((service) => (
                  <option key={service._id} value={service._id}>
                    {service.name} - {service.category}
                  </option>
                ))}
              </select>
            </div>

            {selectedService && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">{selectedService.name}</h4>
                <p className="text-blue-800 text-sm mb-2">{selectedService.description}</p>
                {selectedService.basePrice && (
                  <p className="text-blue-700 text-sm">
                    Base Price: ${selectedService.basePrice} ({selectedService.priceType})
                  </p>
                )}
              </div>
            )}

            {selectedService && subServices[selectedService._id]?.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Sub-Service (Optional)</label>
                <select
                  name="subServiceId"
                  value={formData.subServiceId || ""}
                  onChange={(e) => handleSubServiceChange(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a sub-service (optional)...</option>
                  {subServices[selectedService._id].map((subService) => (
                    <option key={subService._id} value={subService._id}>
                      {subService.name} - ${subService.price} ({subService.priceType})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedSubService && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">{selectedSubService.name}</h4>
                <p className="text-green-800 text-sm mb-2">{selectedSubService.description}</p>
                <p className="text-green-700 text-sm">
                  Price: ${selectedSubService.price} ({selectedSubService.priceType})
                </p>
                {selectedSubService.estimatedDuration && (
                  <p className="text-green-700 text-sm">
                    Duration: {selectedSubService.estimatedDuration}
                  </p>
                )}
                {selectedSubService.features.length > 0 && (
                  <div className="mt-2">
                    <p className="text-green-700 text-sm font-medium">Features:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedSubService.features.map((feature, index) => (
                        <span
                          key={index}
                          className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Additional Details */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Details</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Requirements *</label>
              <textarea
                name="details"
                value={formData.details}
                onChange={handleInputChange}
                rows={4}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Please provide detailed information about your requirements, including any specific needs, preferences, or special considerations..."
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Minimum 10 characters. Be as detailed as possible to help us provide the best service.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
                <input
                  type="date"
                  name="preferredDate"
                  value={formData.preferredDate || ""}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time</label>
                <select
                  name="preferredTime"
                  value={formData.preferredTime || ""}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any time</option>
                  <option value="morning">Morning (8:00 AM - 12:00 PM)</option>
                  <option value="afternoon">Afternoon (12:00 PM - 5:00 PM)</option>
                  <option value="evening">Evening (5:00 PM - 8:00 PM)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Special Requirements</label>
              <textarea
                name="specialRequirements"
                value={formData.specialRequirements || ""}
                onChange={handleInputChange}
                rows={2}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Any special requirements, accessibility needs, or additional information..."
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium"
          >
            {loading ? "Submitting..." : "Submit Booking Request"}
          </button>
        </div>
      </form>
    </div>
  )
} 