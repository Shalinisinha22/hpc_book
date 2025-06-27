"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { Pagination } from "@/components/pagination"
import { Input } from "@/components/ui/input"
import { API_ROUTES } from "@/config/api"

export default function CancelBookingsPage() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

    const [bookings, setBookings] = useState<CancelledBooking[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
  
    useEffect(() => {
      const fetchCancelledBookings = async () => {
           const token = localStorage.getItem("auth-token")
      if (!token) {
        throw new Error("Not authenticated")
      }
        try {
          const response = await fetch(API_ROUTES.bookings.cancelled, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          const result = await response.json()
  
          console.log('Cancelled bookings response:', result)
          
          if (result.status === 'success') {
            setBookings(result.data)
          }
        } catch (error) {
          console.error('Failed to fetch cancelled bookings:', error)
        } finally {
          setIsLoading(false)
        }
      }
  
      fetchCancelledBookings()
    }, [])
  
    if (isLoading) {
      return <div>Loading cancelled bookings...</div>
    }

  // After the pagination state, add search state


  // Update the getCurrentPageData function to include filtering by search
  const getCurrentPageData = () => {
    const filtered = bookings.filter((booking) => {
      if (!searchQuery) return true

      // Search in relevant fields
      return (
        booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.holderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.accountNo.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })

    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filtered.slice(startIndex, endIndex)
  }

  // Update the totalPages calculation
  const totalPages = Math.ceil(getCurrentPageData().length / itemsPerPage)

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - hidden on mobile */}
      <Sidebar className="hidden md:flex" activeItem="Cancel Bookings" />

      {/* Main Content */}
      <div className="flex-1">
        <PageHeader />

        {/* After the PageHeader, add a search input */}
        <div className="mb-4">
          <Input
            type="search"
            placeholder="Search bookings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
        </div>

        <main className="p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Cancel Bookings</h1>
          </div>

          <Card className="bg-white shadow-sm border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Before Cancel
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Charge</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Refund Amount
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Holder Name
                    </th>
                    
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">IFSC Code</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Account No</th>
                     <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">payment Status</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {getCurrentPageData().map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-orange-600">{booking.bookingId}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{booking.email}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">₹{booking.totalPrice}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">₹{booking.charge}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">₹{booking.refundAmount}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{booking.paymentStatus}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <CancellationStatusBadge status={booking.status} />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{booking.createdAt}</td>
                    </tr>
                  ))}

                  {getCurrentPageData().length === 0 && (
                    <tr>
                      <td colSpan={10} className="px-4 py-8 text-center text-gray-500">
                        No cancelled bookings found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Add pagination component */}
            {bookings.length > 0 && (
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            )}
          </Card>
        </main>
      </div>
    </div>
  )
}

function CancellationStatusBadge({ status }) {
  let bgColor = "bg-yellow-100 text-yellow-800"

  if (status === "Refunded") bgColor = "bg-green-100 text-green-800"
  if (status === "Cancelled") bgColor = "bg-red-100 text-red-800"
  if (status === "Processing") bgColor = "bg-blue-100 text-blue-800"

  return <Badge className={`${bgColor} font-medium`}>{status}</Badge>
}

