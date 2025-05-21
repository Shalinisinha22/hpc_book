"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Check, FileText, Pencil, Plus, Printer, Search } from "lucide-react"
import { PageHeader } from "@/components/page-header"

// Sample data for help requests
const initialHelpRequests = [
  { id: 1, phoneNumber: "8052333237", email: "raazaryan434@gmail.com", requestDate: "2023-05-15" },
  { id: 2, phoneNumber: "0123456789", email: "prashantsee@gmail.com", requestDate: "2023-05-16" },
  { id: 3, phoneNumber: "0123456789", email: "test@gmail.com", requestDate: "2023-05-17" },
  { id: 4, phoneNumber: "9497896091", email: "abhijitlekhmi@gmail.com", requestDate: "2023-05-18" },
  { id: 5, phoneNumber: "8839346176", email: "Arpit.jiva@gmail.com", requestDate: "2023-05-19" },
  { id: 6, phoneNumber: "9549103548", email: "arpit.jiva@gmail.com", requestDate: "2023-05-20" },
  { id: 7, phoneNumber: "9831607756", email: "asimdata@yahoo.com", requestDate: "2023-05-21" },
  { id: 8, phoneNumber: "7752899290", email: "riser0738@gmail.com", requestDate: "2023-05-22" },
  { id: 9, phoneNumber: "9830215442", email: "arkapghosh@yahoo.com", requestDate: "2023-05-23" },
  { id: 10, phoneNumber: "9102409420", email: "amit38.kumar@ril.com", requestDate: "2023-05-24" },
]

export default function HelpCenterPage() {
  const [helpRequests, setHelpRequests] = useState(initialHelpRequests)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [formData, setFormData] = useState({
    id: 0,
    phoneNumber: "",
    email: "",
    requestDate: new Date().toISOString().split("T")[0],
    message: "",
  })
  const { toast } = useToast()

  const itemsPerPage = 10
  const filteredRequests = helpRequests.filter(
    (request) =>
      request.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedRequests = filteredRequests.slice(startIndex, startIndex + itemsPerPage)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleAddRequest = () => {
    const newRequest = {
      id: helpRequests.length > 0 ? Math.max(...helpRequests.map((r) => r.id)) + 1 : 1,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      requestDate: formData.requestDate,
    }

    setHelpRequests([...helpRequests, newRequest])
    setIsAddDialogOpen(false)
    setFormData({
      id: 0,
      phoneNumber: "",
      email: "",
      requestDate: new Date().toISOString().split("T")[0],
      message: "",
    })

    toast({
      title: "Help request added",
      description: "The help request has been added successfully.",
    })
  }

  const handleEditRequest = () => {
    const updatedRequests = helpRequests.map((request) =>
      request.id === formData.id
        ? {
            ...request,
            phoneNumber: formData.phoneNumber,
            email: formData.email,
            requestDate: formData.requestDate,
          }
        : request,
    )

    setHelpRequests(updatedRequests)
    setIsEditDialogOpen(false)
    setFormData({
      id: 0,
      phoneNumber: "",
      email: "",
      requestDate: new Date().toISOString().split("T")[0],
      message: "",
    })

    toast({
      title: "Help request updated",
      description: "The help request has been updated successfully.",
    })
  }

  const openEditDialog = (request) => {
    setFormData({
      id: request.id,
      phoneNumber: request.phoneNumber,
      email: request.email,
      requestDate: request.requestDate,
      message: "",
    })
    setIsEditDialogOpen(true)
  }

  const handlePrint = () => {
    const printWindow = window.open("", "_blank")

    if (!printWindow) {
      toast({
        title: "Error",
        description: "Could not open print window. Please check your popup blocker settings.",
        variant: "destructive",
      })
      return
    }

    // Get the current date and time for the report header
    const currentDate = new Date().toLocaleDateString()
    const currentTime = new Date().toLocaleTimeString()

    // Create the HTML content for printing
    const printContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Customer Help Requests - The Royal Bihar</title>
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
          @media print {
            body {
              padding: 0;
              margin: 0;
            }
            @page {
              margin: 1.5cm;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">The Royal Bihar</div>
          <div class="title">Customer Help Requests Report</div>
          <div class="subtitle">List of customers who requested assistance</div>
          <div class="date-time">Generated on: ${currentDate} at ${currentTime}</div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Phone Number</th>
              <th>Email</th>
              <th>Request Date</th>
            </tr>
          </thead>
          <tbody>
            ${filteredRequests
              .map(
                (request) => `
              <tr>
                <td>${request.id}</td>
                <td>${request.phoneNumber}</td>
                <td>${request.email}</td>
                <td>${request.requestDate}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
        
        <div class="footer">
          <p>This is a system-generated report from The Royal Bihar Hotel Management System.</p>
          <p>For any queries, please contact the system administrator.</p>
        </div>
      </body>
      </html>
    `

    // Write the content to the new window
    printWindow.document.open()
    printWindow.document.write(printContent)
    printWindow.document.close()

    // Wait for content to load before printing
    printWindow.onload = () => {
      printWindow.print()
      // Don't close the window after printing to allow the user to see the print preview
    }

    toast({
      title: "Print prepared",
      description: "The customer help requests data has been prepared for printing.",
    })
  }

  const handleExportExcel = () => {
    try {
      // Create a new workbook
      const XLSX = require("xlsx")
      const workbook = XLSX.utils.book_new()

      // Convert the data to a worksheet format
      const worksheet = XLSX.utils.json_to_sheet(
        filteredRequests.map((request) => ({
          ID: request.id,
          "Phone Number": request.phoneNumber,
          Email: request.email,
          "Request Date": request.requestDate,
        })),
      )

      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Help Requests")

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
      link.download = `help_requests_${dateStr}_${timeStr}.xlsx`

      // Trigger the download
      document.body.appendChild(link)
      link.click()

      // Clean up
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast({
        title: "Excel export successful!",
        description: `${filteredRequests.length} help request(s) exported to Excel.`,
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

  const handleExportPDF = () => {
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
          <title>Customer Help Requests - The Royal Bihar</title>
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
            <div class="logo">The Royal Bihar</div>
            <div class="title">Customer Help Requests Report</div>
            <div class="subtitle">List of customers who requested assistance</div>
            <div class="date-time">Generated on: ${currentDate} at ${currentTime}</div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Phone Number</th>
                <th>Email</th>
                <th>Request Date</th>
              </tr>
            </thead>
            <tbody>
              ${filteredRequests
                .map(
                  (request) => `
                <tr>
                  <td>${request.id}</td>
                  <td>${request.phoneNumber}</td>
                  <td>${request.email}</td>
                  <td>${request.requestDate}</td>
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
            <p>This is a system-generated report from The Royal Bihar Hotel Management System.</p>
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

  useEffect(() => {
    // Reset to first page when search query changes
    setCurrentPage(1)
  }, [searchQuery, helpRequests.length])

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        heading="Customer need help"
        subheading="View Customer requests for help and need assistance. Please respond ASAP on contact details provided by customer here."
      />

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Customer requested for help and need assistance list
          </h2>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportExcel}>
                <FileText className="h-4 w-4 mr-2" />
                Excel
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportPDF}>
                <FileText className="h-4 w-4 mr-2" />
                PDF
              </Button>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Help Request
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[85vh] md:max-h-[90vh] lg:max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add Help Request</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 p-2">
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter email address"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="requestDate">Request Date</Label>
                      <Input
                        id="requestDate"
                        name="requestDate"
                        type="date"
                        value={formData.requestDate}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Help Request Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Enter help request details"
                        rows={4}
                      />
                    </div>
                    <Button onClick={handleAddRequest} className="w-full">
                      <Check className="h-4 w-4 mr-2" />
                      Add Request
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <div className="relative w-full md:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-8 w-full md:w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="p-3 border-b border-gray-200 text-gray-600 font-medium text-sm"></th>
                  <th className="p-3 border-b border-gray-200 text-gray-600 font-medium text-sm">ID</th>
                  <th className="p-3 border-b border-gray-200 text-gray-600 font-medium text-sm">PHONE NUMBER</th>
                  <th className="p-3 border-b border-gray-200 text-gray-600 font-medium text-sm">EMAIL</th>
                  <th className="p-3 border-b border-gray-200 text-gray-600 font-medium text-sm">REQUEST DATE</th>
                  <th className="p-3 border-b border-gray-200 text-gray-600 font-medium text-sm">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRequests.length > 0 ? (
                  paginatedRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="p-3 border-b border-gray-200">
                        <div className="flex items-center justify-center">
                          <Check className="h-4 w-4 text-green-500" />
                        </div>
                      </td>
                      <td className="p-3 border-b border-gray-200">{request.id}</td>
                      <td className="p-3 border-b border-gray-200">{request.phoneNumber}</td>
                      <td className="p-3 border-b border-gray-200">{request.email}</td>
                      <td className="p-3 border-b border-gray-200">{request.requestDate}</td>
                      <td className="p-3 border-b border-gray-200">
                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(request)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-3 text-center border-b border-gray-200">
                      No data available in table
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center mt-4">
            <div className="text-sm text-gray-500 mb-2 md:mb-0">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredRequests.length)} of{" "}
              {filteredRequests.length} entries
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-h-[85vh] md:max-h-[90vh] lg:max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Help Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 p-2">
            <div className="space-y-2">
              <Label htmlFor="edit-phoneNumber">Phone Number</Label>
              <Input
                id="edit-phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Enter phone number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-requestDate">Request Date</Label>
              <Input
                id="edit-requestDate"
                name="requestDate"
                type="date"
                value={formData.requestDate}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-message">Help Request Message</Label>
              <Textarea
                id="edit-message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Enter help request details"
                rows={4}
              />
            </div>
            <Button onClick={handleEditRequest} className="w-full">
              <Check className="h-4 w-4 mr-2" />
              Update Request
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
