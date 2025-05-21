"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Copy,
  Printer,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Pencil,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function EventsBookingPage() {
  const { toast } = useToast()
  const [openDialog, setOpenDialog] = useState(false)
  const [currentBooking, setCurrentBooking] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalItems = 31

  // Sample booking data
  const [bookings, setBookings] = useState([
    {
      id: 1,
      requestDate: "2025-05-18",
      fullName: "kEMzpAX",
      mobile: "987-65-4329",
      email: "testing@example.com",
      eventName: "Valentine's Day Celebrations",
      price: 1499,
      quantity: 3,
      totalPrice: 4497,
      status: "PENDING PAYMENT",
      selected: false,
    },
    {
      id: 2,
      requestDate: "2025-05-18",
      fullName: "kEMzpAX",
      mobile: "987-65-4329",
      email: "testing@example.com",
      eventName: "Valentine's Day Celebrations",
      price: 1499,
      quantity: 2,
      totalPrice: 2998,
      status: "PENDING PAYMENT",
      selected: false,
    },
    {
      id: 3,
      requestDate: "2025-05-18",
      fullName: "kEMzpAX",
      mobile: "987-65-4329",
      email: "testing@example.com",
      eventName: "Valentine's Day Celebrations",
      price: 1499,
      quantity: 1,
      totalPrice: 1499,
      status: "REQUEST FOR CALL",
      selected: false,
    },
    {
      id: 4,
      requestDate: "2025-05-18",
      fullName: "kEMzpAX",
      mobile: "987-65-4329",
      email: "testing@example.com",
      eventName: "Valentine's Eternal Spa Week Awaits",
      price: 0,
      quantity: 1,
      totalPrice: 0,
      status: "REQUEST FOR CALL",
      selected: false,
    },
    {
      id: 5,
      requestDate: "2025-05-18",
      fullName: "kEMzpAX",
      mobile: "987-65-4329",
      email: "testing@example.com",
      eventName: "Valentine's Day Celebrations",
      price: 1499,
      quantity: 1,
      totalPrice: 1499,
      status: "PENDING PAYMENT",
      selected: false,
    },
    {
      id: 6,
      requestDate: "2025-05-18",
      fullName: "kEMzpAX",
      mobile: "987-65-4329",
      email: "testing@example.com",
      eventName: "Valentine's Day Celebrations",
      price: 1499,
      quantity: 1,
      totalPrice: 1499,
      status: "REQUEST FOR CALL",
      selected: false,
    },
    {
      id: 7,
      requestDate: "2025-05-18",
      fullName: "kEMzpAX",
      mobile: "987-65-4329",
      email: "testing@example.com",
      eventName: "Valentine's Day Celebrations",
      price: 1499,
      quantity: 1,
      totalPrice: 1499,
      status: "PENDING PAYMENT",
      selected: false,
    },
    {
      id: 8,
      requestDate: "2025-05-18",
      fullName: "kEMzpAX",
      mobile: "987-65-4329",
      email: "testing@example.com",
      eventName: "Valentine's Eternal Spa Week Awaits",
      price: 0,
      quantity: 1,
      totalPrice: 0,
      status: "REQUEST FOR CALL",
      selected: false,
    },
    {
      id: 9,
      requestDate: "2025-05-18",
      fullName: "kEMzpAX",
      mobile: "987-65-4329",
      email: "testing@example.com",
      eventName: "Valentine's Day Celebrations",
      price: 1499,
      quantity: 3,
      totalPrice: 4497,
      status: "PENDING PAYMENT",
      selected: false,
    },
    {
      id: 10,
      requestDate: "2025-05-18",
      fullName: "kEMzpAX",
      mobile: "987-65-4329",
      email: "testing@example.com",
      eventName: "Valentine's Day Celebrations",
      price: 1499,
      quantity: 2,
      totalPrice: 2998,
      status: "PENDING PAYMENT",
      selected: false,
    },
  ])

  const handleOpenDialog = (booking = null) => {
    setCurrentBooking(booking)
    setOpenDialog(true)
  }

  const handleSaveBooking = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)

    if (currentBooking) {
      // Update existing booking
      const updatedBookings = bookings.map((booking) =>
        booking.id === currentBooking.id
          ? {
              ...booking,
              status: formData.get("status"),
              // Update other fields as needed
            }
          : booking,
      )
      setBookings(updatedBookings)
      toast({
        title: "Booking Updated",
        description: `Booking #${currentBooking.id} has been updated successfully.`,
      })
    }

    setOpenDialog(false)
  }

  const handleSelectBooking = (id) => {
    const updatedBookings = bookings.map((booking) =>
      booking.id === id ? { ...booking, selected: !booking.selected } : booking,
    )
    setBookings(updatedBookings)
  }

  const handleDeleteBooking = (id) => {
    // Show confirmation dialog before deleting
    if (window.confirm("Are you sure you want to delete this booking?")) {
      const updatedBookings = bookings.filter((booking) => booking.id !== id)
      setBookings(updatedBookings)
      toast({
        title: "Booking Deleted",
        description: `Booking #${id} has been deleted successfully.`,
      })
    }
  }

  const handleSelectAllBookings = (e) => {
    const isChecked = e.target.checked
    const updatedBookings = bookings.map((booking) => ({ ...booking, selected: isChecked }))
    setBookings(updatedBookings)
  }

  const handleCopyData = () => {
    toast({
      title: "Data Copied",
      description: "Booking data has been copied to clipboard.",
    })
  }

  const handlePrintData = () => {
    toast({
      title: "Printing",
      description: "Sending booking data to printer.",
    })
    window.print()
  }

  const handleExportExcel = () => {
    toast({
      title: "Exporting to Excel",
      description: "Booking data is being exported to Excel.",
    })
  }

  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  // Render a card view for mobile screens
  const renderMobileView = () => {
    return (
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {bookings.map((booking) => (
          <div key={booking.id} className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <div className="font-medium">Request #{booking.id}</div>
              <div
                className={`text-xs font-semibold px-2 py-1 rounded ${
                  booking.status === "PENDING PAYMENT" ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"
                }`}
              >
                {booking.status}
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm text-gray-500">Date:</div>
                <div className="text-sm font-medium">{booking.requestDate}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm text-gray-500">Name:</div>
                <div className="text-sm font-medium">{booking.fullName}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm text-gray-500">Mobile:</div>
                <div className="text-sm font-medium">{booking.mobile}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm text-gray-500">Email:</div>
                <div className="text-sm font-medium">{booking.email}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm text-gray-500">Event:</div>
                <div className="text-sm font-medium">{booking.eventName}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm text-gray-500">Price:</div>
                <div className="text-sm font-medium">
                  {booking.price} x {booking.quantity} = {booking.totalPrice}
                </div>
              </div>
              <div className="flex justify-end mt-4 space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenDialog(booking)}
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteBooking(booking.id)}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-1"
                  >
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <PageHeader
        heading="Event Booking Requests"
        text="Here you can find the event booking requests and you can sort the data on the basis of all columns. You can also search the data based on any columns. By default latest request is shown first."
      />

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={handleCopyData}>
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrintData}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportExcel}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Excel
          </Button>
        </div>

        {/* Mobile view */}
        {renderMobileView()}

        {/* Desktop view */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-3 w-[5%]">#</th>
                <th className="px-4 py-3 w-[10%]">Request Date</th>
                <th className="px-4 py-3 w-[15%]">Full Name</th>
                <th className="px-4 py-3 w-[10%]">Mobile</th>
                <th className="px-4 py-3 w-[15%]">Email</th>
                <th className="px-4 py-3 w-[15%]">Event Name</th>
                <th className="px-4 py-3 w-[15%]">(₹ x TIC = Total Price)</th>
                <th className="px-4 py-3 w-[10%]">Status</th>
                <th className="px-4 py-3 w-[5%] text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <Checkbox id="select-all" onCheckedChange={handleSelectAllBookings} />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{booking.id}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{booking.requestDate}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{booking.fullName}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{booking.mobile}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{booking.email}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{booking.eventName}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {booking.price} x {booking.quantity} = {booking.totalPrice}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex text-xs font-semibold px-2 py-1 rounded ${
                        booking.status === "PENDING PAYMENT"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <Checkbox checked={booking.selected} onCheckedChange={() => handleSelectBooking(booking.id)} />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteBooking(booking.id)
                        }}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <span className="sr-only">Delete booking</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-trash-2"
                        >
                          <path d="M3 6h18"></path>
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{" "}
                <span className="font-medium">31</span> entries
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">First page</span>
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* Page numbers */}
                {[...Array(totalPages).keys()].map((page) => (
                  <Button
                    key={page + 1}
                    variant={currentPage === page + 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === page + 1
                        ? "bg-amber-500 text-white border-amber-500"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {page + 1}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Last page</span>
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </nav>
            </div>
          </div>

          {/* Mobile pagination */}
          <div className="flex items-center justify-between w-full sm:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* Edit Booking Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Update Booking Status</DialogTitle>
          </DialogHeader>
          {currentBooking && (
            <form onSubmit={handleSaveBooking} className="space-y-6 py-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="bookingId">Booking ID</Label>
                  <Input id="bookingId" value={currentBooking.id} readOnly className="mt-1 bg-gray-50" />
                </div>

                <div>
                  <Label htmlFor="eventName">Event</Label>
                  <Input id="eventName" value={currentBooking.eventName} readOnly className="mt-1 bg-gray-50" />
                </div>

                <div>
                  <Label htmlFor="customerName">Customer</Label>
                  <Input id="customerName" value={currentBooking.fullName} readOnly className="mt-1 bg-gray-50" />
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select name="status" defaultValue={currentBooking.status}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING PAYMENT">PENDING PAYMENT</SelectItem>
                      <SelectItem value="REQUEST FOR CALL">REQUEST FOR CALL</SelectItem>
                      <SelectItem value="CONFIRMED">CONFIRMED</SelectItem>
                      <SelectItem value="CANCELLED">CANCELLED</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Input id="notes" name="notes" placeholder="Add notes about this booking" className="mt-1" />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setOpenDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white">
                  Update
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
