"use client"

import { useState, useEffect } from "react"
import { useToast } from "./toast"

interface Service {
  _id: string
  name: string
  description: string
  basePrice?: number
  priceType: string
  category: string
  isActive: boolean
  createdAt: string
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

export function EnhancedServiceManagement() {
  const [services, setServices] = useState<Service[]>([])
  const [subServices, setSubServices] = useState<{ [key: string]: SubService[] }>({})
  const [loading, setLoading] = useState(true)
  const [showAddService, setShowAddService] = useState(false)
  const [showAddSubService, setShowAddSubService] = useState<string | null>(null)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [editingSubService, setEditingSubService] = useState<SubService | null>(null)
  const { showToast } = useToast()

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/admin/services")
      if (response.ok) {
        const data = await response.json()
        setServices(data.services)

        // Fetch sub-services for each service
        for (const service of data.services) {
          fetchSubServices(service._id)
        }
      }
    } catch (error) {
      showToast("Failed to fetch services", "error")
    } finally {
      setLoading(false)
    }
  }

  const fetchSubServices = async (serviceId: string) => {
    try {
      const response = await fetch(`/api/admin/services/${serviceId}/sub-services`)
      if (response.ok) {
        const data = await response.json()
        setSubServices((prev) => ({ ...prev, [serviceId]: data.subServices }))
      }
    } catch (error) {
      console.error("Error fetching sub-services:", error)
    }
  }

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm("Are you sure you want to delete this service? This will also delete all sub-services.")) {
      return
    }

    try {
      const response = await fetch(`/api/admin/services/${serviceId}`, { method: "DELETE" })
      if (response.ok) {
        setServices(services.filter((s) => s._id !== serviceId))
        setSubServices((prev) => {
          const newSubServices = { ...prev }
          delete newSubServices[serviceId]
          return newSubServices
        })
        showToast("Service deleted successfully", "success")
      }
    } catch (error) {
      showToast("Failed to delete service", "error")
    }
  }

  const handleDeleteSubService = async (subServiceId: string, serviceId: string) => {
    if (!confirm("Are you sure you want to delete this sub-service?")) {
      return
    }

    try {
      const response = await fetch(`/api/admin/sub-services/${subServiceId}`, { method: "DELETE" })
      if (response.ok) {
        setSubServices((prev) => ({
          ...prev,
          [serviceId]: prev[serviceId]?.filter((ss) => ss._id !== subServiceId) || [],
        }))
        showToast("Sub-service deleted successfully", "success")
      }
    } catch (error) {
      showToast("Failed to delete sub-service", "error")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Service Management</h2>
          <p className="text-gray-600 mt-1">Manage your services and sub-services</p>
        </div>
        <button
          onClick={() => setShowAddService(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add New Service
        </button>
      </div>

      {/* Services List */}
      <div className="grid gap-6">
        {services.map((service) => (
          <div key={service._id} className="bg-white rounded-lg shadow border p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      service.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {service.isActive ? "Active" : "Inactive"}
                  </span>
                  <span className="text-sm text-gray-500">{service.category}</span>
                </div>
                <p className="text-gray-600 mb-2">{service.description}</p>
                {service.basePrice && (
                  <p className="text-sm text-gray-500">
                    Base Price: ${service.basePrice} ({service.priceType})
                  </p>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingService(service)}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => setShowAddSubService(service._id)}
                  className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                >
                  Add Sub-Service
                </button>
                <button
                  onClick={() => handleDeleteService(service._id)}
                  className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Sub-Services */}
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Sub-Services</h4>
              {subServices[service._id]?.length > 0 ? (
                <div className="grid gap-3">
                  {subServices[service._id].map((subService) => (
                    <div
                      key={subService._id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded border"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h5 className="font-medium text-sm text-gray-900">{subService.name}</h5>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            ${subService.price} ({subService.priceType})
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              subService.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {subService.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{subService.description}</p>
                        {subService.features.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {subService.features.map((feature, idx) => (
                              <span
                                key={idx}
                                className="text-xs bg-purple-100 text-purple-800 px-1 py-0.5 rounded"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingSubService(subService)}
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteSubService(subService._id, service._id)}
                          className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No sub-services added yet.</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Service Modal */}
      {showAddService && (
        <ServiceModal
          service={null}
          onClose={() => setShowAddService(false)}
          onSave={(service) => {
            setServices([service, ...services])
            setShowAddService(false)
            showToast("Service created successfully", "success")
          }}
        />
      )}

      {editingService && (
        <ServiceModal
          service={editingService}
          onClose={() => setEditingService(null)}
          onSave={(updatedService) => {
            setServices(services.map((s) => (s._id === updatedService._id ? updatedService : s)))
            setEditingService(null)
            showToast("Service updated successfully", "success")
          }}
        />
      )}

      {/* Sub-Service Modal */}
      {showAddSubService && (
        <SubServiceModal
          subService={null}
          serviceId={showAddSubService}
          onClose={() => setShowAddSubService(null)}
          onSave={(subService) => {
            setSubServices((prev) => ({
              ...prev,
              [showAddSubService]: [...(prev[showAddSubService] || []), subService],
            }))
            setShowAddSubService(null)
            showToast("Sub-service created successfully", "success")
          }}
        />
      )}

      {editingSubService && (
        <SubServiceModal
          subService={editingSubService}
          serviceId={editingSubService.serviceId}
          onClose={() => setEditingSubService(null)}
          onSave={(updatedSubService) => {
            setSubServices((prev) => ({
              ...prev,
              [updatedSubService.serviceId]: prev[updatedSubService.serviceId]?.map((ss) =>
                ss._id === updatedSubService._id ? updatedSubService : ss
              ) || [],
            }))
            setEditingSubService(null)
            showToast("Sub-service updated successfully", "success")
          }}
        />
      )}
    </div>
  )
}

// Service Modal Component
function ServiceModal({
  service,
  onClose,
  onSave,
}: {
  service: Service | null
  onClose: () => void
  onSave: (service: Service) => void
}) {
  const [formData, setFormData] = useState({
    name: service?.name || "",
    description: service?.description || "",
    basePrice: service?.basePrice || "",
    priceType: service?.priceType || "custom",
    category: service?.category || "",
    isActive: service?.isActive ?? true,
  })
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = service ? `/api/admin/services/${service._id}` : "/api/admin/services"
      const method = service ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          basePrice: formData.basePrice ? Number(formData.basePrice) : undefined,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        onSave(data.service)
      } else {
        showToast(data.error || "Failed to save service", "error")
      }
    } catch (error) {
      showToast("An unexpected error occurred", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">
          {service ? "Edit Service" : "Add New Service"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Base Price</label>
              <input
                type="number"
                value={formData.basePrice}
                onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Type</label>
              <select
                value={formData.priceType}
                onChange={(e) => setFormData({ ...formData, priceType: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="fixed">Fixed</option>
                <option value="hourly">Hourly</option>
                <option value="per_item">Per Item</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="isActive" className="text-sm text-gray-700">
              Active
            </label>
          </div>
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Sub-Service Modal Component
function SubServiceModal({
  subService,
  serviceId,
  onClose,
  onSave,
}: {
  subService: SubService | null
  serviceId: string
  onClose: () => void
  onSave: (subService: SubService) => void
}) {
  const [formData, setFormData] = useState({
    name: subService?.name || "",
    description: subService?.description || "",
    price: subService?.price || "",
    priceType: subService?.priceType || "fixed",
    estimatedDuration: subService?.estimatedDuration || "",
    features: subService?.features.join(", ") || "",
    isActive: subService?.isActive ?? true,
  })
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = subService
        ? `/api/admin/sub-services/${subService._id}`
        : `/api/admin/services/${serviceId}/sub-services`
      const method = subService ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          features: formData.features
            .split(",")
            .map((f) => f.trim())
            .filter((f) => f),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        onSave(data.subService)
      } else {
        showToast(data.error || "Failed to save sub-service", "error")
      }
    } catch (error) {
      showToast("An unexpected error occurred", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">
          {subService ? "Edit Sub-Service" : "Add New Sub-Service"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Type *</label>
              <select
                value={formData.priceType}
                onChange={(e) => setFormData({ ...formData, priceType: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="fixed">Fixed</option>
                <option value="hourly">Hourly</option>
                <option value="per_item">Per Item</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
            <input
              type="text"
              value={formData.estimatedDuration}
              onChange={(e) => setFormData({ ...formData, estimatedDuration: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 2-4 hours"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Features</label>
            <input
              type="text"
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Feature 1, Feature 2, Feature 3"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="isActive" className="text-sm text-gray-700">
              Active
            </label>
          </div>
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 