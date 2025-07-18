"use client"

import type React from "react"
import { useState, useEffect } from "react"

interface SubService {
  _id?: string
  title: string
}

interface Service {
  _id: string
  title: string
  subServices: SubService[]
  createdAt: string
  updatedAt: string
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Create form state
  const [newTitle, setNewTitle] = useState("")
  const [newSubServices, setNewSubServices] = useState([{ title: "" }])
  const [creating, setCreating] = useState(false)

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editSubServices, setEditSubServices] = useState<SubService[]>([])

  // Fetch services
  const fetchServices = async () => {
    try {
      const res = await fetch("/api/admin/services")
      if (!res.ok) throw new Error("Failed to fetch services")
      const data = await res.json()
      setServices(data)
    } catch (err) {
      setError("Failed to load services")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  // Create service
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!newTitle.trim() || newSubServices.some((s) => !s.title.trim())) {
      setError("Please provide service title and all subservice titles")
      return
    }

    setCreating(true)
    try {
      const res = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle.trim(),
          subServices: newSubServices.map((s) => s.title.trim()),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 409) {
          setError(`Service "${newTitle}" already exists. Please choose a different name.`)
        } else {
          setError(data.message || "Failed to create service")
        }
        return
      }

      setSuccess("Service created successfully!")
      setNewTitle("")
      setNewSubServices([{ title: "" }])
      fetchServices()
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setCreating(false)
    }
  }

  // Delete service
  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return

    try {
      const res = await fetch(`/api/admin/services/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Failed to delete")

      setSuccess("Service deleted successfully!")
      fetchServices()
    } catch (err) {
      setError("Failed to delete service")
    }
  }

  // Start editing
  const startEdit = (service: Service) => {
    setEditingId(service._id)
    setEditTitle(service.title)
    setEditSubServices([...service.subServices])
  }

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null)
    setEditTitle("")
    setEditSubServices([])
  }

  // Save edit
  const saveEdit = async () => {
    if (!editTitle.trim() || editSubServices.some((s) => !s.title.trim())) {
      setError("Please provide service title and all subservice titles")
      return
    }

    try {
      const res = await fetch(`/api/admin/services/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle.trim(),
          subServices: editSubServices,
        }),
      })

      if (!res.ok) throw new Error("Failed to update")

      setSuccess("Service updated successfully!")
      setEditingId(null)
      fetchServices()
    } catch (err) {
      setError("Failed to update service")
    }
  }

  // Add subservice to new form
  const addNewSubService = () => {
    setNewSubServices([...newSubServices, { title: "" }])
  }

  // Remove subservice from new form
  const removeNewSubService = (index: number) => {
    if (newSubServices.length > 1) {
      setNewSubServices(newSubServices.filter((_, i) => i !== index))
    }
  }

  // Add subservice to edit form
  const addEditSubService = () => {
    setEditSubServices([...editSubServices, { title: "" }])
  }

  // Remove subservice from edit form
  const removeEditSubService = (index: number) => {
    if (editSubServices.length > 1) {
      setEditSubServices(editSubServices.filter((_, i) => i !== index))
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center text-gray-600">Loading services...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Manage Services</h1>
        <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
          {services.length} Services
        </span>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">{error}</div>}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">{success}</div>
      )}

      {/* Create New Service Form */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create New Service</h2>
          <p className="text-sm text-gray-600 mt-1">Add a new service with subservices</p>
        </div>
        <div className="p-6">
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Service Title
              </label>
              <input
                id="title"
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g., Cleaning, Removal, Repair"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subservices</label>
              {newSubServices.map((sub, index) => (
                <div key={index} className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={sub.title}
                    onChange={(e) => {
                      const updated = [...newSubServices]
                      updated[index].title = e.target.value
                      setNewSubServices(updated)
                    }}
                    placeholder={`Subservice ${index + 1}`}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  {newSubServices.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeNewSubService(index)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addNewSubService}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800 focus:outline-none"
              >
                + Add Subservice
              </button>
            </div>

            <button
              type="submit"
              disabled={creating}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creating ? "Creating..." : "Create Service"}
            </button>
          </form>
        </div>
      </div>

      {/* Existing Services */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Existing Services</h2>

        {services.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="text-center py-8">
              <p className="text-gray-500">No services found. Create your first service above.</p>
            </div>
          </div>
        ) : (
          services.map((service) => (
            <div key={service._id} className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    {editingId === service._id ? (
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="text-lg font-semibold w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <h3 className="text-lg font-semibold text-gray-900">{service.title}</h3>
                    )}
                    <p className="text-sm text-gray-600 mt-1">
                      Created: {new Date(service.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex gap-2 ml-4">
                    {editingId === service._id ? (
                      <>
                        <button
                          onClick={saveEdit}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-3 py-1 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(service)}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(service._id, service.title)}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subservices:</label>
                  {editingId === service._id ? (
                    <div className="space-y-2">
                      {editSubServices.map((sub, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={sub.title}
                            onChange={(e) => {
                              const updated = [...editSubServices]
                              updated[index].title = e.target.value
                              setEditSubServices(updated)
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          {editSubServices.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeEditSubService(index)}
                              className="px-3 py-2 border border-gray-300 rounded-md text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addEditSubService}
                        className="text-sm text-blue-600 hover:text-blue-800 focus:outline-none"
                      >
                        + Add Subservice
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {service.subServices.map((sub) => (
                        <span key={sub._id} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                          {sub.title}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}