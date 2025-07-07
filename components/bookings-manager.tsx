"use client"

import { useState, useEffect } from "react"
import { BookingsList } from "./bookings-list"
import { BookingDetails } from "./booking-details"
import { BookingFilters, type BookingFilters as BookingFiltersType } from "./booking-filters"
import { useToast } from "./toast"

export interface Booking {
  _id: string
  bookingId: string
  fullName: string
  emailAddress: string
  phoneNumber: string
  serviceId: string
  serviceName: string
  subServiceId?: string
  subServiceName?: string
  subServicePrice?: number
  details: string
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled"
  submittedAt: string
  createdAt: string
  updatedAt: string
}

export function BookingsManager() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<BookingFiltersType>({
    status: "all",
    search: "",
    dateFrom: "",
    dateTo: "",
  })
  const { showToast } = useToast()

  // Fetch all bookings
  const fetchBookings = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("Fetching bookings...")

      const response = await fetch("/api/bookings")

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      console.log("API Response:", data)

      if (data.success) {
        console.log(`Successfully fetched ${data.bookings.length} bookings`)
        setBookings(data.bookings)
        setFilteredBookings(data.bookings)
      } else {
        const errorMessage = data.error || "Failed to fetch bookings"
        console.error("API Error:", errorMessage)
        setError(errorMessage)
        showToast(errorMessage, "error")
      }
    } catch (error) {
      console.error("Network Error fetching bookings:", error)
      const errorMessage = error instanceof Error ? error.message : "Network error - please check your connection"
      setError(errorMessage)
      showToast(errorMessage, "error")
    } finally {
      setLoading(false)
    }
  }

  // Apply filters
  useEffect(() => {
    console.log("Applying filters:", filters)
    console.log("Total bookings before filtering:", bookings.length)

    let filtered = [...bookings]

    // Status filter
    if (filters.status !== "all") {
      filtered = filtered.filter((booking) => booking.status === filters.status)
      console.log(`After status filter (${filters.status}):`, filtered.length)
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(
        (booking) =>
          booking.fullName.toLowerCase().includes(searchLower) ||
          booking.emailAddress.toLowerCase().includes(searchLower) ||
          booking.bookingId.toLowerCase().includes(searchLower) ||
          booking.serviceName.toLowerCase().includes(searchLower),
      )
      console.log(`After search filter (${filters.search}):`, filtered.length)
    }

    // Date filters
    if (filters.dateFrom) {
      filtered = filtered.filter((booking) => new Date(booking.submittedAt) >= new Date(filters.dateFrom))
      console.log(`After dateFrom filter (${filters.dateFrom}):`, filtered.length)
    }
    if (filters.dateTo) {
      filtered = filtered.filter((booking) => new Date(booking.submittedAt) <= new Date(filters.dateTo + "T23:59:59"))
      console.log(`After dateTo filter (${filters.dateTo}):`, filtered.length)
    }

    console.log("Final filtered bookings:", filtered.length)
    setFilteredBookings(filtered)
  }, [bookings, filters])

  // Update booking status
  const updateBookingStatus = async (bookingId: string, status: string, notes?: string) => {
    try {
      console.log("Attempting to update booking status:", bookingId, status)
      
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, notes }),
      })

      console.log("Update response status:", response.status)

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        const errorText = await response.text()
        console.error("Update response error:", errorText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Check if response has content before parsing JSON
      const responseText = await response.text()
      console.log("Update response text:", responseText)

      if (!responseText) {
        throw new Error("Empty response from server")
      }

      const data = JSON.parse(responseText)
      console.log("Update response data:", data)

      if (data.success) {
        showToast(`Booking status updated to ${status}`, "success")
        fetchBookings() // Refresh the list

        // Update selected booking if it's the one being updated
        if (selectedBooking?.bookingId === bookingId) {
          const updatedBooking = bookings.find((b) => b.bookingId === bookingId)
          if (updatedBooking) {
            setSelectedBooking({ ...updatedBooking, status: status as any })
          }
        }
      } else {
        showToast(data.error || "Failed to update booking", "error")
      }
    } catch (error) {
      console.error("Error updating booking:", error)
      showToast(error instanceof Error ? error.message : "Error updating booking", "error")
    }
  }

  // Delete booking
  const deleteBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to delete this booking? This action cannot be undone.")) {
      return
    }

    try {
      console.log("Attempting to delete booking:", bookingId)
      
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "DELETE",
      })

      console.log("Delete response status:", response.status)
      console.log("Delete response headers:", response.headers)

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        const errorText = await response.text()
        console.error("Delete response error:", errorText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Check if response has content before parsing JSON
      const responseText = await response.text()
      console.log("Delete response text:", responseText)

      if (!responseText) {
        throw new Error("Empty response from server")
      }

      const data = JSON.parse(responseText)
      console.log("Delete response data:", data)

      if (data.success) {
        showToast("Booking deleted successfully", "success")
        fetchBookings() // Refresh the list

        // Clear selected booking if it was deleted
        if (selectedBooking?.bookingId === bookingId) {
          setSelectedBooking(null)
        }
      } else {
        showToast(data.error || "Failed to delete booking", "error")
      }
    } catch (error) {
      console.error("Error deleting booking:", error)
      showToast(error instanceof Error ? error.message : "Error deleting booking", "error")
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading bookings...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-lg font-medium">Error Loading Bookings</p>
          <p className="text-sm">{error}</p>
        </div>
        <button
          onClick={fetchBookings}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Filters and Bookings List */}
        <div className="lg:col-span-2 space-y-6">
          <BookingFilters filters={filters} onFiltersChange={setFilters} />
          <BookingsList
            bookings={filteredBookings}
            selectedBooking={selectedBooking}
            onSelectBooking={setSelectedBooking}
            onUpdateStatus={updateBookingStatus}
            onDeleteBooking={deleteBooking}
          />
        </div>

        {/* Booking Details */}
        <div className="lg:col-span-1">
          <BookingDetails
            booking={selectedBooking}
            onUpdateStatus={updateBookingStatus}
            onDeleteBooking={deleteBooking}
          />
        </div>
      </div>
    </div>
  )
}
