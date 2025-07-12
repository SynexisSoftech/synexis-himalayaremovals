"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface Booking {
  _id: string
  user: { name: string; email: string }
  service: { name: string; description: string; price: number }
  date: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
}

export default function AdminBookingDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const fetchBooking = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/admin/bookings/${id}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setBooking(data)
    } catch (err: any) {
      setError(err.message || "Failed to fetch booking details")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchBooking()
    }
  }, [id])

  const handleUpdateStatus = async (status: "approved" | "rejected") => {
    if (!confirm(`Are you sure you want to ${status} this booking?`)) {
      return
    }
    try {
      const response = await fetch(`/api/admin/bookings/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to update booking status: ${response.status}`)
      }
      alert(`Booking ${status} successfully!`)
      fetchBooking() // Re-fetch to update status on the page
    } catch (err: any) {
      alert(`Error: ${err.message}`)
    }
  }

  const handleDeleteBooking = async () => {
    if (!confirm("Are you sure you want to delete this booking? This action cannot be undone.")) {
      return
    }
    try {
      const response = await fetch(`/api/admin/bookings/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to delete booking: ${response.status}`)
      }
      alert("Booking deleted successfully!")
      router.push("/admin/bookings") // Redirect back to the list page
    } catch (err: any) {
      alert(`Error: ${err.message}`)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-lg font-semibold text-gray-700">Loading booking details...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-red-600 text-lg font-semibold">Error: {error}</div>
        <button
          onClick={() => router.back()}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-gray-700 text-lg font-semibold">Booking not found.</div>
        <button
          onClick={() => router.back()}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Booking Details</h1>
          <button
            onClick={() => router.push("/admin/bookings")}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Back to Bookings
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-3">Booking Information</h2>
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Booking ID:</span> {booking._id}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Status:</span>{" "}
              <span
                className={`px-2 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                  booking.status === "approved"
                    ? "bg-green-100 text-green-800"
                    : booking.status === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {booking.status}
              </span>
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Booking Date:</span> {new Date(booking.date).toLocaleDateString()}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Created At:</span> {new Date(booking.createdAt).toLocaleString()}
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-3">User Information</h2>
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Name:</span> {booking.user?.name || "N/A"}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Email:</span> {booking.user?.email || "N/A"}
            </p>
          </div>

          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">Service Details</h2>
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Service Name:</span> {booking.service?.name || "N/A"}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Description:</span> {booking.service?.description || "N/A"}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Price:</span> ${booking.service?.price?.toFixed(2) || "N/A"}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          {booking.status === "pending" && (
            <>
              <button
                onClick={() => handleUpdateStatus("approved")}
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
              >
                Approve Booking
              </button>
              <button
                onClick={() => handleUpdateStatus("rejected")}
                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
              >
                Reject Booking
              </button>
            </>
          )}
          <button
            onClick={handleDeleteBooking}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
          >
            Delete Booking
          </button>
        </div>
      </div>
    </div>
  )
}
