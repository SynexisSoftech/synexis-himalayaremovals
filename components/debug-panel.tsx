"use client"

import { useState } from "react"

interface DebugPanelProps {
  bookings: any[]
  filteredBookings: any[]
  filters: any
  loading: boolean
  error: string | null
}

export function DebugPanel({ bookings, filteredBookings, filters, loading, error }: DebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-700"
      >
        Debug {isOpen ? "▼" : "▲"}
      </button>

      {isOpen && (
        <div className="absolute bottom-12 right-0 bg-white border rounded-lg shadow-lg p-4 w-80 max-h-96 overflow-auto">
          <h3 className="font-bold mb-2">Debug Information</h3>

          <div className="space-y-2 text-sm">
            <div>
              <strong>Loading:</strong> {loading ? "Yes" : "No"}
            </div>

            <div>
              <strong>Error:</strong> {error || "None"}
            </div>

            <div>
              <strong>Total Bookings:</strong> {bookings.length}
            </div>

            <div>
              <strong>Filtered Bookings:</strong> {filteredBookings.length}
            </div>

            <div>
              <strong>Current Filters:</strong>
              <pre className="bg-gray-100 p-2 rounded text-xs mt-1">{JSON.stringify(filters, null, 2)}</pre>
            </div>

            {bookings.length > 0 && (
              <div>
                <strong>Sample Booking:</strong>
                <pre className="bg-gray-100 p-2 rounded text-xs mt-1 max-h-32 overflow-auto">
                  {JSON.stringify(bookings[0], null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
