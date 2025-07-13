"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface Contact {
  _id: string
  fullname: string
  email: string
  message: string
  createdAt: string
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // This should be replaced with actual session logic (e.g., from NextAuth's useSession hook)
  // For demonstration, we'll assume 'authenticated' for now.
  const status = "authenticated" // Replace with your real session logic
  const userRole = "admin" // Replace with your real user role logic

  useEffect(() => {
    if (status === "unauthenticated" || userRole !== "admin") {
      router.push("/auth/signin") // Redirect if not authenticated or not admin
      return
    }

    const fetchContacts = async () => {
      try {
        const res = await fetch("/api/admin/contacts", { cache: "no-store" })
        const data = await res.json()
        if (!res.ok || !data.success) {
          throw new Error(data.message || data.error || "Failed to fetch contacts.")
        }
        setContacts(data.data)
      } catch (err: any) {
        console.error("Error fetching contacts:", err)
        setError(err.message || "An unexpected error occurred.")
        alert(err.message || "Failed to load contacts.")
      }
    }
    fetchContacts()
  }, [status, userRole, router])

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this contact message?")) {
      return
    }

    try {
      const res = await fetch(`/api/admin/contacts/${id}`, {
        method: "DELETE",
      })
      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.message || data.error || "Failed to delete contact.")
      }

      setContacts((prevContacts) => prevContacts.filter((contact) => contact._id !== id))
      alert("Contact message deleted successfully.")
    } catch (err: any) {
      console.error("Error deleting contact:", err)
      setError(err.message || "An unexpected error occurred during deletion.")
      alert(err.message || "Failed to delete contact.")
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold">Admin Contact Messages</h1>
        </div>
        <div className="p-6">
          {error ? (
            <div className="text-red-500 text-center py-6">
              <p>Error: {error}</p>
              <p>Please ensure your API route is correctly set up and accessible at `/api/admin/contacts`.</p>
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No contact messages found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Message
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      Received At
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Delete</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contacts.map((contact) => (
                    <tr key={contact._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {contact.fullname}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contact.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{contact.message}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(contact.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDelete(contact._id)}
                          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-red-500 text-white hover:bg-red-600 h-8 w-11"
                          aria-label="Delete contact"
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
    </div>
  )
}
