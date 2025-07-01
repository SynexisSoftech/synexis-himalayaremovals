"use client"

import { useState } from "react"
import {
  Calendar,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  DollarSign,
  CalendarDays,
  ChevronDown,
} from "lucide-react"

// Mock data for bookings
const bookings = [
  {
    id: "BK001",
    customerName: "John Smith",
    email: "john.smith@email.com",
    service: "Conference Room A",
    date: "2024-01-15",
    time: "09:00 - 11:00",
    duration: "2 hours",
    status: "confirmed",
    amount: 150,
    guests: 8,
    notes: "Team meeting with external clients",
  },
  {
    id: "BK002",
    customerName: "Sarah Johnson",
    email: "sarah.j@company.com",
    service: "Event Hall",
    date: "2024-01-18",
    time: "18:00 - 23:00",
    duration: "5 hours",
    status: "pending",
    amount: 800,
    guests: 50,
    notes: "Corporate dinner event",
  },
  {
    id: "BK003",
    customerName: "Mike Wilson",
    email: "mike.wilson@startup.io",
    service: "Meeting Room B",
    date: "2024-01-12",
    time: "14:00 - 16:00",
    duration: "2 hours",
    status: "cancelled",
    amount: 100,
    guests: 4,
    notes: "Product demo session",
  },
  {
    id: "BK004",
    customerName: "Emily Davis",
    email: "emily.davis@agency.com",
    service: "Workshop Space",
    date: "2024-01-20",
    time: "10:00 - 17:00",
    duration: "7 hours",
    status: "confirmed",
    amount: 450,
    guests: 25,
    notes: "Design thinking workshop",
  },
  {
    id: "BK005",
    customerName: "David Brown",
    email: "d.brown@consulting.com",
    service: "Conference Room C",
    date: "2024-01-16",
    time: "13:00 - 15:00",
    duration: "2 hours",
    status: "pending",
    amount: 120,
    guests: 6,
    notes: "Client presentation",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "confirmed":
      return "bg-green-100 text-green-800"
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "cancelled":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "confirmed":
      return <CheckCircle className="w-4 h-4" />
    case "pending":
      return <Clock className="w-4 h-4" />
    case "cancelled":
      return <XCircle className="w-4 h-4" />
    default:
      return <Clock className="w-4 h-4" />
  }
}

export default function BookingsAdmin() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedBooking, setSelectedBooking] = useState<(typeof bookings)[0] | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null)
  const [selectOpen, setSelectOpen] = useState(false)

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.service.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    totalBookings: bookings.length,
    confirmedBookings: bookings.filter((b) => b.status === "confirmed").length,
    pendingBookings: bookings.filter((b) => b.status === "pending").length,
    totalRevenue: bookings.filter((b) => b.status === "confirmed").reduce((sum, b) => sum + b.amount, 0),
  }

  const handleStatusChange = (bookingId: string, newStatus: string) => {
    console.log(`Changing booking ${bookingId} status to ${newStatus}`)
    setDropdownOpen(null)
  }

  const toggleDropdown = (bookingId: string) => {
    setDropdownOpen(dropdownOpen === bookingId ? null : bookingId)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Bookings Management</h1>
              <p className="text-gray-600">Manage and track all venue bookings</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors">
                <Calendar className="w-4 h-4" />
                New Booking
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
                <p className="text-xs text-gray-500 mt-1">+12% from last month</p>
              </div>
              <CalendarDays className="h-8 w-8 text-gray-400" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.confirmedBookings}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round((stats.confirmedBookings / stats.totalBookings) * 100)}% of total
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingBookings}</p>
                <p className="text-xs text-gray-500 mt-1">Awaiting confirmation</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue}</p>
                <p className="text-xs text-gray-500 mt-1">From confirmed bookings</p>
              </div>
              <DollarSign className="h-8 w-8 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Filters and Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">All Bookings</h2>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <button
                    onClick={() => setSelectOpen(!selectOpen)}
                    className="w-40 px-3 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center justify-between"
                  >
                    <span className="text-sm">
                      {statusFilter === "all"
                        ? "All Status"
                        : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                  {selectOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                      <div className="py-1">
                        {["all", "confirmed", "pending", "cancelled"].map((status) => (
                          <button
                            key={status}
                            onClick={() => {
                              setStatusFilter(status)
                              setSelectOpen(false)
                            }}
                            className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                          >
                            {status === "all" ? "All Status" : status.charAt(0).toUpperCase() + status.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <button className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  More Filters
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Guests
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{booking.customerName}</div>
                        <div className="text-sm text-gray-500">{booking.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.service}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{booking.date}</div>
                        <div className="text-sm text-gray-500">{booking.time}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium gap-1 ${getStatusColor(booking.status)}`}
                      >
                        {getStatusIcon(booking.status)}
                        <span className="capitalize">{booking.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${booking.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Users className="w-4 h-4 mr-1 text-gray-400" />
                        {booking.guests}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative">
                        <button
                          onClick={() => toggleDropdown(booking.id)}
                          className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                        {dropdownOpen === booking.id && (
                          <div className="absolute right-0 z-10 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200">
                            <div className="py-1">
                              <button
                                onClick={() => {
                                  setSelectedBooking(booking)
                                  setDropdownOpen(null)
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </button>
                              {booking.status === "pending" && (
                                <>
                                  <button
                                    onClick={() => handleStatusChange(booking.id, "confirmed")}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Confirm
                                  </button>
                                  <button
                                    onClick={() => handleStatusChange(booking.id, "cancelled")}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Cancel
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setSelectedBooking(null)}></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Booking Details - {selectedBooking.id}</h3>
              </div>

              <div className="bg-white px-6 py-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-900">Customer Information</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Name:</strong> {selectedBooking.customerName}
                      </div>
                      <div>
                        <strong>Email:</strong> {selectedBooking.email}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-900">Booking Status</h4>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium gap-1 ${getStatusColor(selectedBooking.status)}`}
                    >
                      {getStatusIcon(selectedBooking.status)}
                      <span className="capitalize">{selectedBooking.status}</span>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-900">Service Details</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Service:</strong> {selectedBooking.service}
                      </div>
                      <div>
                        <strong>Date:</strong> {selectedBooking.date}
                      </div>
                      <div>
                        <strong>Time:</strong> {selectedBooking.time}
                      </div>
                      <div>
                        <strong>Duration:</strong> {selectedBooking.duration}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-900">Additional Info</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Guests:</strong> {selectedBooking.guests}
                      </div>
                      <div>
                        <strong>Amount:</strong> ${selectedBooking.amount}
                      </div>
                    </div>
                  </div>
                </div>

                {selectedBooking.notes && (
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-900">Notes</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{selectedBooking.notes}</p>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 px-6 py-4 flex justify-end gap-2 border-t border-gray-200">
                {selectedBooking.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleStatusChange(selectedBooking.id, "cancelled")}
                      className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Cancel Booking
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedBooking.id, "confirmed")}
                      className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Confirm Booking
                    </button>
                  </>
                )}
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close dropdowns */}
      {(dropdownOpen || selectOpen) && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => {
            setDropdownOpen(null)
            setSelectOpen(false)
          }}
        />
      )}
    </div>
  )
}
