"use client"

import { useState, useEffect } from "react"
import { Copy, Printer, FileSpreadsheet, ChevronDown, ChevronUp, MoreHorizontal, Check, X, Eye } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pagination } from "@/components/pagination"
import { useToast } from "@/components/ui/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Sample data matching the screenshot
const initialBookingRequests = [
  {
    id: 1,
    requestedOn: "12-04-2023",
    venueName: "Shahmai",
    prefDate: "2023-05-12",
    noOfGuests: 100,
    fullName: "Jayant Gautam",
    mobile: "9818984683",
    email: "jgautam8@gmail.com",
    timeOfEvent: "1500 to 2345 hrs",
    purpose: "Social Event",
  },
  {
    id: 2,
    requestedOn: "12-04-2023",
    venueName: "Shahmai",
    prefDate: "2023-05-12",
    noOfGuests: 100,
    fullName: "Jayant Gautam",
    mobile: "9818984683",
    email: "jgautam8@gmail.com",
    timeOfEvent: "1500 to 2345 hrs",
    purpose: "Social Event",
  },
  {
    id: 3,
    requestedOn: "10-04-2023",
    venueName: "Sukoon",
    prefDate: "2023-05-10",
    noOfGuests: 100,
    fullName: "Rajesh Ranjan",
    mobile: "9910811192",
    email: "ranjanranjit.amu@gmail.com",
    timeOfEvent: "0900 to 1800 hrs",
    purpose: "Social Event",
  },
  {
    id: 4,
    requestedOn: "18-03-2023",
    venueName: "Swarn Mahal",
    prefDate: "2023-03-12",
    noOfGuests: 100,
    fullName: "Akshay Joshi",
    mobile: "09527984821",
    email: "akshay@acemoney.in",
    timeOfEvent: "0900 to 1800 hrs",
    purpose: "Conference",
  },
  {
    id: 5,
    requestedOn: "18-03-2023",
    venueName: "Magadh",
    prefDate: "2023-04-12",
    noOfGuests: 100,
    fullName: "Jimmin",
    mobile: "7253903131",
    email: "info@acemoney.in",
    timeOfEvent: "0900 to 1800 hrs",
    purpose: "Conference",
  },
  {
    id: 6,
    requestedOn: "25-02-2023",
    venueName: "Sukoon",
    prefDate: "2023-05-23",
    noOfGuests: 50,
    fullName: "Yash Sharma",
    mobile: "7979867155",
    email: "yashind23@gmail.com",
    timeOfEvent: "0900 to 1800 hrs",
    purpose: "Wedding",
  },
  {
    id: 7,
    requestedOn: "31-01-2023",
    venueName: "Sukoon",
    prefDate: "2023-02-28",
    noOfGuests: 50,
    fullName: "Jitendra Dixit",
    mobile: "9927026548",
    email: "jitendra.21131@ipuc.co.in",
    timeOfEvent: "1500 to 2345 hrs",
    purpose: "Social Event",
  },
  {
    id: 8,
    requestedOn: "25-12-2024",
    venueName: "Nargis",
    prefDate: "2023-01-23",
    noOfGuests: 150,
    fullName: "Mohammed Shahrukh",
    mobile: "8294752840",
    email: "techtarark@gmail.com",
    timeOfEvent: "1500 to 2345 hrs",
    purpose: "Social Event",
  },
  {
    id: 9,
    requestedOn: "23-12-2024",
    venueName: "Mihila",
    prefDate: "2023-02-07",
    noOfGuests: 70,
    fullName: "Dr Nikhil Bhardwaj",
    mobile: "7428043390",
    email: "Nikhilbhardwaj10@outlook.com",
    timeOfEvent: "0900 to 1800 hrs",
    purpose: "Wedding",
  },
  {
    id: 10,
    requestedOn: "23-12-2024",
    venueName: "Mihila",
    prefDate: "2023-02-07",
    noOfGuests: 70,
    fullName: "Dr Nikhil Bhardwaj",
    mobile: "7428043390",
    email: "Nikhilbhardwaj10@outlook.com",
    timeOfEvent: "0900 to 1800 hrs",
    purpose: "Wedding",
  },
  // Additional data to demonstrate pagination
  ...Array.from({ length: 42 }, (_, i) => ({
    id: i + 11,
    requestedOn: "20-12-2024",
    venueName: "Sukoon",
    prefDate: "2023-03-15",
    noOfGuests: 80,
    fullName: "Sample User",
    mobile: "9999999999",
    email: "sample@example.com",
    timeOfEvent: "1200 to 1800 hrs",
    purpose: "Conference",
  })),
]

export default function BookingRequestsPage() {
  const { toast } = useToast()
  const [bookingRequests, setBookingRequests] = useState(initialBookingRequests)
  const [filteredRequests, setFilteredRequests] = useState(initialBookingRequests)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "ascending" })

  const itemsPerPage = 10
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem)

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

  // Handle actions
  const handleAction = (action, request) => {
    switch (action) {
      case "view":
        toast({
          title: "Viewing Request Details",
          description: `Viewing details for booking request #${request.id} by ${request.fullName}`,
        })
        break
      case "approve":
        toast({
          title: "Request Approved",
          description: `Booking request #${request.id} has been approved`,
          variant: "success",
        })
        break
      case "reject":
        toast({
          title: "Request Rejected",
          description: `Booking request #${request.id} has been rejected`,
          variant: "destructive",
        })
        break
      default:
        break
    }
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
                <th className="px-4 py-3 font-medium text-gray-500 cursor-pointer" onClick={() => requestSort("id")}>
                  <div className="flex items-center"># {getSortDirectionIcon("id")}</div>
                </th>
                <th
                  className="px-4 py-3 font-medium text-gray-500 cursor-pointer"
                  onClick={() => requestSort("requestedOn")}
                >
                  <div className="flex items-center">REQUESTED ON {getSortDirectionIcon("requestedOn")}</div>
                </th>
                <th
                  className="px-4 py-3 font-medium text-gray-500 cursor-pointer"
                  onClick={() => requestSort("venueName")}
                >
                  <div className="flex items-center">VENUE NAME {getSortDirectionIcon("venueName")}</div>
                </th>
                <th
                  className="px-4 py-3 font-medium text-gray-500 cursor-pointer"
                  onClick={() => requestSort("prefDate")}
                >
                  <div className="flex items-center">PREF. DATE {getSortDirectionIcon("prefDate")}</div>
                </th>
                <th
                  className="px-4 py-3 font-medium text-gray-500 cursor-pointer"
                  onClick={() => requestSort("noOfGuests")}
                >
                  <div className="flex items-center">NO. OF GUESTS {getSortDirectionIcon("noOfGuests")}</div>
                </th>
                <th
                  className="px-4 py-3 font-medium text-gray-500 cursor-pointer"
                  onClick={() => requestSort("fullName")}
                >
                  <div className="flex items-center">FULL NAME {getSortDirectionIcon("fullName")}</div>
                </th>
                <th
                  className="px-4 py-3 font-medium text-gray-500 cursor-pointer"
                  onClick={() => requestSort("mobile")}
                >
                  <div className="flex items-center">MOBILE {getSortDirectionIcon("mobile")}</div>
                </th>
                <th className="px-4 py-3 font-medium text-gray-500 cursor-pointer" onClick={() => requestSort("email")}>
                  <div className="flex items-center">EMAIL {getSortDirectionIcon("email")}</div>
                </th>
                <th
                  className="px-4 py-3 font-medium text-gray-500 cursor-pointer"
                  onClick={() => requestSort("timeOfEvent")}
                >
                  <div className="flex items-center">TIME OF EVENT {getSortDirectionIcon("timeOfEvent")}</div>
                </th>
                <th
                  className="px-4 py-3 font-medium text-gray-500 cursor-pointer"
                  onClick={() => requestSort("purpose")}
                >
                  <div className="flex items-center">PURPOSE {getSortDirectionIcon("purpose")}</div>
                </th>
                <th className="px-4 py-3 font-medium text-gray-500">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((request) => (
                <tr key={request.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{request.id}</td>
                  <td className="px-4 py-3">{request.requestedOn}</td>
                  <td className="px-4 py-3 text-green-600 font-medium">{request.venueName}</td>
                  <td className="px-4 py-3">{request.prefDate}</td>
                  <td className="px-4 py-3">{request.noOfGuests}</td>
                  <td className="px-4 py-3 font-medium text-blue-600">{request.fullName}</td>
                  <td className="px-4 py-3">{request.mobile}</td>
                  <td className="px-4 py-3 text-blue-600">{request.email}</td>
                  <td className="px-4 py-3">{request.timeOfEvent}</td>
                  <td className="px-4 py-3">{request.purpose}</td>
                  <td className="px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleAction("view", request)}>
                          <Eye size={14} className="mr-2" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction("approve", request)}>
                          <Check size={14} className="mr-2" /> Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction("reject", request)}>
                          <X size={14} className="mr-2" /> Reject
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t">
                <th className="px-4 py-3 font-medium text-gray-500">#</th>
                <th className="px-4 py-3 font-medium text-gray-500">Requested on</th>
                <th className="px-4 py-3 font-medium text-gray-500">Venue Name</th>
                <th className="px-4 py-3 font-medium text-gray-500">Pref. Date</th>
                <th className="px-4 py-3 font-medium text-gray-500">No. of guests</th>
                <th className="px-4 py-3 font-medium text-gray-500">Full Name</th>
                <th className="px-4 py-3 font-medium text-gray-500">Mobile</th>
                <th className="px-4 py-3 font-medium text-gray-500">Email</th>
                <th className="px-4 py-3 font-medium text-gray-500">Time of event</th>
                <th className="px-4 py-3 font-medium text-gray-500">Purpose</th>
                <th className="px-4 py-3 font-medium text-gray-500"></th>
              </tr>
            </tfoot>
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
    </div>
  )
}
