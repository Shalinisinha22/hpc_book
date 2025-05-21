"use client"

import { useState, useEffect } from "react"
import { Info, Trash2, Calendar } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pagination } from "@/components/pagination"
import { format } from "date-fns"
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
import { useToast } from "@/components/ui/use-toast"

interface SpecialTariff {
  id: number
  dateFrom: string
  dateTo: string
  room: string
  price: number
}

export default function SpecialTariffsPage() {
  const { toast } = useToast()

  const [specialTariffs, setSpecialTariffs] = useState<SpecialTariff[]>([
    { id: 1, dateFrom: "2024-09-09", dateTo: "2024-09-11", room: "Deluxe Room", price: 6500 },
    { id: 2, dateFrom: "2025-04-10", dateTo: "2025-04-12", room: "Standard Room", price: 6000 },
    { id: 3, dateFrom: "2025-04-10", dateTo: "2025-04-12", room: "Premium Suite", price: 20000 },
    { id: 4, dateFrom: "2025-04-10", dateTo: "2025-04-12", room: "Premium Room", price: 7500 },
    { id: 5, dateFrom: "2025-04-10", dateTo: "2025-04-12", room: "Deluxe Room", price: 6700 },
    { id: 6, dateFrom: "2025-04-10", dateTo: "2025-04-12", room: "Deluxe Suite", price: 16200 },
    { id: 7, dateFrom: "2025-04-10", dateTo: "2025-04-12", room: "Big Family Rooms", price: 22000 },
    { id: 8, dateFrom: "2025-05-15", dateTo: "2025-05-20", room: "Premium Suite", price: 22000 },
    { id: 9, dateFrom: "2025-05-15", dateTo: "2025-05-20", room: "The Royal Pent House", price: 35000 },
    { id: 10, dateFrom: "2025-06-01", dateTo: "2025-06-10", room: "Deluxe Suite", price: 18000 },
    { id: 11, dateFrom: "2025-06-01", dateTo: "2025-06-10", room: "Premium Room", price: 8500 },
    { id: 12, dateFrom: "2025-07-20", dateTo: "2025-07-25", room: "Standard Room", price: 6500 },
  ])

  // Form state
  const [selectedRoom, setSelectedRoom] = useState<string>("")
  const [dateFrom, setDateFrom] = useState<string>("")
  const [dateTo, setDateTo] = useState<string>("")
  const [price, setPrice] = useState<string>("")

  // Delete confirmation dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [tariffToDelete, setTariffToDelete] = useState<number | null>(null)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 7
  const totalPages = Math.ceil(specialTariffs.length / itemsPerPage)

  // Add this effect after the other state declarations
  useEffect(() => {
    // Reset to first page when data changes
    setCurrentPage(1)
  }, [specialTariffs.length])

  // Get current page data
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return specialTariffs.slice(startIndex, endIndex)
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Room types
  const roomTypes = [
    "Standard Room",
    "Premium Room",
    "Premium Suite",
    "Deluxe Room",
    "Deluxe Suite",
    "The Royal Pent House",
    "Studio Flat",
    "Big Family Rooms",
  ]

  // Handle form submission
  const handleSave = () => {
    if (!selectedRoom || !dateFrom || !dateTo || !price) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    if (new Date(dateFrom) > new Date(dateTo)) {
      toast({
        title: "Invalid date range",
        description: "Start date cannot be after end date",
        variant: "destructive",
      })
      return
    }

    if (isNaN(Number(price)) || Number(price) <= 0) {
      toast({
        title: "Invalid price",
        description: "Please enter a valid price",
        variant: "destructive",
      })
      return
    }

    // Add new special tariff
    const newId = specialTariffs.length > 0 ? Math.max(...specialTariffs.map((tariff) => tariff.id)) + 1 : 1
    const newTariff: SpecialTariff = {
      id: newId,
      dateFrom,
      dateTo,
      room: selectedRoom,
      price: Number(price),
    }

    setSpecialTariffs([...specialTariffs, newTariff])

    // Reset form
    setSelectedRoom("")
    setDateFrom("")
    setDateTo("")
    setPrice("")

    toast({
      title: "Special tariff added",
      description: `Special tariff for ${selectedRoom} has been added successfully.`,
    })
  }

  // Handle delete
  const handleDelete = (id: number) => {
    setTariffToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (tariffToDelete !== null) {
      const updatedTariffs = specialTariffs.filter((tariff) => tariff.id !== tariffToDelete)
      setSpecialTariffs(updatedTariffs)

      // If the current page becomes empty after deletion, go back a page if possible
      const newTotalPages = Math.ceil(updatedTariffs.length / itemsPerPage)
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages)
      }

      toast({
        title: "Special tariff deleted",
        description: "The special tariff has been deleted successfully.",
      })
    }
    setIsDeleteDialogOpen(false)
    setTariffToDelete(null)
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, "yyyy-MM-dd")
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - hidden on mobile */}
      <Sidebar className="hidden md:flex" activeItem="Special Tariffs" />

      {/* Main Content */}
      <div className="flex-1">
        <PageHeader />

        <main className="p-4 md:p-6">
          <div className="bg-gold p-4 md:p-6 rounded-t-lg">
            <h1 className="text-xl md:text-2xl font-bold text-white">Set Special Tariffs</h1>
            <div className="flex items-start mt-2 text-white">
              <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm">
                Here you can set selected rooms tariff for a predefined period of time. Rooms with "Special tariff"
                would be available for bookings.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Special Tariffs List */}
            <div className="lg:col-span-2">
              <Card className="border-t-0 rounded-t-none">
                <div className="p-4 md:p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Special Tariffs</h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 text-left">
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date From
                        </th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date To
                        </th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {getCurrentPageData().map((tariff, index) => (
                        <tr key={tariff.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                            {formatDate(tariff.dateFrom)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                            {formatDate(tariff.dateTo)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{tariff.room}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{tariff.price}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-500"
                              onClick={() => handleDelete(tariff.id)}
                            >
                              <Trash2 className="h-4 w-4 text-gray-400" />
                            </Button>
                          </td>
                        </tr>
                      ))}

                      {getCurrentPageData().length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                            No special tariffs found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {specialTariffs.length > 0 && (
                  <div className="p-4 border-t border-gray-200">
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                  </div>
                )}
              </Card>
            </div>

            {/* Add Form */}
            <div>
              <Card className="border-t-0 rounded-t-none lg:rounded-t-lg lg:border-t">
                <div className="p-4 md:p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Add</h2>
                </div>

                <div className="p-4 md:p-6 space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="room-select" className="block text-sm font-medium text-gray-700">
                      Room
                    </label>
                    <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                      <SelectTrigger id="room-select" className="w-full">
                        <SelectValue placeholder="-- Choose --" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {roomTypes.map((roomType) => (
                          <SelectItem key={roomType} value={roomType}>
                            {roomType}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="date-from" className="block text-sm font-medium text-gray-700">
                      Date From
                    </label>
                    <div className="relative">
                      <Input
                        id="date-from"
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="w-full"
                      />
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="date-to" className="block text-sm font-medium text-gray-700">
                      Date To
                    </label>
                    <div className="relative">
                      <Input
                        id="date-to"
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="w-full"
                      />
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                      Price
                    </label>
                    <Input
                      id="price"
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full"
                      placeholder="Enter price"
                    />
                  </div>

                  <Button className="w-full bg-gold hover:bg-gold-dark" onClick={handleSave}>
                    Save
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the special tariff.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
