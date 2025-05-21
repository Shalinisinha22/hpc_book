"use client"

import { useState, useEffect } from "react"
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
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import * as XLSX from "xlsx"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export default function BookingsPage() {
  const router = useRouter()
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [confirmStatus, setConfirmStatus] = useState("All")
  const [paymentStatus, setPaymentStatus] = useState("All")
  const [bookingToDelete, setBookingToDelete] = useState(null)
  const [selectedRows, setSelectedRows] = useState({})
  const [selectAll, setSelectAll] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isPrinting, setIsPrinting] = useState(false)
  const [bookingToEdit, setBookingToEdit] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [bookingsData, setBookingsData] = useState([
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
  ])

  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  useEffect(() => {
    // Reset to first page when filters change
    setCurrentPage(1)
  }, [dateFrom, dateTo, confirmStatus, paymentStatus])

  // Get current page data
  const getCurrentPageData = () => {
    const filtered = bookingsData.filter((booking) => {
      // Filter by date range if both dates are provided
      if (dateFrom && dateTo) {
        const bookingDate = new Date(booking.date.split("-").reverse().join("-"))
        const fromDate = new Date(dateFrom)
        const toDate = new Date(dateTo)
        if (bookingDate < fromDate || bookingDate > toDate) return false
      }

      // Filter by confirmation status
      if (confirmStatus !== "All" && booking.status !== confirmStatus) return false

      // Filter by payment status
      if (paymentStatus !== "All" && booking.paymentStatus !== paymentStatus) return false

      return true
    })

    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filtered.slice(startIndex, endIndex)
  }

  // Get all filtered data (not just current page)
  const getAllFilteredData = () => {
    return bookingsData.filter((booking) => {
      // Filter by date range if both dates are provided
      if (dateFrom && dateTo) {
        const bookingDate = new Date(booking.date.split("-").reverse().join("-"))
        const fromDate = new Date(dateFrom)
        const toDate = new Date(dateTo)
        if (bookingDate < fromDate || bookingDate > toDate) return false
      }

      // Filter by confirmation status
      if (confirmStatus !== "All" && booking.status !== confirmStatus) return false

      // Filter by payment status
      if (paymentStatus !== "All" && booking.paymentStatus !== paymentStatus) return false

      return true
    })
  }

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  // Handle view booking details
  const handleViewBooking = (bookingId) => {
    router.push(`/bookings/${bookingId}`)
  }

  // Handle print booking
  const handlePrintBooking = (bookingId) => {
    router.push(`/bookings/${bookingId}?print=true`)
  }

  // Handle delete booking
  const handleDeleteBooking = (bookingId) => {
    // In a real app, you would call an API to delete the booking
    setBookingsData((prevData) => prevData.filter((booking) => booking.id !== bookingId))

    // For this demo, we're just logging the action
    console.log(`Booking ${bookingId} deleted`)

    // Show success message
    toast({
      title: "Booking deleted",
      description: `Booking ${bookingId} has been deleted successfully.`,
      variant: "default",
    })

    // Close the dialog
    setBookingToDelete(null)
  }

  // Handle row selection
  const toggleRowSelection = (bookingId) => {
    setSelectedRows((prev) => ({
      ...prev,
      [bookingId]: !prev[bookingId],
    }))
  }

  // Handle select all
  const toggleSelectAll = () => {
    const newSelectAll = !selectAll
    setSelectAll(newSelectAll)

    const newSelectedRows = {}
    getCurrentPageData().forEach((booking) => {
      newSelectedRows[booking.id] = newSelectAll
    })

    setSelectedRows(newSelectedRows)
  }

  // Get selected bookings
  const getSelectedBookings = () => {
    return getCurrentPageData().filter((booking) => selectedRows[booking.id])
  }

  // Handle copy data
  const handleCopyData = () => {
    try {
      const selectedBookings = getSelectedBookings()

      // If no rows are selected, show a message
      if (selectedBookings.length === 0) {
        toast({
          title: "No rows selected",
          description: "Please select at least one row to copy.",
          variant: "destructive",
        })
        return
      }

      // Headers
      const headers = ["Booking ID", "Confirmation", "Name", "Email", "Contact", "Booking Date", "Payment Status"]

      // Format the data
      let copyText = headers.join("\t") + "\n"

      selectedBookings.forEach((booking) => {
        const row = [
          booking.id,
          booking.status,
          booking.name,
          booking.email,
          booking.contact,
          booking.date,
          booking.paymentStatus,
        ]
        copyText += row.join("\t") + "\n"
      })

      // Copy to clipboard
      navigator.clipboard.writeText(copyText)

      // Show success message
      toast({
        title: "Data copied!",
        description: `${selectedBookings.length} row(s) copied to clipboard.`,
        variant: "default",
      })
    } catch (error) {
      console.error("Failed to copy data:", error)
      toast({
        title: "Copy failed",
        description: "There was an error copying the data.",
        variant: "destructive",
      })
    }
  }

  // Handle Excel export
  const handleExcelExport = async () => {
    try {
      setIsExporting(true)

      // Determine which data to export
      const selectedBookings = getSelectedBookings()
      const dataToExport = selectedBookings.length > 0 ? selectedBookings : getAllFilteredData()

      // If no data to export, show a message
      if (dataToExport.length === 0) {
        toast({
          title: "No data to export",
          description: "There are no bookings matching your current filters.",
          variant: "destructive",
        })
        setIsExporting(false)
        return
      }

      // Format the data for Excel
      const excelData = dataToExport.map((booking) => ({
        "Booking ID": booking.id,
        "Confirmation Status": booking.status,
        Name: booking.name,
        Email: booking.email,
        Contact: booking.contact,
        "Booking Date": booking.date,
        "Payment Status": booking.paymentStatus,
      }))

      // Create a new workbook
      const workbook = XLSX.utils.book_new()

      // Create a worksheet
      const worksheet = XLSX.utils.json_to_sheet(excelData)

      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings")

      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })

      // Create a Blob from the buffer
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })

      // Create a download link
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url

      // Set the filename with date
      const today = new Date()
      const dateStr = today.toISOString().split("T")[0]
      const timeStr = today.toTimeString().split(" ")[0].replace(/:/g, "-")
      const filename = `bookings_export_${dateStr}_${timeStr}.xlsx`

      link.download = filename

      // Trigger the download
      document.body.appendChild(link)
      link.click()

      // Clean up
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      // Show success message
      toast({
        title: "Excel export successful!",
        description: `${dataToExport.length} booking(s) exported to Excel.`,
        variant: "default",
      })
    } catch (error) {
      console.error("Failed to export Excel:", error)
      toast({
        title: "Export failed",
        description: "There was an error exporting the data to Excel.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  // Handle batch print
  const handleBatchPrint = async () => {
    try {
      const selectedBookings = getSelectedBookings()

      // If no rows are selected, show a message
      if (selectedBookings.length === 0) {
        toast({
          title: "No rows selected",
          description: "Please select at least one row to print.",
          variant: "destructive",
        })
        return
      }

      setIsPrinting(true)

      // Create a new window for printing
      const printWindow = window.open("", "_blank")
      if (!printWindow) {
        toast({
          title: "Print failed",
          description: "Pop-up blocker may be preventing the print window from opening.",
          variant: "destructive",
        })
        setIsPrinting(false)
        return
      }

      // Start building the HTML content
      let printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Booking Details - Batch Print</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .booking-container { page-break-after: always; margin-bottom: 30px; }
            .booking-container:last-child { page-break-after: avoid; }
            .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
            .logo { font-weight: bold; font-size: 24px; color: #b8860b; }
            .invoice-number { font-weight: bold; }
            .section { margin-bottom: 20px; }
            .section-title { font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
            .detail-row { display: flex; margin-bottom: 5px; }
            .detail-label { width: 150px; font-weight: bold; }
            .detail-value { flex: 1; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
            .total-section { display: flex; justify-content: flex-end; margin-top: 20px; }
            .total-table { width: 300px; }
            .total-row { display: flex; justify-content: space-between; margin-bottom: 5px; }
            .total-label { font-weight: bold; }
            .grand-total { font-weight: bold; border-top: 1px solid #ddd; padding-top: 5px; margin-top: 5px; }
            @media print {
              body { padding: 0; margin: 0; }
              .booking-container { page-break-after: always; }
              .booking-container:last-child { page-break-after: avoid; }
            }
          </style>
        </head>
        <body>
      `

      // Add each booking to the print content
      selectedBookings.forEach((booking, index) => {
        // Mock data for the booking details
        const mockBookingDetails = {
          id: booking.id,
          invoiceYear: "2025-2026",
          status: booking.status,
          guest: {
            name: booking.name,
            email: booking.email,
            phone: booking.contact,
            address: "123 Main St, City, Country",
          },
          stay: {
            checkIn: "22-04-2025",
            checkOut: "23-04-2025",
            roomType: "Premium Suite",
            numberOfRooms: "1",
            pax: {
              adult: "2",
              children: "0",
            },
            package: "Best Flexible Rate with WiFi",
          },
          payment: {
            bookingDate: booking.date,
            billAmount: "21004",
            method: "Credit Card",
            status: booking.paymentStatus,
            specialRequests: "",
            rate: "17,800",
            amount: "17,800",
            subtotal: "17,800.00",
            taxRate: "12",
            taxAmount: "3,204.00",
            grandTotal: "21,004.00",
            transactionNumber: "TXN123456",
          },
        }

        printContent += `
          <div class="booking-container">
            <div class="header">
              <div class="logo">The Royal Bihar</div>
              <div class="invoice-number">Invoice No.: TRB / ${mockBookingDetails.invoiceYear} / ${
                mockBookingDetails.id
              }</div>
            </div>

            <div class="section">
              <div class="section-title">Guest Details</div>
              <div class="detail-row">
                <div class="detail-label">Name:</div>
                <div class="detail-value">${mockBookingDetails.guest.name}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Email:</div>
                <div class="detail-value">${mockBookingDetails.guest.email}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Phone:</div>
                <div class="detail-value">${mockBookingDetails.guest.phone}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Address:</div>
                <div class="detail-value">${mockBookingDetails.guest.address}</div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Stay Details</div>
              <div class="detail-row">
                <div class="detail-label">Check-in Date:</div>
                <div class="detail-value">${mockBookingDetails.stay.checkIn}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Check-out Date:</div>
                <div class="detail-value">${mockBookingDetails.stay.checkOut}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Room Type:</div>
                <div class="detail-value">${mockBookingDetails.stay.roomType}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Number of Room(s):</div>
                <div class="detail-value">${mockBookingDetails.stay.numberOfRooms}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Pax:</div>
                <div class="detail-value">Adult: ${mockBookingDetails.stay.pax.adult}, Children: ${
                  mockBookingDetails.stay.pax.children
                }</div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Payment Details</div>
              <div class="detail-row">
                <div class="detail-label">Booking Date:</div>
                <div class="detail-value">${mockBookingDetails.payment.bookingDate}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Payment Method:</div>
                <div class="detail-value">${mockBookingDetails.payment.method}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Payment Status:</div>
                <div class="detail-value">${mockBookingDetails.payment.status}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Confirmation Status:</div>
                <div class="detail-value">${mockBookingDetails.status}</div>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>S. NO.</th>
                  <th>ROOMS/SERVICES</th>
                  <th>PAX</th>
                  <th>PACKAGE/DESCRIPTION</th>
                  <th>RATE</th>
                  <th>AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>01</td>
                  <td>${mockBookingDetails.stay.roomType}</td>
                  <td>Adult: ${mockBookingDetails.stay.pax.adult}, Children: ${
                    mockBookingDetails.stay.pax.children
                  }</td>
                  <td>${mockBookingDetails.stay.package}</td>
                  <td>₹ ${mockBookingDetails.payment.rate} /-</td>
                  <td>₹ ${mockBookingDetails.payment.amount} /-</td>
                </tr>
              </tbody>
            </table>

            <div class="total-section">
              <div class="total-table">
                <div class="total-row">
                  <div class="total-label">SUBTOTAL</div>
                  <div class="total-value">₹${mockBookingDetails.payment.subtotal}</div>
                </div>
                <div class="total-row">
                  <div class="total-label">TAX ${mockBookingDetails.payment.taxRate}%</div>
                  <div class="total-value">₹ ${mockBookingDetails.payment.taxAmount}</div>
                </div>
                <div class="total-row grand-total">
                  <div class="total-label">GRAND TOTAL</div>
                  <div class="total-value">₹${mockBookingDetails.payment.grandTotal}/-</div>
                </div>
              </div>
            </div>

            <div class="footer">
              <p>AIIMS Road, Walmi, Patna Pin-801505</p>
              <p>Email: reservations@theroyalbihar.com | PAN: AAJCR9703K | GSTIN: 10AAJCR9703K1ZA | SAC CODE: 996311</p>
              <p>Invoice was created on a computer and is valid without the signature and seal.</p>
            </div>
          </div>
        `

        // Add page break for all except the last booking
        if (index < selectedBookings.length - 1) {
          printContent += `<div style="page-break-after: always;"></div>`
        }
      })

      // Close the HTML content
      printContent += `
        </body>
        </html>
      `

      // Write the content to the new window
      printWindow.document.open()
      printWindow.document.write(printContent)
      printWindow.document.close()

      // Wait for the content to load before printing
      printWindow.onload = () => {
        printWindow.print()
        // Close the window after printing (optional)
        printWindow.onafterprint = () => {
          printWindow.close()
        }
        setIsPrinting(false)
      }

      // Fallback in case onload doesn't fire
      setTimeout(() => {
        if (isPrinting) {
          printWindow.print()
          setIsPrinting(false)
        }
      }, 1500)

      // Show success message
      toast({
        title: "Print prepared",
        description: `${selectedBookings.length} booking(s) prepared for printing.`,
        variant: "default",
      })
    } catch (error) {
      console.error("Failed to print bookings:", error)
      toast({
        title: "Print failed",
        description: "There was an error preparing the bookings for printing.",
        variant: "destructive",
      })
      setIsPrinting(false)
    }
  }

  // Handle edit booking
  const handleEditBooking = (booking) => {
    setBookingToEdit(booking)
    setIsEditing(true)
  }

  // Handle save booking
  const handleSaveBooking = (editedBooking) => {
    // In a real app, you would call an API to update the booking
    console.log(`Booking ${editedBooking.id} updated:`, editedBooking)

    // Update the bookingsData state with the edited booking
    setBookingsData((prevData) =>
      prevData.map((booking) => (booking.id === editedBooking.id ? editedBooking : booking)),
    )

    // Show success message
    toast({
      title: "Booking updated",
      description: `Booking ${editedBooking.id} has been updated successfully.`,
      variant: "default",
    })

    // Close the dialog
    setIsEditing(false)
    setBookingToEdit(null)
  }

  // Count selected rows
  const selectedCount = Object.values(selectedRows).filter(Boolean).length

  // Update the part where you render pagination
  const totalPages = Math.ceil(getCurrentPageData().length / itemsPerPage)

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
              <Button variant="outline" size="sm" className="text-gray-700" onClick={handleCopyData}>
                <Copy className="h-4 w-4 mr-2" />
                Copy {selectedCount > 0 ? `(${selectedCount})` : ""}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-gray-700"
                onClick={handleBatchPrint}
                disabled={isPrinting || selectedCount === 0}
              >
                {isPrinting ? (
                  <>
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-gray-300 border-t-gray-700" />
                    Printing...
                  </>
                ) : (
                  <>
                    <Printer className="h-4 w-4 mr-2" />
                    Print {selectedCount > 0 ? `(${selectedCount})` : ""}
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-gray-700"
                onClick={handleExcelExport}
                disabled={isExporting}
              >
                {isExporting ? (
                  <>
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-gray-300 border-t-gray-700" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Excel {selectedCount > 0 ? `(${selectedCount})` : ""}
                  </>
                )}
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <Checkbox checked={selectAll} onCheckedChange={toggleSelectAll} aria-label="Select all rows" />
                    </th>
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
                    <tr key={booking.id} className={`hover:bg-gray-50 ${selectedRows[booking.id] ? "bg-blue-50" : ""}`}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Checkbox
                          checked={selectedRows[booking.id] || false}
                          onCheckedChange={() => toggleRowSelection(booking.id)}
                          aria-label={`Select booking ${booking.id}`}
                        />
                      </td>
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
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-gray-500"
                            onClick={() => handlePrintBooking(booking.id)}
                          >
                            <Printer className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-red-500"
                            onClick={() => setBookingToDelete(booking.id)}
                          >
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
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-500"
                          onClick={() => handleEditBooking(booking)}
                          aria-label={`Edit booking ${booking.id}`}
                        >
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
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={bookingToDelete !== null} onOpenChange={(open) => !open && setBookingToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this booking?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the booking and remove the data from our
              servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDeleteBooking(bookingToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Booking Dialog */}
      <Dialog open={isEditing} onOpenChange={(open) => !open && setIsEditing(false)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Booking</DialogTitle>
            <DialogDescription>
              Make changes to the booking details below. Click save when you're done.
            </DialogDescription>
          </DialogHeader>

          {bookingToEdit && (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target)
                const editedBooking = {
                  id: bookingToEdit.id,
                  name: formData.get("name"),
                  email: formData.get("email"),
                  contact: formData.get("contact"),
                  date: formData.get("date"),
                  status: formData.get("status"),
                  paymentStatus: formData.get("paymentStatus"),
                }
                handleSaveBooking(editedBooking)
              }}
            >
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="id" className="text-right">
                    Booking ID
                  </Label>
                  <Input id="id" value={bookingToEdit.id} className="col-span-3" disabled />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input id="name" name="name" defaultValue={bookingToEdit.name} className="col-span-3" required />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={bookingToEdit.email}
                    className="col-span-3"
                    required
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="contact" className="text-right">
                    Contact
                  </Label>
                  <Input
                    id="contact"
                    name="contact"
                    defaultValue={bookingToEdit.contact}
                    className="col-span-3"
                    required
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Booking Date
                  </Label>
                  <Input id="date" name="date" defaultValue={bookingToEdit.date} className="col-span-3" required />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Select name="status" defaultValue={bookingToEdit.status}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Accepted">Accepted</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="paymentStatus" className="text-right">
                    Payment Status
                  </Label>
                  <Select name="paymentStatus" defaultValue={bookingToEdit.paymentStatus}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select payment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Paid">Paid</SelectItem>
                      <SelectItem value="Not paid">Not paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-gold hover:bg-gold-dark">
                  Save changes
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
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
