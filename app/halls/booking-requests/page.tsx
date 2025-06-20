"use client"

import { useState, useEffect } from "react"
import { Copy, Printer, FileSpreadsheet, ChevronDown, ChevronUp, MoreHorizontal, Eye, Trash } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pagination } from "@/components/pagination"
import { useToast } from "@/components/ui/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
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
import axios from "axios"
import { API_ROUTES } from "@/config/api"

// Add a type for booking request
interface BookingRequestTableRow {
  id: string;
  requestedOn: string;
  venueName: string;
  prefDate: string;
  noOfGuests: number;
  fullName: string;
  mobile: string;
  email: string;
  purpose: string;
  message: string;
  status: string;
  raw: any;
}

export default function BookingRequestsPage() {
  const { toast } = useToast()
  const [bookingRequests, setBookingRequests] = useState<BookingRequestTableRow[]>([])
  const [filteredRequests, setFilteredRequests] = useState<BookingRequestTableRow[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "ascending" })
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<BookingRequestTableRow | null>(null)

  const itemsPerPage = 10
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem)

  // Map API data to table fields
  const mapBookingData = (data: any[]) =>
    data.map((item, idx) => ({
      id: item._id,
      requestedOn: item.cdate ? new Date(item.cdate).toLocaleDateString() : "-",
      venueName: item.hallId?.hall_name || "-",
      prefDate: item.date ? new Date(item.date).toLocaleDateString() : "-",
      noOfGuests: item.guests,
      fullName: item.name,
      mobile: item.mobile,
      email: item.email,
      purpose: item.eventType,
      message: item.message,
      status: item.status,
      raw: item,
    }))

  // Fetch event bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(`${API_ROUTES.eventBookings}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("auth-token")}`,
          },
        })
        setBookingRequests(mapBookingData(res.data.data))
        setFilteredRequests(mapBookingData(res.data.data)) // Initialize filteredRequests with fetched data
      } catch (err) {
        toast({ title: "Error", description: "Failed to load bookings", variant: "destructive" })
      }
    }
    fetchBookings()
  }, [])

  // Handle search
  useEffect(() => {
    const results = bookingRequests.filter((request) =>
      Object.values(request).some((value) => value.toString().toLowerCase().includes(searchTerm.toLowerCase())),
    )
    setFilteredRequests(results)
    setCurrentPage(1)
  }, [searchTerm, bookingRequests])

  // Handle sorting
  const requestSort = (key) => {
    let direction = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })

    const sortedData = [...filteredRequests].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "ascending" ? -1 : 1
      }
      if (a[key] > b[key]) {
        return direction === "ascending" ? 1 : -1
      }
      return 0
    })

    setFilteredRequests(sortedData)
  }

  // Get sort direction icon
  const getSortDirectionIcon = (key) => {
    if (sortConfig.key !== key) return null
    return sortConfig.direction === "ascending" ? <ChevronUp size={14} /> : <ChevronDown size={14} />
  }

  // Handle view action
  const handleView = (request) => {
    setSelectedRequest(request)
    setViewDialogOpen(true)
  }

  // Handle delete confirmation
  const handleDeleteConfirm = (request) => {
    setSelectedRequest(request)
    setDeleteDialogOpen(true)
  }

  // Handle actual delete
  const handleDelete = async () => {
    if (!selectedRequest) return
    try {
      await axios.delete(`${API_ROUTES.eventBookings}/${selectedRequest.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
        },
      })
      const updatedRequests = bookingRequests.filter((item) => item.id !== selectedRequest.id)
      setBookingRequests(updatedRequests)
      setFilteredRequests(updatedRequests)
      toast({
        title: "Request Deleted",
        description: `Booking request #${selectedRequest.id} has been deleted`,
        variant: "destructive",
      })
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete booking request", variant: "destructive" })
    }
    setDeleteDialogOpen(false)
    setSelectedRequest(null)
  }

  // Handle export actions
  const handleExport = (type) => {
    switch (type) {
      case "copy":
        toast({
          title: "Copied to Clipboard",
          description: "The table data has been copied to your clipboard",
        })
        break
      case "print":
        window.print()
        break
      case "excel":
        toast({
          title: "Exporting to Excel",
          description: "The table data is being exported to Excel",
        })
        break
      default:
        break
    }
  }

  useEffect(() => {
    // Reset to first page when search or filter changes
    setCurrentPage(1)
  }, [searchTerm, sortConfig])

  console.log("currentitems", currentItems)

  return (
    <div className="space-y-6">
      <PageHeader
        heading="Hall Booking Requests"
        text="Here you can find the hall booking requests and you can sort the data on the basis of all columns. You can also search the data based on any columns. By default latest request is shown first."
      />

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => handleExport("copy")}>
              <Copy size={14} className="mr-1" /> Copy
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport("print")}>
              <Printer size={14} className="mr-1" /> Print
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport("excel")}>
              <FileSpreadsheet size={14} className="mr-1" /> Excel
            </Button>
          </div>
          <div className="w-full sm:w-auto">
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-t border-b text-left">
                {[
                  "#",
                  "REQUESTED ON",
                  "VENUE NAME",
                  "PREF. DATE",
                  "NO. OF GUESTS",
                  "FULL NAME",
                  "MOBILE",
                  "EMAIL",
                  "PURPOSE",
                  "MESSAGE",
                ].map((title, index) => (
                  <th
                    key={title}
                    className="px-4 py-3 font-medium text-gray-500 cursor-pointer"
                    onClick={() =>
                      requestSort([
                        "id",
                        "requestedOn",
                        "venueName",
                        "prefDate",
                        "noOfGuests",
                        "fullName",
                        "mobile",
                        "email",
                        "purpose",
                        "message",
                      ][index])
                    }
                  >
                    <div className="flex items-center">
                      {title} {getSortDirectionIcon([
                        "id",
                        "requestedOn",
                        "venueName",
                        "prefDate",
                        "noOfGuests",
                        "fullName",
                        "mobile",
                        "email",
                        "purpose",
                        "message",
                      ][index])}
                    </div>
                  </th>
                ))}
                <th className="px-4 py-3 font-medium text-gray-500">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((request) => (
                <tr key={request._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{request.id}</td>
                  <td className="px-4 py-3">{request.requestedOn}</td>
                  <td className="px-4 py-3 text-green-600 font-medium">{request.venueName}</td>
                  <td className="px-4 py-3">{request.prefDate}</td>
                  <td className="px-4 py-3">{request.noOfGuests}</td>
                  <td className="px-4 py-3 font-medium text-blue-600">{request.fullName}</td>
                  <td className="px-4 py-3">{request.mobile}</td>
                  <td className="px-4 py-3 text-blue-600">{request.email}</td>
                  <td className="px-4 py-3">{request.purpose}</td>
                  <td className="px-4 py-3">{request.message}</td>
                  <td className="px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(request)}>
                          <Eye size={14} className="mr-2" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteConfirm(request)} className="text-red-600">
                          <Trash size={14} className="mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-500">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredRequests.length)} of{" "}
            {filteredRequests.length} entries
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Booking Request Details</DialogTitle>
            <DialogDescription>
              Viewing details for booking request #{selectedRequest?._id}
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="grid gap-4 py-4">
              {[
                ["ID", selectedRequest.id],
                ["Requested On", selectedRequest.requestedOn],
                ["Venue Name", selectedRequest.venueName],
                ["Preferred Date", selectedRequest.prefDate],
                ["Number of Guests", selectedRequest.noOfGuests],
                ["Full Name", selectedRequest.fullName],
                ["Mobile", selectedRequest.mobile],
                ["Email", selectedRequest.email],
                ["Message", selectedRequest.message || ""],
                ["Purpose", selectedRequest.purpose],
              ].map(([label, value]) => (
                <div className="grid grid-cols-3 items-center gap-4" key={label}>
                  <span className="font-medium">{label}:</span>
                  <span className="col-span-2">{value}</span>
                </div>
              ))}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete booking request #{selectedRequest?._id} by {selectedRequest?.name}. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
