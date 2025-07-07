"use client"

import { useState } from "react"
import type { Booking } from "./bookings-manager"

interface BookingDetailsProps {
  booking: Booking | null
  onUpdateStatus: (bookingId: string, status: string, notes?: string) => void
  onDeleteBooking: (bookingId: string) => void
}

export function BookingDetails({ booking, onUpdateStatus, onDeleteBooking }: BookingDetailsProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [notes, setNotes] = useState("")

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

  const handleStatusUpdate = async (newStatus: string) => {
    if (!booking) return

    setIsUpdating(true)
    try {
      await onUpdateStatus(booking.bookingId, newStatus, notes)
      setNotes("") // Clear notes after successful update
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = () => {
    if (!booking) return

    if (confirm(`Are you sure you want to delete booking ${booking.bookingId}? This action cannot be undone.`)) {
      onDeleteBooking(booking.bookingId)
    }
  }

  if (!booking) {
    return (
      <div className="bg-white rounded-lg shadow border p-6">
        <div className="text-center text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-lg font-medium">No booking selected</p>
          <p className="text-sm">Select a booking from the list to view details</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow border">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Booking Details</h3>
          <span
            className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(booking.status)}`}
          >
            {formatStatus(booking.status)}
          </span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Booking Information */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            Booking Information
          </h4>
          <div className="grid grid-cols-1 gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Booking ID:</span>
              <span className="font-medium font-mono">{booking.bookingId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Submitted:</span>
              <span>{new Date(booking.submittedAt).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Service:</span>
              <span className="font-medium">{booking.serviceName}</span>
            </div>
            {booking.subServiceName && (
              <div className="flex justify-between">
                <span className="text-gray-500">Specific Service:</span>
                <span>{booking.subServiceName}</span>
              </div>
            )}
            {booking.subServicePrice && booking.subServicePrice > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-500">Price:</span>
                <span className="text-green-600 font-semibold">${booking.subServicePrice}</span>
              </div>
            )}
          </div>
        </div>

        {/* Customer Information */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Customer Information
          </h4>
          <div className="grid grid-cols-1 gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Name:</span>
              <span className="font-medium">{booking.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Email:</span>
              <a href={`mailto:${booking.emailAddress}`} className="text-blue-600 hover:text-blue-800">
                {booking.emailAddress}
              </a>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Phone:</span>
              <a href={`tel:${booking.phoneNumber}`} className="text-blue-600 hover:text-blue-800">
                {booking.phoneNumber}
              </a>
            </div>
          </div>
        </div>

        {/* Customer Details */}
        {booking.details && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Customer Requirements
            </h4>
            <div className="bg-gray-50 rounded-lg p-4 border">
              <p className="text-sm text-gray-900 whitespace-pre-wrap">{booking.details}</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="pt-4 border-t">
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Actions
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Update Status</label>
              <select
                value={booking.status}
                onChange={(e) => handleStatusUpdate(e.target.value)}
                disabled={isUpdating}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Add Notes (Optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about this status update..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => handleStatusUpdate(booking.status)}
                disabled={isUpdating || !notes.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isUpdating ? "Updating..." : "Update with Notes"}
              </button>

              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
