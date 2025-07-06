"use client"

import type React from "react"

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

export function ServiceManagement() {
  const [services, setServices] = useState<Service[]>([])
  const [subServices, setSubServices] = useState<{ [key: string]: SubService[] }>({})
  const [loading, setLoading] = useState(true)
  const [showAddService, setShowAddService] = useState(false)
  const [showAddSubService, setShowAddSubService] = useState<string | null>(null)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [editingSubService, setEditingSubService] = useState<SubService | null>(null)
  const { toast } = useToast()

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
      toast({ title: "Error", description: "Failed to fetch services", variant: "destructive" })
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
        toast({ title: "Success", description: "Service deleted successfully" })
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete service", variant: "destructive" })
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
        toast({ title: "Success", description: "Sub-service deleted successfully" })
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete sub-service", variant: "destructive" })
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
      <div className="flex justify-between items-center">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-white rounded-lg shadow p-6 border">
            <p className="text-sm font-medium text-gray-600">Total Services</p>
            <p className="text-2xl font-bold text-gray-900">{services.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border">
            <p className="text-sm font-medium text-gray-600">Active Services</p>
            <p className="text-2xl font-bold text-green-600">{services.filter((s) => s.isActive).length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border">
            <p className="text-sm font-medium text-gray-600">Total Sub-Services</p>
            <p className="text-2xl font-bold text-gray-900">
              {Object.values(subServices).reduce((total, subs) => total + subs.length, 0)}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowAddService(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Add New Service
        </button>
      </div>

      <div className="space-y-4">
        {services.map((service) => (
          <div key={service._id} className="bg-white rounded-lg shadow border">
            <div className="p-6 border-b">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        service.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {service.isActive ? "Active" : "Inactive"}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {service.category}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-2">{service.description}</p>
                  {service.basePrice && (
                    <p className="text-sm text-gray-500 mt-1">
                      Base Price: ${service.basePrice} ({service.priceType})
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingService(service)}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
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
            </div>

            {subServices[service._id] && subServices[service._id].length > 0 && (
              <div className="p-6">
                <h4 className="font-medium text-gray-900 mb-4">Sub-Services</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  {subServices[service._id].map((subService) => (
                    <div key={subService._id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-medium text-gray-900">{subService.name}</h5>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => setEditingSubService(subService)}
                            className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteSubService(subService._id, service._id)}
                            className="px-2 py-1 text-xs bg-red-200 text-red-700 rounded hover:bg-red-300"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{subService.description}</p>
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium text-green-600">
                          ${subService.price} ({subService.priceType})
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            subService.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {subService.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                      {subService.estimatedDuration && (
                        <p className="text-xs text-gray-500 mt-1">Duration: {subService.estimatedDuration}</p>
                      )}
                      {subService.features.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500 mb-1">Features:</p>
                          <div className="flex flex-wrap gap-1">
                            {subService.features.map((feature, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {services.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No services found. Add your first service to get started.
          </div>
        )}
      </div>

      {/* Add/Edit Service Modal */}
      {(showAddService || editingService) && (
        <ServiceModal
          service={editingService}
          onClose={() => {
            setShowAddService(false)
            setEditingService(null)
          }}
          onSave={(service) => {
            if (editingService) {
              setServices(services.map((s) => (s._id === service._id ? service : s)))
            } else {
              setServices([service, ...services])
            }
            setShowAddService(false)
            setEditingService(null)
          }}
        />
      )}

      {/* Add/Edit Sub-Service Modal */}
      {(showAddSubService || editingSubService) && (
        <SubServiceModal
          subService={editingSubService}
          serviceId={showAddSubService || editingSubService?.serviceId || ""}
          onClose={() => {
            setShowAddSubService(null)
            setEditingSubService(null)
          }}
          onSave={(subService) => {
            const serviceId = subService.serviceId
            if (editingSubService) {
              setSubServices((prev) => ({
                ...prev,
                [serviceId]: prev[serviceId]?.map((ss) => (ss._id === subService._id ? subService : ss)) || [],
              }))
            } else {
              setSubServices((prev) => ({
                ...prev,
                [serviceId]: [subService, ...(prev[serviceId] || [])],
              }))
            }
            setShowAddSubService(null)
            setEditingSubService(null)
          }}
        />
      )}
    </div>
  )
}

// Enhanced Service Modal Component with Sub-Service Management
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

  // Sub-services state
  const [subServices, setSubServices] = useState<SubService[]>([])
  const [newSubService, setNewSubService] = useState({
    name: "",
    description: "",
    price: "",
    priceType: "fixed",
    estimatedDuration: "",
    features: "",
    isActive: true,
  })
  const [editingSubServiceIndex, setEditingSubServiceIndex] = useState<number | null>(null)
  const [showSubServiceForm, setShowSubServiceForm] = useState(false)

  const [loading, setLoading] = useState(false)
  const [loadingSubServices, setLoadingSubServices] = useState(false)
  const { toast } = useToast()

  // Load existing sub-services if editing a service
  useEffect(() => {
    if (service?._id) {
      fetchExistingSubServices(service._id)
    }
  }, [service])

  const fetchExistingSubServices = async (serviceId: string) => {
    try {
      setLoadingSubServices(true)
      const response = await fetch(`/api/admin/services/${serviceId}/sub-services`)
      if (response.ok) {
        const data = await response.json()
        setSubServices(data.subServices)
      }
    } catch (error) {
      console.error("Error fetching sub-services:", error)
    } finally {
      setLoadingSubServices(false)
    }
  }

  const handleAddSubService = () => {
    if (!newSubService.name || !newSubService.description || !newSubService.price) {
      toast({ title: "Error", description: "Please fill in all required sub-service fields", variant: "destructive" })
      return
    }

    const subServiceToAdd = {
      ...newSubService,
      _id: `temp-${Date.now()}`, // Temporary ID for new sub-services
      serviceId: service?._id || "new",
      price: Number(newSubService.price),
      features: newSubService.features
        .split(",")
        .map((f) => f.trim())
        .filter((f) => f),
    }

    if (editingSubServiceIndex !== null) {
      // Update existing sub-service
      const updatedSubServices = [...subServices]
      updatedSubServices[editingSubServiceIndex] = subServiceToAdd
      setSubServices(updatedSubServices)
      setEditingSubServiceIndex(null)
    } else {
      // Add new sub-service
      setSubServices([...subServices, subServiceToAdd])
    }

    // Reset form
    setNewSubService({
      name: "",
      description: "",
      price: "",
      priceType: "fixed",
      estimatedDuration: "",
      features: "",
      isActive: true,
    })
    setShowSubServiceForm(false)
  }

  const handleEditSubService = (index: number) => {
    const subService = subServices[index]
    setNewSubService({
      name: subService.name,
      description: subService.description,
      price: subService.price.toString(),
      priceType: subService.priceType,
      estimatedDuration: subService.estimatedDuration || "",
      features: subService.features.join(", "),
      isActive: subService.isActive,
    })
    setEditingSubServiceIndex(index)
    setShowSubServiceForm(true)
  }

  const handleDeleteSubService = (index: number) => {
    if (confirm("Are you sure you want to delete this sub-service?")) {
      const updatedSubServices = subServices.filter((_, i) => i !== index)
      setSubServices(updatedSubServices)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = service ? `/api/admin/services/${service._id}` : "/api/admin/services"
      const method = service ? "PUT" : "POST"

      // First, save the service
      const serviceResponse = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          basePrice: formData.basePrice ? Number(formData.basePrice) : undefined,
        }),
      })

      const serviceData = await serviceResponse.json()

      if (!serviceResponse.ok) {
        throw new Error(serviceData.error)
      }

      const savedService = serviceData.service

      // Then, handle sub-services
      if (subServices.length > 0) {
        await handleSubServicesUpdate(savedService._id)
      }

      toast({ title: "Success", description: `Service ${service ? "updated" : "created"} successfully` })
      onSave(savedService)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubServicesUpdate = async (serviceId: string) => {
    try {
      // Delete existing sub-services if editing
      if (service?._id) {
        const existingSubServices = await fetch(`/api/admin/services/${serviceId}/sub-services`)
        if (existingSubServices.ok) {
          const existingData = await existingSubServices.json()
          for (const existingSub of existingData.subServices) {
            if (!subServices.find((sub) => sub._id === existingSub._id)) {
              await fetch(`/api/admin/sub-services/${existingSub._id}`, { method: "DELETE" })
            }
          }
        }
      }

      // Create/update sub-services
      for (const subService of subServices) {
        const subServiceData = {
          name: subService.name,
          description: subService.description,
          price: subService.price,
          priceType: subService.priceType,
          estimatedDuration: subService.estimatedDuration,
          features: subService.features,
          isActive: subService.isActive,
        }

        if (subService._id.startsWith("temp-")) {
          // Create new sub-service
          await fetch(`/api/admin/services/${serviceId}/sub-services`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(subServiceData),
          })
        } else {
          // Update existing sub-service
          await fetch(`/api/admin/sub-services/${subService._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(subServiceData),
          })
        }
      }
    } catch (error) {
      console.error("Error handling sub-services:", error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">{service ? "Edit Service" : "Add New Service"}</h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Service Details */}
          <div className="border rounded-lg p-4">
            <h4 className="text-md font-semibold mb-4 text-gray-800">Service Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Moving, Cleaning, Removal"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Base Price (Optional)</label>
                <input
                  type="number"
                  value={formData.basePrice}
                  onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Type</label>
                <select
                  value={formData.priceType}
                  onChange={(e) => setFormData({ ...formData, priceType: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="custom">Custom</option>
                  <option value="fixed">Fixed</option>
                  <option value="hourly">Hourly</option>
                  <option value="per_item">Per Item</option>
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Active
                </label>
              </div>
            </div>
          </div>

          {/* Sub-Services Section */}
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-md font-semibold text-gray-800">Sub-Services</h4>
              <button
                type="button"
                onClick={() => setShowSubServiceForm(!showSubServiceForm)}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
              >
                {showSubServiceForm ? "Cancel" : "Add Sub-Service"}
              </button>
            </div>

            {/* Sub-Service Form */}
            {showSubServiceForm && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h5 className="text-sm font-semibold mb-3 text-gray-700">
                  {editingSubServiceIndex !== null ? "Edit Sub-Service" : "Add New Sub-Service"}
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Name *</label>
                    <input
                      type="text"
                      value={newSubService.name}
                      onChange={(e) => setNewSubService({ ...newSubService, name: e.target.value })}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Sub-service name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Price *</label>
                    <input
                      type="number"
                      value={newSubService.price}
                      onChange={(e) => setNewSubService({ ...newSubService, price: e.target.value })}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Price Type *</label>
                    <select
                      value={newSubService.priceType}
                      onChange={(e) => setNewSubService({ ...newSubService, priceType: e.target.value })}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="fixed">Fixed</option>
                      <option value="hourly">Hourly</option>
                      <option value="per_item">Per Item</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Duration</label>
                    <input
                      type="text"
                      value={newSubService.estimatedDuration}
                      onChange={(e) => setNewSubService({ ...newSubService, estimatedDuration: e.target.value })}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="e.g., 2-4 hours"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Description *</label>
                    <textarea
                      value={newSubService.description}
                      onChange={(e) => setNewSubService({ ...newSubService, description: e.target.value })}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      rows={2}
                      placeholder="Describe this sub-service"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Features (comma-separated)</label>
                    <input
                      type="text"
                      value={newSubService.features}
                      onChange={(e) => setNewSubService({ ...newSubService, features: e.target.value })}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Feature 1, Feature 2, Feature 3"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="subServiceActive"
                      checked={newSubService.isActive}
                      onChange={(e) => setNewSubService({ ...newSubService, isActive: e.target.checked })}
                      className="mr-2"
                    />
                    <label htmlFor="subServiceActive" className="text-xs font-medium text-gray-600">
                      Active
                    </label>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSubServiceForm(false)
                      setEditingSubServiceIndex(null)
                      setNewSubService({
                        name: "",
                        description: "",
                        price: "",
                        priceType: "fixed",
                        estimatedDuration: "",
                        features: "",
                        isActive: true,
                      })
                    }}
                    className="px-3 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddSubService}
                    className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    {editingSubServiceIndex !== null ? "Update" : "Add"}
                  </button>
                </div>
              </div>
            )}

            {/* Sub-Services List */}
            {loadingSubServices ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : (
              <div className="space-y-2">
                {subServices.map((subService, index) => (
                  <div key={subService._id} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h6 className="font-medium text-sm text-gray-900">{subService.name}</h6>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          ${subService.price} ({subService.priceType})
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            subService.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {subService.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{subService.description}</p>
                      {subService.features.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {subService.features.map((feature, idx) => (
                            <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded">
                              {feature}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-1">
                      <button
                        type="button"
                        onClick={() => handleEditSubService(index)}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSubService(index)}
                        className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {subServices.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No sub-services added yet. Click "Add Sub-Service" to get started.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : service ? "Update Service" : "Create Service"}
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
  const { toast } = useToast()

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
        toast({ title: "Success", description: `Sub-service ${subService ? "updated" : "created"} successfully` })
        onSave(data.subService)
      } else {
        toast({ title: "Error", description: data.error, variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error", description: "An unexpected error occurred", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">{subService ? "Edit Sub-Service" : "Add New Sub-Service"}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sub-Service Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Type</label>
              <select
                value={formData.priceType}
                onChange={(e) => setFormData({ ...formData, priceType: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="fixed">Fixed</option>
                <option value="hourly">Hourly</option>
                <option value="per_item">Per Item</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Duration (Optional)</label>
            <input
              type="text"
              value={formData.estimatedDuration}
              onChange={(e) => setFormData({ ...formData, estimatedDuration: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 2-4 hours, 1 day"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Features (comma-separated)</label>
            <input
              type="text"
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Packing materials included, Insurance covered"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="subServiceActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="subServiceActive" className="text-sm font-medium text-gray-700">
              Active
            </label>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : subService ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
