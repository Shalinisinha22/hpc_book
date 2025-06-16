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
import { API_ROUTES } from "@/config/api"
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

// Define the booking interface based on the API response
interface Booking {
  confirmation: string;
  bookingId: string;
  name: string;
  email: string;
  contact: string;
  bookingDate: string;
  paymentStatus: string;
}

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
  const [bookingsData, setBookingsData] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Fetch bookings from API
  const fetchBookings = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem("auth-token")
      if (!token) {
        throw new Error("Not authenticated")
      }

      const response = await fetch(API_ROUTES.bookings, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch bookings")
      }

      const data = await response.json()
      console.log("Fetched bookings:", data)

      // Check if response has the expected structure
      if (data.status === "success" && Array.isArray(data.data)) {
        setBookingsData(data.data)
      } else {
        throw new Error("Invalid response format")
      }
    } catch (error) {
      console.error("Fetch bookings error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch bookings",
        variant: "destructive",
      })
      setBookingsData([]) // Set empty array on error
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  useEffect(() => {
    // Reset to first page when filters change
    setCurrentPage(1)
  }, [dateFrom, dateTo, confirmStatus, paymentStatus])

  // Get current page data
  const getCurrentPageData = () => {
    const filtered = bookingsData.filter((booking) => {
      // Filter by date range if both dates are provided
      if (dateFrom && dateTo) {
        const bookingDate = new Date(booking.bookingDate)
        const fromDate = new Date(dateFrom)
        const toDate = new Date(dateTo)
        if (bookingDate < fromDate || bookingDate > toDate) return false
      }

      // Filter by confirmation status - for now we'll treat all as "Pending" since API doesn't provide status
      // You can modify this based on your actual API response structure
      if (confirmStatus !== "All" && confirmStatus !== "Pending") return false

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
        const bookingDate = new Date(booking.bookingDate)
        const fromDate = new Date(dateFrom)
        const toDate = new Date(dateTo)
        if (bookingDate < fromDate || bookingDate > toDate) return false
      }

      // Filter by confirmation status - for now we'll treat all as "Pending" since API doesn't provide status
      if (confirmStatus !== "All" && confirmStatus !== "Pending") return false

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
  const handleDeleteBooking = async (bookingId) => {
    try {
      setIsDeleting(true)
      const token = localStorage.getItem("auth-token")
      if (!token) {
        throw new Error("Not authenticated")
      }

      console.log(`Deleting booking ${bookingId}`)

      const response = await fetch(`${API_ROUTES.bookings}/${bookingId}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to delete booking")
      }

      const data = await response.json()
      console.log('Booking deleted successfully:', data)

      // Refresh the bookings list to get the latest data
      await fetchBookings()

      // Show success message
      toast({
        title: "Booking deleted",
        description: `Booking ${bookingId} has been deleted successfully.`,
        variant: "default",
      })

      // Close the dialog
      setBookingToDelete(null)

    } catch (error) {
      console.error("Delete booking error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete booking",
        variant: "destructive",
      })
      
      // Close the dialog even on error to prevent UI from being stuck
      setBookingToDelete(null)
    } finally {
      setIsDeleting(false)
    }
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
      newSelectedRows[booking.bookingId] = newSelectAll
    })

    setSelectedRows(newSelectedRows)
  }

  // Get selected bookings
  const getSelectedBookings = () => {
    return getCurrentPageData().filter((booking) => selectedRows[booking.bookingId])
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
          booking.bookingId,
          booking.confirmation,
          booking.name,
          booking.email,
          booking.contact,
          new Date(booking.bookingDate).toLocaleDateString(),
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
        "Booking ID": booking.bookingId,
        "Confirmation": booking.confirmation,
        Name: booking.name,
        Email: booking.email,
        Contact: booking.contact,
        "Booking Date": new Date(booking.bookingDate).toLocaleDateString(),
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
        printContent += `
          <div class="booking-container">
            <div class="header">
              <div class="logo">The Royal Bihar</div>
              <div class="invoice-number">Booking ID: ${booking.bookingId}</div>
            </div>

            <div class="section">
              <div class="section-title">Guest Details</div>
              <div class="detail-row">
                <div class="detail-label">Name:</div>
                <div class="detail-value">${booking.name}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Email:</div>
                <div class="detail-value">${booking.email}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Phone:</div>
                <div class="detail-value">${booking.contact}</div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Booking Details</div>
              <div class="detail-row">
                <div class="detail-label">Booking Date:</div>
                <div class="detail-value">${new Date(booking.bookingDate).toLocaleDateString()}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Confirmation:</div>
                <div class="detail-value">${booking.confirmation}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Payment Status:</div>
                <div class="detail-value">${booking.paymentStatus}</div>
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
  const handleEditBooking = async (booking) => {
    try {
      // Fetch full booking details for editing
      const token = localStorage.getItem("auth-token")
      if (!token) {
        throw new Error("Not authenticated")
      }

      const response = await fetch(`${API_ROUTES.bookings}/${booking.bookingId}`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch booking details")
      }

      const data = await response.json()
      console.log("Fetched booking details for editing:", data)

      // Handle both wrapped and direct response formats
      const fullBooking = data.status === "success" ? data.data : (data.bookingId ? data : null)
      
      if (!fullBooking) {
        throw new Error("Invalid booking data received")
      }

      // Map the full booking data to match the form field names
      const mappedBooking = {
        bookingId: fullBooking.bookingId,
        name: fullBooking.fullName,
        email: fullBooking.email,
        contact: fullBooking.phone,
        checkInDate: fullBooking.checkInDate,
        checkOutDate: fullBooking.checkOutDate,
        noOfRooms: fullBooking.noOfRooms,
        noOfGuests: fullBooking.noOfGuests,
        totalPrice: fullBooking.totalPrice,
        specialRequest: fullBooking.specialRequest,
        paymentStatus: fullBooking.paymentStatus
      }
      
      console.log('Mapped booking for form:', mappedBooking)
      
      setBookingToEdit(mappedBooking)
      setIsEditing(true)

    } catch (error) {
      console.error("Error fetching booking details for editing:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load booking details for editing",
        variant: "destructive",
      })
    }
  }

  // Handle save booking
  const handleSaveBooking = async (editedBooking) => {
    try {
      const token = localStorage.getItem("auth-token")
      if (!token) {
        throw new Error("Not authenticated")
      }

      // Prepare the update data - only send fields that can be updated
      const updateData = {
        fullName: editedBooking.name,
        email: editedBooking.email,
        phone: editedBooking.contact,
        paymentStatus: editedBooking.paymentStatus,
        // Convert datetime-local back to ISO string
        checkInDate: editedBooking.checkInDate ? new Date(editedBooking.checkInDate).toISOString() : null,
        checkOutDate: editedBooking.checkOutDate ? new Date(editedBooking.checkOutDate).toISOString() : null,
        noOfRooms: editedBooking.noOfRooms ? Number(editedBooking.noOfRooms) : 1,
        noOfGuests: {
          adults: editedBooking.adults ? Number(editedBooking.adults) : 1,
          children: editedBooking.children ? Number(editedBooking.children) : 0
        },
        totalPrice: editedBooking.totalPrice ? Number(editedBooking.totalPrice) : 0,
        specialRequest: editedBooking.specialRequest || ""
      }

      console.log(`Updating booking ${editedBooking.bookingId} with data:`, updateData)

      const response = await fetch(`${API_ROUTES.bookings}/${editedBooking.bookingId}`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update booking")
      }

      const data = await response.json()
      console.log('Booking updated successfully:', data)

      // Refresh the bookings list to get the latest data
      await fetchBookings()

      // Show success message
      toast({
        title: "Booking updated",
        description: `Booking ${editedBooking.bookingId} has been updated successfully.`,
        variant: "default",
      })

      // Close the dialog
      setIsEditing(false)
      setBookingToEdit(null)

    } catch (error) {
      console.error("Update booking error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update booking",
        variant: "destructive",
      })
    }
  }

  // Count selected rows
  const selectedCount = Object.values(selectedRows).filter(Boolean).length

  // Update the part where you render pagination
  const totalPages = Math.ceil(getAllFilteredData().length / itemsPerPage)

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
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
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
                  {isLoading ? (
                    <tr>
                      <td colSpan={10} className="px-4 py-8 text-center text-gray-500">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mr-2"></div>
                          Loading bookings...
                        </div>
                      </td>
                    </tr>
                  ) : getCurrentPageData().length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-4 py-8 text-center text-gray-500">
                        No bookings found
                      </td>
                    </tr>
                  ) : (
                    getCurrentPageData().map((booking, index) => (
                      <tr key={booking.bookingId} className={`hover:bg-gray-50 ${selectedRows[booking.bookingId] ? "bg-blue-50" : ""}`}>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <Checkbox
                            checked={selectedRows[booking.bookingId] || false}
                            onCheckedChange={() => toggleRowSelection(booking.bookingId)}
                            aria-label={`Select booking ${booking.bookingId}`}
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-gray-500"
                              onClick={() => handleViewBooking(booking.bookingId)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-gray-500"
                              onClick={() => handlePrintBooking(booking.bookingId)}
                            >
                              <Printer className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-red-500"
                              onClick={() => setBookingToDelete(booking.bookingId)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <ConfirmationBadge status="Pending" />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gold">{booking.bookingId}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{booking.name}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{booking.email}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{booking.contact}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          {new Date(booking.bookingDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <PaymentBadge status={booking.paymentStatus} />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500"
                            onClick={() => handleEditBooking(booking)}
                            aria-label={`Edit booking ${booking.bookingId}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Add pagination component */}
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </Card>
        </main>
      </div>
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={bookingToDelete !== null} onOpenChange={(open) => !open && !isDeleting && setBookingToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this booking?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the booking and remove the data from our
              servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDeleteBooking(bookingToDelete)}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Booking Dialog */}
      <Dialog open={isEditing} onOpenChange={(open) => !open && setIsEditing(false)}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
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
            bookingId: bookingToEdit.bookingId,
            name: formData.get("name"),
            email: formData.get("email"),
            contact: formData.get("contact"),
            checkInDate: formData.get("checkInDate"),
            checkOutDate: formData.get("checkOutDate"),
            noOfRooms: formData.get("noOfRooms"),
            adults: formData.get("adults"),
            children: formData.get("children"),
            totalPrice: formData.get("totalPrice"),
            specialRequest: formData.get("specialRequest"),
            paymentStatus: formData.get("paymentStatus"),
            }
            handleSaveBooking(editedBooking)
            }}
            >
            <div className="space-y-6 py-4">
              {/* Booking ID - Read Only */}
              <div className="space-y-2">
                <Label htmlFor="bookingId">Booking ID</Label>
                <Input id="bookingId" value={bookingToEdit.bookingId} disabled className="bg-gray-50" />
              </div>
              
              {/* Guest Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Guest Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input id="name" name="name" defaultValue={bookingToEdit.name} required />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      defaultValue={bookingToEdit.email}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contact">Phone *</Label>
                    <Input
                      id="contact"
                      name="contact"
                      defaultValue={bookingToEdit.contact}
                      required
                    />
                  </div>
                </div>
              </div>
              
              {/* Booking Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Booking Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="checkInDate">Check-in Date</Label>
                    <Input 
                      id="checkInDate" 
                      name="checkInDate" 
                      type="date"
                      defaultValue={bookingToEdit.checkInDate ? new Date(bookingToEdit.checkInDate).toISOString().slice(0, 10) : ''} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="checkOutDate">Check-out Date</Label>
                    <Input 
                      id="checkOutDate" 
                      name="checkOutDate" 
                      type="date"
                      defaultValue={bookingToEdit.checkOutDate ? new Date(bookingToEdit.checkOutDate).toISOString().slice(0, 10) : ''} 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="noOfRooms">Number of Rooms</Label>
                    <Input
                      id="noOfRooms"
                      name="noOfRooms"
                      type="number"
                      min="1"
                      defaultValue={bookingToEdit.noOfRooms || 1}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="adults">Adults</Label>
                    <Input
                      id="adults"
                      name="adults"
                      type="number"
                      min="1"
                      defaultValue={bookingToEdit.noOfGuests?.adults || 1}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="children">Children</Label>
                    <Input
                      id="children"
                      name="children"
                      type="number"
                      min="0"
                      defaultValue={bookingToEdit.noOfGuests?.children || 0}
                    />
                  </div>
                </div>
              </div>
              
              {/* Payment & Additional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Payment & Additional Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="totalPrice">Total Price (₹)</Label>
                    <Input
                      id="totalPrice"
                      name="totalPrice"
                      type="number"
                      min="0"
                      defaultValue={bookingToEdit.totalPrice || 0}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="paymentStatus">Payment Status</Label>
                    <Select name="paymentStatus" defaultValue={bookingToEdit.paymentStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="specialRequest">Special Request</Label>
                  <Input
                    id="specialRequest"
                    name="specialRequest"
                    defaultValue={bookingToEdit.specialRequest || ''}
                    placeholder="Any special requests..."
                  />
                </div>
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
  let bgColor = "bg-yellow-100 text-yellow-800"
  let displayStatus = status
  
  if (status === "paid" || status === "Paid") {
    bgColor = "bg-green-100 text-green-800"
    displayStatus = "Paid"
  } else if (status === "pending") {
    bgColor = "bg-yellow-100 text-yellow-800"
    displayStatus = "Pending"
  } else if (status === "failed") {
    bgColor = "bg-red-100 text-red-800"
    displayStatus = "Failed"
  }

  return <Badge className={`${bgColor} font-medium`}>{displayStatus}</Badge>
}
