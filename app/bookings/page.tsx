"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Filter, Copy, Printer, FileSpreadsheet, Eye, Trash, Edit } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import { Pagination } from "@/components/pagination"

export default function BookingsPage() {
  const router = useRouter()
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [confirmStatus, setConfirmStatus] = useState("All")
  const [paymentStatus, setPaymentStatus] = useState("All")

  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const totalPages = Math.ceil(bookingsData.length / itemsPerPage)

  // Get current page data
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return bookingsData.slice(startIndex, endIndex)
  }

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  // Handle view booking details
  const handleViewBooking = (bookingId) => {
    router.push(`/bookings/${bookingId}`)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - hidden on mobile */}
      <Sidebar className="hidden md:flex" activeItem="Bookings" />

      {/* Main Content */}
      <div className="flex-1">
        <PageHeader />

        <main className="p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Bookings List / Report</h1>
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-2 text-sm text-gold">
                <div className="w-4 h-4 rounded-full bg-gold" />
                <p>Note: Only Success payment status is considered as payment done.</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gold">
                <div className="w-4 h-4 rounded-full bg-gold" />
                <p>Note: Latest Booking come first.</p>
              </div>
            </div>
          </div>

          <Card className="bg-white shadow-sm border-gray-200 mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date from</label>
                  <div className="relative">
                    <Input
                      type="date"
                      placeholder="mm/dd/yyyy"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="w-full"
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date to</label>
                  <div className="relative">
                    <Input
                      type="date"
                      placeholder="mm/dd/yyyy"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="w-full"
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Status</label>
                  <Select value={confirmStatus} onValueChange={setConfirmStatus}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Accepted">Accepted</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                  <div className="flex gap-2">
                    <Select value={paymentStatus} onValueChange={setPaymentStatus} className="flex-1">
                      <SelectTrigger>
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="Paid">Paid</SelectItem>
                        <SelectItem value="Not paid">Not paid</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button className="bg-gold hover:bg-gold-dark">
                      <Filter className="h-4 w-4 mr-2" />
                      FILTER
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-gray-200 overflow-hidden">
            <div className="p-4 flex flex-wrap gap-2 border-b border-gray-200">
              <Button variant="outline" size="sm" className="text-gray-700">
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button variant="outline" size="sm" className="text-gray-700">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" size="sm" className="text-gray-700">
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Excel
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Confirmation
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Booking Date
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Status
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {getCurrentPageData().map((booking, index) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-gray-500"
                            onClick={() => handleViewBooking(booking.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-500">
                            <Printer className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <ConfirmationBadge status={booking.status} />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gold">{booking.id}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{booking.name}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{booking.email}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{booking.contact}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{booking.date}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <PaymentBadge status={booking.paymentStatus} />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add pagination component */}
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </Card>
        </main>
      </div>
    </div>
  )
}

function ConfirmationBadge({ status }) {
  let bgColor = "bg-yellow-100 text-yellow-800"
  if (status === "Accepted") bgColor = "bg-green-100 text-green-800"
  if (status === "Rejected") bgColor = "bg-red-100 text-red-800"

  return <Badge className={`${bgColor} font-medium`}>{status}</Badge>
}

function PaymentBadge({ status }) {
  const isPaid = status === "Paid"
  const bgColor = isPaid ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"

  return <Badge className={`${bgColor} font-medium`}>{status}</Badge>
}

const bookingsData = [
  {
    id: "TRB0081",
    status: "Pending",
    name: "asdf",
    email: "asdf@asdf.dfg",
    contact: "2342342343",
    date: "22-04-2025",
    paymentStatus: "Not paid",
  },
  {
    id: "TRB0080",
    status: "Accepted",
    name: "murari",
    email: "mbmb1964@gmail.com",
    contact: "7549275863",
    date: "19-04-2025",
    paymentStatus: "Paid",
  },
  {
    id: "TRB0079",
    status: "Accepted",
    name: "Ankush",
    email: "ankush2001garg@gmail.com",
    contact: "95926 44716",
    date: "17-04-2025",
    paymentStatus: "Paid",
  },
  {
    id: "TRB0078",
    status: "Pending",
    name: "test",
    email: "pk1093524@gmail.com",
    contact: "9564854785",
    date: "03-04-2025",
    paymentStatus: "Not paid",
  },
  {
    id: "TRB0077",
    status: "Pending",
    name: "test",
    email: "test@gmail.com",
    contact: "0123456789",
    date: "02-04-2025",
    paymentStatus: "Not paid",
  },
  {
    id: "TRB0076",
    status: "Accepted",
    name: "Arpit",
    email: "arpit.jiva@gmail.com",
    contact: "9549103548",
    date: "29-03-2025",
    paymentStatus: "Paid",
  },
  {
    id: "TRB0075",
    status: "Accepted",
    name: "Arpit",
    email: "arpit.jiva@gmail.com",
    contact: "9549103548",
    date: "27-03-2025",
    paymentStatus: "Paid",
  },
  {
    id: "TRB0074",
    status: "Rejected",
    name: "test",
    email: "test@gmail.com",
    contact: "0123456789",
    date: "17-03-2025",
    paymentStatus: "Not paid",
  },
  {
    id: "TRB0073",
    status: "Accepted",
    name: "RITAV",
    email: "ronnieculer29@gmail.com",
    contact: "8902753322",
    date: "08-02-2025",
    paymentStatus: "Paid",
  },
  {
    id: "TRB0072",
    status: "Pending",
    name: "John Doe",
    email: "john.doe@example.com",
    contact: "1234567890",
    date: "05-02-2025",
    paymentStatus: "Not paid",
  },
  {
    id: "TRB0071",
    status: "Accepted",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    contact: "9876543210",
    date: "01-02-2025",
    paymentStatus: "Paid",
  },
  {
    id: "TRB0070",
    status: "Rejected",
    name: "Robert Johnson",
    email: "robert.j@example.com",
    contact: "5551234567",
    date: "28-01-2025",
    paymentStatus: "Not paid",
  },
]
