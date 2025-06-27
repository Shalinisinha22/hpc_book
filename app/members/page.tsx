"use client"

import { useState, useEffect } from "react"
import { Eye, Printer, FileSpreadsheet, FileText, Info } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { Pagination } from "@/components/pagination"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { API_BASE_URL } from "@/config/api"

// Define the user interface based on the API response
interface User {
  _id: string;
  name: string;
  email: string;
  phone?: number;
  role: string;
  status: string;
  cdate: string;
  bookingIds: string[];
}

export default function MembersPage() {
  // Search state
  const [searchQuery, setSearchQuery] = useState("")

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const [selectedRows, setSelectedRows] = useState({})
  const [selectAll, setSelectAll] = useState(false)
  const [isPrinting, setIsPrinting] = useState(false)
  const [membersData, setMembersData] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch members from API
  const fetchMembers = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem("auth-token")
      if (!token) {
        throw new Error("Not authenticated")
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/users`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch members")
      }

      const data = await response.json()
      console.log("Fetched members:", data)

      // Check if response has the expected structure
      if (data.users && Array.isArray(data.users)) {
        setMembersData(data.users)
      } else {
        throw new Error("Invalid response format")
      }
    } catch (error) {
      console.error("Fetch members error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch members",
        variant: "destructive",
      })
      setMembersData([]) // Set empty array on error
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMembers()
  }, [])

  useEffect(() => {
    // Reset to first page when search query changes
    setCurrentPage(1)
  }, [searchQuery])

  // Filter members based on search query
  const filteredMembers = membersData.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.phone && member.phone.toString().includes(searchQuery)),
  )

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage)

  // Get current page data
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredMembers.slice(startIndex, endIndex)
  }

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  // Handle row selection
  const toggleRowSelection = (memberId) => {
    setSelectedRows((prev) => ({
      ...prev,
      [memberId]: !prev[memberId],
    }))
  }

  // Handle select all
  const toggleSelectAll = () => {
    const newSelectAll = !selectAll
    setSelectAll(newSelectAll)

    const newSelectedRows = {}
    getCurrentPageData().forEach((member) => {
      newSelectedRows[member._id] = newSelectAll
    })

    setSelectedRows(newSelectedRows)
  }

  // Get selected members
  const getSelectedMembers = () => {
    return getCurrentPageData().filter((member) => selectedRows[member._id])
  }

  // Handle batch print
  const handleBatchPrint = async () => {
    try {
      const selectedMembers = getSelectedMembers()

      // If no rows are selected, show a message
      if (selectedMembers.length === 0) {
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
        <title>Member Details - Batch Print</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          .member-container { page-break-after: always; margin-bottom: 30px; }
          .member-container:last-child { page-break-after: avoid; }
          .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
          .logo { font-weight: bold; font-size: 24px; color: #b8860b; }
          .section { margin-bottom: 20px; }
          .section-title { font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
          .detail-row { display: flex; margin-bottom: 5px; }
          .detail-label { width: 150px; font-weight: bold; }
          .detail-value { flex: 1; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
          @media print {
            body { padding: 0; margin: 0; }
            .member-container { page-break-after: always; }
            .member-container:last-child { page-break-after: avoid; }
          }
        </style>
      </head>
      <body>
    `

      // Add each member to the print content
      selectedMembers.forEach((member, index) => {
        printContent += `
        <div class="member-container">
          <div class="header">
            <div class="logo">Hotel Patliputra Continental</div>
            <div>Member ID: ${member._id}</div>
          </div>

          <div class="section">
            <div class="section-title">Member Details</div>
            <div class="detail-row">
              <div class="detail-label">Name:</div>
              <div class="detail-value">${member.name}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Email:</div>
              <div class="detail-value">${member.email}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Phone:</div>
              <div class="detail-value">${member.phone || 'N/A'}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Role:</div>
              <div class="detail-value">${member.role}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Join Date:</div>
              <div class="detail-value">${new Date(member.cdate).toLocaleDateString()}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Status:</div>
              <div class="detail-value">${member.status}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Total Bookings:</div>
              <div class="detail-value">${member.bookingIds.length}</div>
            </div>
          </div>

          <div class="footer">
            <p>AIIMS Road, Walmi, Patna Pin-801505</p>
            <p>Email: members@theroyalbihar.com | Phone: +91-612-2345678</p>
            <p>This document was generated on ${new Date().toLocaleDateString()} and is valid without the signature and seal.</p>
          </div>
        </div>
      `

        // Add page break for all except the last member
        if (index < selectedMembers.length - 1) {
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
        description: `${selectedMembers.length} member(s) prepared for printing.`,
        variant: "default",
      })
    } catch (error) {
      console.error("Failed to print members:", error)
      toast({
        title: "Print failed",
        description: "There was an error preparing the members for printing.",
        variant: "destructive",
      })
      setIsPrinting(false)
    }
  }

  // Handle Excel export
  const handleExcelExport = async () => {
    try {
      const XLSX = await import("xlsx")
      
      // Convert the data to a worksheet format
      const worksheet = XLSX.utils.json_to_sheet(
        filteredMembers.map((member) => ({
          ID: member._id,
          Name: member.name,
          Email: member.email,
          Phone: member.phone || 'N/A',
          Role: member.role,
          Status: member.status,
          "Join Date": new Date(member.cdate).toLocaleDateString(),
          "Total Bookings": member.bookingIds.length,
        })),
      )

      // Create a new workbook
      const workbook = XLSX.utils.book_new()

      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Members")

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
      link.download = `members_export_${dateStr}_${timeStr}.xlsx`

      // Trigger the download
      document.body.appendChild(link)
      link.click()

      // Clean up
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast({
        title: "Excel export successful!",
        description: `${filteredMembers.length} member(s) exported to Excel.`,
        variant: "default",
      })
    } catch (error) {
      console.error("Failed to export Excel:", error)
      toast({
        title: "Export failed",
        description: "There was an error exporting the data to Excel.",
        variant: "destructive",
      })
    }
  }

  // Handle PDF export
  const handlePdfExport = () => {
    try {
      const printWindow = window.open("", "_blank")

      if (!printWindow) {
        toast({
          title: "Error",
          description: "Could not open PDF window. Please check your popup blocker settings.",
          variant: "destructive",
        })
        return
      }

      // Get the current date and time for the report header
      const currentDate = new Date().toLocaleDateString()
      const currentTime = new Date().toLocaleTimeString()

      // Create the HTML content for PDF
      const pdfContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Members List - Hotel Patliputra Continental</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.5;
              color: #333;
              margin: 0;
              padding: 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
              padding-bottom: 10px;
              border-bottom: 2px solid #ddd;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 5px;
              color: #b8860b;
            }
            .title {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .subtitle {
              font-size: 14px;
              color: #666;
            }
            .date-time {
              margin-top: 10px;
              font-size: 12px;
              color: #666;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px 12px;
              text-align: left;
            }
            th {
              background-color: #f5f5f5;
              font-weight: bold;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 12px;
              color: #666;
              border-top: 1px solid #ddd;
              padding-top: 10px;
            }
            .pdf-note {
              text-align: center;
              margin-top: 30px;
              font-size: 14px;
              color: #b8860b;
              padding: 10px;
              border: 1px dashed #b8860b;
              background-color: #fff9e6;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">Hotel Patliputra Continental</div>
            <div class="title">Members List</div>
            <div class="subtitle">Complete list of registered members</div>
            <div class="date-time">Generated on: ${currentDate} at ${currentTime}</div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Status</th>
                <th>Join Date</th>
                <th>Bookings</th>
              </tr>
            </thead>
            <tbody>
              ${filteredMembers
                .map(
                  (member) => `
                <tr>
                  <td>${member.name}</td>
                  <td>${member.email}</td>
                  <td>${member.phone || 'N/A'}</td>
                  <td>${member.role}</td>
                  <td>${member.status}</td>
                  <td>${new Date(member.cdate).toLocaleDateString()}</td>
                  <td>${member.bookingIds.length}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>

          <div class="pdf-note">
            <p>To save as PDF, please use your browser's "Print" function and select "Save as PDF" as the destination.</p>
          </div>

          <div class="footer">
            <p>This is a system-generated report from Hotel Patliputra Continental Hotel Management System.</p>
            <p>For any queries, please contact the system administrator.</p>
          </div>

          <script>
            // Auto-trigger print dialog which can be used to save as PDF
            window.onload = function() {
              document.querySelector('.pdf-note').style.display = 'block';
            };
          </script>
        </body>
        </html>
      `

      // Write the content to the new window
      printWindow.document.open()
      printWindow.document.write(pdfContent)
      printWindow.document.close()

      toast({
        title: "PDF export prepared",
        description: "Use your browser's Save as PDF option in the print dialog to save the PDF.",
      })
    } catch (error) {
      console.error("Failed to export PDF:", error)
      toast({
        title: "Export failed",
        description: "There was an error preparing the PDF export.",
        variant: "destructive",
      })
    }
  }

  // Count selected rows
  const selectedCount = Object.values(selectedRows).filter(Boolean).length

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - hidden on mobile */}
      <Sidebar className="hidden md:flex" activeItem="Members" />

      {/* Main Content */}
      <div className="flex-1">
        <PageHeader />

        <main className="p-4 md:p-6">
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">Members List</h1>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-5 w-5 text-orange-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-80">
                      Below is a list of all users registered in the system including staff and customers.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Below is a list of all users registered in the system including staff and customers. You can
              search for members and print the list.
            </p>
          </div>

          <Card className="bg-white shadow-sm border-gray-200 overflow-hidden">
            <div className="p-4 flex flex-wrap justify-between items-center border-b border-gray-200">
              <div className="flex flex-wrap gap-2">
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
                <Button variant="outline" size="sm" className="text-gray-700" onClick={handleExcelExport}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Excel
                </Button>
                <Button variant="outline" size="sm" className="text-gray-700" onClick={handlePdfExport}>
                  <FileText className="h-4 w-4 mr-2" />
                  PDF
                </Button>
              </div>
              <div className="mt-2 sm:mt-0">
                <div className="flex items-center">
                  <span className="mr-2 text-sm text-gray-500">Search:</span>
                  <Input
                    type="search"
                    placeholder="Search members..."
                    className="w-48 md:w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-4 py-3 w-10">
                      <Checkbox checked={selectAll} onCheckedChange={toggleSelectAll} />
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Bookings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mr-2"></div>
                          Loading members...
                        </div>
                      </td>
                    </tr>
                  ) : getCurrentPageData().length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                        No members found
                      </td>
                    </tr>
                  ) : (
                    getCurrentPageData().map((member) => (
                      <tr key={member._id} className={`hover:bg-gray-50 ${selectedRows[member._id] ? "bg-blue-50" : ""}`}>
                        <td className="px-4 py-3">
                          <Checkbox
                            checked={selectedRows[member._id] || false}
                            onCheckedChange={() => toggleRowSelection(member._id)}
                            aria-label={`Select member ${member._id}`}
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{member.name}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{member.email}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{member.phone || 'N/A'}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <RoleBadge role={member.role} />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <StatusBadge status={member.status} />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          {new Date(member.cdate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          {member.bookingIds.length}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-4 py-3 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between">
              <div className="text-sm text-gray-700 mb-2 sm:mb-0">
                Showing {filteredMembers.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredMembers.length)} of {filteredMembers.length} entries
              </div>

              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>
          </Card>
        </main>
      </div>
    </div>
  )
}

function RoleBadge({ role }) {
  let bgColor = "bg-gray-100 text-gray-800"
  
  if (role === "admin") {
    bgColor = "bg-red-100 text-red-800"
  } else if (role === "HR") {
    bgColor = "bg-blue-100 text-blue-800"
  } else if (role === "Front Office") {
    bgColor = "bg-green-100 text-green-800"
  } else if (role === "user") {
    bgColor = "bg-purple-100 text-purple-800"
  }

  return <Badge className={`${bgColor} font-medium`}>{role}</Badge>
}

function StatusBadge({ status }) {
  let bgColor = "bg-gray-100 text-gray-800"
  
  if (status === "active") {
    bgColor = "bg-green-100 text-green-800"
  } else if (status === "inactive") {
    bgColor = "bg-red-100 text-red-800"
  }

  return <Badge className={`${bgColor} font-medium`}>{status}</Badge>
}