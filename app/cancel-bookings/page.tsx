"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { Pagination } from "@/components/pagination"
import { Input } from "@/components/ui/input"

export default function CancelBookingsPage() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // After the pagination state, add search state
  const [searchQuery, setSearchQuery] = useState("")

  // Update the getCurrentPageData function to include filtering by search
  const getCurrentPageData = () => {
    const filtered = cancelledBookingsData.filter((booking) => {
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
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {getCurrentPageData().map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-orange-600">{booking.id}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{booking.email}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">₹{booking.beforeCancel}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">₹{booking.charge}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">₹{booking.refundAmount}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{booking.holderName}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{booking.ifscCode}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{booking.accountNo}</td>
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
            {cancelledBookingsData.length > 0 && (
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

const cancelledBookingsData = [
  {
    id: "TRB0074",
    email: "test@gmail.com",
    beforeCancel: "21,500.00",
    charge: "4,300.00",
    refundAmount: "17,200.00",
    holderName: "Rajesh Kumar",
    ifscCode: "HDFC0001234",
    accountNo: "XXXX1234",
    status: "Refunded",
    createdAt: "17-03-2025",
  },
  {
    id: "TRB0068",
    email: "mihir.patel@example.com",
    beforeCancel: "35,000.00",
    charge: "7,000.00",
    refundAmount: "28,000.00",
    holderName: "Mihir Patel",
    ifscCode: "ICIC0005678",
    accountNo: "XXXX5678",
    status: "Processing",
    createdAt: "22-01-2025",
  },
  {
    id: "TRB0065",
    email: "priya.sharma@example.com",
    beforeCancel: "48,500.00",
    charge: "9,700.00",
    refundAmount: "38,800.00",
    holderName: "Priya Sharma",
    ifscCode: "SBIN0009012",
    accountNo: "XXXX9012",
    status: "Cancelled",
    createdAt: "15-01-2025",
  },
  {
    id: "TRB0062",
    email: "rahul.verma@example.com",
    beforeCancel: "24,000.00",
    charge: "4,800.00",
    refundAmount: "19,200.00",
    holderName: "Rahul Verma",
    ifscCode: "AXIS0003456",
    accountNo: "XXXX3456",
    status: "Refunded",
    createdAt: "10-01-2025",
  },
  {
    id: "TRB0059",
    email: "anjali.gupta@example.com",
    beforeCancel: "39,000.00",
    charge: "7,800.00",
    refundAmount: "31,200.00",
    holderName: "Anjali Gupta",
    ifscCode: "HDFC0007890",
    accountNo: "XXXX7890",
    status: "Refunded",
    createdAt: "05-01-2025",
  },
  {
    id: "TRB0056",
    email: "deepak.mishra@example.com",
    beforeCancel: "28,500.00",
    charge: "5,700.00",
    refundAmount: "22,800.00",
    holderName: "Deepak Mishra",
    ifscCode: "ICIC0001357",
    accountNo: "XXXX1357",
    status: "Processing",
    createdAt: "28-12-2024",
  },
  {
    id: "TRB0053",
    email: "neha.singh@example.com",
    beforeCancel: "54,000.00",
    charge: "10,800.00",
    refundAmount: "43,200.00",
    holderName: "Neha Singh",
    ifscCode: "SBIN0002468",
    accountNo: "XXXX2468",
    status: "Cancelled",
    createdAt: "22-12-2024",
  },
  {
    id: "TRB0050",
    email: "arjun.patel@example.com",
    beforeCancel: "36,750.00",
    charge: "7,350.00",
    refundAmount: "29,400.00",
    holderName: "Arjun Patel",
    ifscCode: "AXIS0003579",
    accountNo: "XXXX3579",
    status: "Refunded",
    createdAt: "18-12-2024",
  },
  {
    id: "TRB0047",
    email: "pooja.desai@example.com",
    beforeCancel: "41,250.00",
    charge: "8,250.00",
    refundAmount: "33,000.00",
    holderName: "Pooja Desai",
    ifscCode: "HDFC0004680",
    accountNo: "XXXX4680",
    status: "Processing",
    createdAt: "15-12-2024",
  },
  {
    id: "TRB0044",
    email: "vikram.joshi@example.com",
    beforeCancel: "31,500.00",
    charge: "6,300.00",
    refundAmount: "25,200.00",
    holderName: "Vikram Joshi",
    ifscCode: "ICIC0005791",
    accountNo: "XXXX5791",
    status: "Refunded",
    createdAt: "10-12-2024",
  },
  {
    id: "TRB0041",
    email: "meera.shah@example.com",
    beforeCancel: "51,000.00",
    charge: "10,200.00",
    refundAmount: "40,800.00",
    holderName: "Meera Shah",
    ifscCode: "SBIN0006802",
    accountNo: "XXXX6802",
    status: "Cancelled",
    createdAt: "05-12-2024",
  },
  {
    id: "TRB0038",
    email: "karan.malhotra@example.com",
    beforeCancel: "26,250.00",
    charge: "5,250.00",
    refundAmount: "21,000.00",
    holderName: "Karan Malhotra",
    ifscCode: "AXIS0007913",
    accountNo: "XXXX7913",
    status: "Refunded",
    createdAt: "01-12-2024",
  },
]
