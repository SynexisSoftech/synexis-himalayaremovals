"use client"

import type { Booking } from "./bookings-manager"

interface BookingsListProps {
  bookings: Booking[]
  selectedBooking: Booking | null
  onSelectBooking: (booking: Booking) => void
  onUpdateStatus: (bookingId: string, status: string) => void
  onDeleteBooking: (bookingId: string) => void
}

export function BookingsList({
  bookings,
  selectedBooking,
  onSelectBooking,
  onUpdateStatus,
  onDeleteBooking,
}: BookingsListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "in_progress":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatStatus = (status: string) => {
    return status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  console.log("BookingsList received bookings:", bookings.length)

  return (
    <div className="bg-white rounded-lg shadow border">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold text-gray-900">Bookings List</h3>
        <p className="text-gray-600 mt-1">
          Click on a booking to view details ({bookings.length} booking{bookings.length !== 1 ? "s" : ""} found)
        </p>
      </div>

      <div className="divide-y divide-gray-200">
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <div
              key={booking._id}
              onClick={() => onSelectBooking(booking)}
              className={`p-6 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedBooking?._id === booking._id ? "bg-blue-50 border-l-4 border-blue-500" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-sm font-medium text-gray-900">{booking.bookingId}</h4>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(booking.status)}`}
                    >
                      {formatStatus(booking.status)}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600 mb-1">
                    <strong>{booking.fullName}</strong> • {booking.emailAddress}
                  </div>

                  <div className="text-sm text-gray-500 mb-2">
                    <span className="font-medium">{booking.serviceName}</span>
                    {booking.subServiceName && (
                      <>
                        <span className="mx-1">•</span>
                        <span>{booking.subServiceName}</span>
                      </>
                    )}
                    {booking.subServicePrice && booking.subServicePrice > 0 && (
                      <span className="text-green-600 font-semibold ml-2">${booking.subServicePrice}</span>
                    )}
                  </div>

                  <div className="text-xs text-gray-400">
                    <span className="inline-flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3a4 4 0 118 0v4m-4 8a2 2 0 100-4 2 2 0 000 4zm0 0v4a2 2 0 002 2h6a2 2 0 002-2v-4a2 2 0 00-2-2H10a2 2 0 00-2 2z"
                        />
                      </svg>
                      {new Date(booking.submittedAt).toLocaleDateString()} at{" "}
                      {new Date(booking.submittedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <select
                    value={booking.status}
                    onChange={(e) => {
                      e.stopPropagation()
                      onUpdateStatus(booking.bookingId, e.target.value)
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (confirm(`Are you sure you want to delete booking ${booking.bookingId}?`)) {
                        onDeleteBooking(booking.bookingId)
                      }
                    }}
                    className="text-red-600 hover:text-red-800 text-sm px-2 py-1 rounded hover:bg-red-50 transition-colors"
                    title="Delete booking"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-lg font-medium text-gray-500 mb-2">No bookings found</p>
            <p className="text-sm text-gray-400">
              {bookings.length === 0
                ? "No bookings match your current filter criteria"
                : "Try adjusting your filters to see more results"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
