"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Printer,
  FileSpreadsheet,
  FileIcon as FilePdf,
  ChevronLeft,
  ChevronRight,
  Plus,
  Pencil,
  Star,
  Search,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import * as XLSX from "xlsx"

export default function UserRatingsPage() {
  const { toast } = useToast()
  const [openDialog, setOpenDialog] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [currentRating, setCurrentRating] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [ratings, setRatings] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Filter ratings based on search query
  const filteredRatings = ratings.filter(
    (rating) =>
      rating.feedbackQuestion.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rating.feedbackAnswer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rating.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rating.memberName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const totalItems = filteredRatings.length
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage))
  const currentRatings = filteredRatings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleOpenDialog = (rating = null) => {
    if (rating) {
      setCurrentRating(rating)
      setIsEditMode(true)
    } else {
      setCurrentRating(null)
      setIsEditMode(false)
    }
    setOpenDialog(true)
  }

  const handleSaveRating = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)

    const ratingData = {
      id: isEditMode ? currentRating.id : ratings.length + 1,
      feedbackQuestion: formData.get("feedbackQuestion"),
      feedbackAnswer: formData.get("feedbackAnswer"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      memberId: formData.get("memberId"),
      memberName: formData.get("memberName"),
      onPage: formData.get("onPage"),
      feedbackDate: formData.get("feedbackDate") || new Date().toISOString().split("T")[0],
      rating: Number.parseInt(formData.get("rating")),
    }

    if (isEditMode) {
      // Update existing rating
      const updatedRatings = ratings.map((rating) => (rating.id === currentRating.id ? ratingData : rating))
      setRatings(updatedRatings)
      toast({
        title: "Rating Updated",
        description: "The user rating has been updated successfully.",
      })
    } else {
      // Add new rating
      setRatings([...ratings, ratingData])
      toast({
        title: "Rating Added",
        description: "The user rating has been added successfully.",
      })
    }

    setOpenDialog(false)
  }

  const handlePrint = () => {
    try {
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
          <title>User Ratings - The Royal Bihar</title>
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
            .stars {
              color: #FFD700;
              letter-spacing: 2px;
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
            <div class="title">User Ratings Report</div>
            <div class="subtitle">Complete list of user feedback and ratings</div>
            <div class="date-time">Generated on: ${currentDate} at ${currentTime}</div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Feedback Question</th>
                <th>Feedback Answer</th>
                <th>Email</th>
                <th>Member Name</th>
                <th>On Page</th>
                <th>Feedback Date</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              ${ratings
                .map(
                  (rating) => `
                <tr>
                  <td>${rating.id}</td>
                  <td>${rating.feedbackQuestion}</td>
                  <td>${rating.feedbackAnswer}</td>
                  <td>${rating.email}</td>
                  <td>${rating.memberName}</td>
                  <td>${rating.onPage}</td>
                  <td>${rating.feedbackDate}</td>
                  <td class="stars">${"★".repeat(rating.rating)}${"☆".repeat(5 - rating.rating)}</td>
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
      }

      toast({
        title: "Print prepared",
        description: "The user ratings data has been prepared for printing.",
      })
    } catch (error) {
      console.error("Failed to print ratings:", error)
      toast({
        title: "Print failed",
        description: "There was an error preparing the ratings for printing.",
        variant: "destructive",
      })
    }
  }

  const handleExportExcel = () => {
    try {
      // Create a new workbook
      const workbook = XLSX.utils.book_new()

      // Convert the data to a worksheet format
      const worksheet = XLSX.utils.json_to_sheet(
        ratings.map((rating) => ({
          ID: rating.id,
          "Feedback Question": rating.feedbackQuestion,
          "Feedback Answer": rating.feedbackAnswer,
          Email: rating.email,
          Phone: rating.phone,
          "Member ID": rating.memberId,
          "Member Name": rating.memberName,
          "On Page": rating.onPage,
          "Feedback Date": rating.feedbackDate,
          Rating: rating.rating,
        })),
      )

      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "User Ratings")

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
      link.download = `user_ratings_${dateStr}_${timeStr}.xlsx`

      // Trigger the download
      document.body.appendChild(link)
      link.click()

      // Clean up
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast({
        title: "Excel export successful!",
        description: `${ratings.length} rating(s) exported to Excel.`,
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
          <title>User Ratings - The Royal Bihar</title>
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
            .stars {
              color: #FFD700;
              letter-spacing: 2px;
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
            <div class="title">User Ratings Report</div>
            <div class="subtitle">Complete list of user feedback and ratings</div>
            <div class="date-time">Generated on: ${currentDate} at ${currentTime}</div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Feedback Question</th>
                <th>Feedback Answer</th>
                <th>Email</th>
                <th>Member Name</th>
                <th>On Page</th>
                <th>Feedback Date</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              ${ratings
                .map(
                  (rating) => `
                <tr>
                  <td>${rating.id}</td>
                  <td>${rating.feedbackQuestion}</td>
                  <td>${rating.feedbackAnswer}</td>
                  <td>${rating.email}</td>
                  <td>${rating.memberName}</td>
                  <td>${rating.onPage}</td>
                  <td>${rating.feedbackDate}</td>
                  <td class="stars">${"★".repeat(rating.rating)}${"☆".repeat(5 - rating.rating)}</td>
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

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const renderStarRating = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`h-4 w-4 ${i < rating ? "text-amber-500 fill-amber-500" : "text-gray-300"}`} />
        ))}
      </div>
    )
  }

  useEffect(() => {
    // Reset to first page when search query changes
    setCurrentPage(1)
  }, [searchQuery, ratings.length]) // Reset on search changes or when ratings array changes

  return (
    <div className="p-4 md:p-6 space-y-6">
      <PageHeader heading="User-ratings" text="Manage user-rating here." />

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Users - rating</h2>
        </div>

        <div className="p-4 border-b border-gray-200 flex flex-wrap justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportExcel}>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Excel
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportPDF}>
              <FilePdf className="h-4 w-4 mr-2" />
              PDF
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={() => handleOpenDialog()} className="bg-amber-500 hover:bg-amber-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Rating
            </Button>

            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-[200px]"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Feedback Question</th>
                <th className="px-4 py-3">Feedback Answer</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Member ID</th>
                <th className="px-4 py-3">Member Name</th>
                <th className="px-4 py-3">On Page</th>
                <th className="px-4 py-3">Feedback Date</th>
                <th className="px-4 py-3">Rating</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentRatings.length > 0 ? (
                currentRatings.map((rating) => (
                  <tr key={rating.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{rating.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{rating.feedbackQuestion}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{rating.feedbackAnswer}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{rating.email}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{rating.phone}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{rating.memberId}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{rating.memberName}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{rating.onPage}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{rating.feedbackDate}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{renderStarRating(rating.rating)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(rating)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={11} className="px-4 py-6 text-center text-sm text-gray-500">
                    No data available in table
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">{totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of{" "}
                <span className="font-medium">{totalItems}</span> entries
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
                  <span className="sr-only">First</span>
                  Previous
                </Button>

                {/* Page numbers would go here */}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Last</span>
                  Next
                </Button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Rating Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-md max-h-[85vh] md:max-h-[90vh] lg:max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {isEditMode ? "Edit User Rating" : "Add User Rating"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveRating} className="space-y-4 py-2">
            <div className="space-y-3 pr-1">
              <div>
                <Label htmlFor="feedbackQuestion">Feedback Question</Label>
                <Input
                  id="feedbackQuestion"
                  name="feedbackQuestion"
                  defaultValue={currentRating?.feedbackQuestion || ""}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="feedbackAnswer">Feedback Answer</Label>
                <Textarea
                  id="feedbackAnswer"
                  name="feedbackAnswer"
                  defaultValue={currentRating?.feedbackAnswer || ""}
                  required
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={currentRating?.email || ""}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" defaultValue={currentRating?.phone || ""} className="mt-1" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="memberId">Member ID</Label>
                  <Input id="memberId" name="memberId" defaultValue={currentRating?.memberId || ""} className="mt-1" />
                </div>

                <div>
                  <Label htmlFor="memberName">Member Name</Label>
                  <Input
                    id="memberName"
                    name="memberName"
                    defaultValue={currentRating?.memberName || ""}
                    required
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="onPage">On Page</Label>
                <Input id="onPage" name="onPage" defaultValue={currentRating?.onPage || ""} required className="mt-1" />
              </div>

              <div>
                <Label htmlFor="feedbackDate">Feedback Date</Label>
                <Input
                  id="feedbackDate"
                  name="feedbackDate"
                  type="date"
                  defaultValue={currentRating?.feedbackDate || new Date().toISOString().split("T")[0]}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="rating">Rating (1-5)</Label>
                <Select name="rating" defaultValue={currentRating?.rating?.toString() || "5"}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Star</SelectItem>
                    <SelectItem value="2">2 Stars</SelectItem>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setOpenDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white">
                {isEditMode ? "Update" : "Save"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
