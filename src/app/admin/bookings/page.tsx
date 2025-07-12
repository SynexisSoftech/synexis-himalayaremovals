"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface Booking {
  _id: string
  fullName: string // Changed from user.name
  email: string // Changed from user.email
  service: { title: string } // Changed from service.name
  moveDate: string // Changed from date
  status: "pending" | "approved" | "rejected"
  createdAt: string
  // Optional fields from the provided JSON, not all are displayed but good to include for type accuracy
  phoneNumber?: string
  fromAddress?: string
  fromPostcode?: string
  toAddress?: string
  toPostcode?: string
  customDateDescription?: string | null
  preferredTime?: string
  others?: string | null
  subServices?: string[]
  updatedAt?: string
  __v?: number
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const fetchBookings = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/admin/booking")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setBookings(data)
    } catch (err: any) {
      setError(err.message || "Failed to fetch bookings")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const handleUpdateStatus = async (id: string, status: "approved" | "rejected") => {
    if (!confirm(`Are you sure you want to ${status} this booking?`)) {
      return
    }
    try {
      const response = await fetch(`/api/admin/booking/${id}`, {
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
      fetchBookings() // Re-fetch bookings to update the list
    } catch (err: any) {
      alert(`Error: ${err.message}`)
    }
  }

  const handleDeleteBooking = async (id: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) {
      return
    }
    try {
      const response = await fetch(`/api/admin/booking/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to delete booking: ${response.status}`)
      }
      alert("Booking deleted successfully!")
      fetchBookings() // Re-fetch bookings to update the list
    } catch (err: any) {
      alert(`Error: ${err.message}`)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-lg font-semibold text-gray-700">Loading bookings...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-red-600 text-lg font-semibold">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Bookings</h1>
        {bookings.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No bookings found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Booking ID
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    User
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Service
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Date
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Status
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50">
                    <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-900">
                      <button
                        onClick={() => router.push(`/admin/bookings/${booking._id}`)}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {booking._id.substring(0, 8)}...
                      </button>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.fullName || "N/A"} ({booking.email || "N/A"})
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.service?.title || "N/A"}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(booking.moveDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          booking.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : booking.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm font-medium">
                      {booking.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(booking._id, "approved")}
                            className="text-green-600 hover:text-green-900 mr-3"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(booking._id, "rejected")}
                            className="text-red-600 hover:text-red-900 mr-3"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDeleteBooking(booking._id)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
