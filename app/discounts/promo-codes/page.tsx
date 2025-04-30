"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { CalendarIcon, Trash2 } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
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
import { Pagination } from "@/components/pagination"

// Mock data for rooms
const roomOptions = [
  { id: 1, name: "Deluxe Room" },
  { id: 2, name: "Executive Suite" },
  { id: 3, name: "Presidential Suite" },
  { id: 4, name: "Family Room" },
  { id: 5, name: "Standard Room" },
]

// Mock data for promo code types
const typeOptions = [
  { id: "percent", name: "Percent" },
  { id: "fixed", name: "Fixed Amount" },
]

export default function PromoCodesPage() {
  const { toast } = useToast()
  const [promoCodes, setPromoCodes] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [promoToDelete, setPromoToDelete] = useState(null)

  // Form state
  const [formData, setFormData] = useState({
    room: "",
    dateFrom: null,
    dateTo: null,
    promoCode: "",
    discount: "",
    type: "percent",
  })

  // Load promo codes on mount
  useEffect(() => {
    // In a real app, this would be an API call
    // For now, we'll use mock data
    const mockPromoCodes = [
      {
        id: 1,
        room: "Deluxe Room",
        dateFrom: new Date(2023, 5, 1),
        dateTo: new Date(2023, 8, 30),
        promoCode: "SUMMER23",
        type: "percent",
        discount: "15",
      },
      {
        id: 2,
        room: "Executive Suite",
        dateFrom: new Date(2023, 11, 20),
        dateTo: new Date(2024, 0, 5),
        promoCode: "HOLIDAY50",
        type: "fixed",
        discount: "50",
      },
      {
        id: 3,
        room: "Family Room",
        dateFrom: new Date(2023, 9, 1),
        dateTo: new Date(2023, 9, 31),
        promoCode: "FALL25",
        type: "percent",
        discount: "25",
      },
    ]

    setPromoCodes(mockPromoCodes)
    setTotalPages(Math.ceil(mockPromoCodes.length / 10))
  }, [])

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate form
    if (!formData.room || !formData.dateFrom || !formData.dateTo || !formData.promoCode || !formData.discount) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    // Create new promo code
    const newPromoCode = {
      id: Date.now(),
      room: roomOptions.find((room) => room.id.toString() === formData.room)?.name || formData.room,
      dateFrom: formData.dateFrom,
      dateTo: formData.dateTo,
      promoCode: formData.promoCode,
      type: formData.type,
      discount: formData.discount,
    }

    // Add to list
    setPromoCodes([...promoCodes, newPromoCode])

    // Reset form
    setFormData({
      room: "",
      dateFrom: null,
      dateTo: null,
      promoCode: "",
      discount: "",
      type: "percent",
    })

    // Show success message
    toast({
      title: "Success",
      description: "Promo code added successfully",
    })
  }

  // Handle delete
  const handleDelete = (id) => {
    const promoToDelete = promoCodes.find((promo) => promo.id === id)
    setPromoToDelete(promoToDelete)
    setIsDeleteDialogOpen(true)
  }

  // Confirm delete
  const confirmDelete = () => {
    if (promoToDelete) {
      const updatedPromoCodes = promoCodes.filter((promo) => promo.id !== promoToDelete.id)
      setPromoCodes(updatedPromoCodes)
      setTotalPages(Math.ceil(updatedPromoCodes.length / 10))

      toast({
        title: "Success",
        description: "Promo code deleted successfully",
      })
    }
    setIsDeleteDialogOpen(false)
    setPromoToDelete(null)
  }

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title="Manage Promo Codes"
        description="Create different promo codes for any room during a certain time of the year. The promo code discount can be either in % or fixed amount. Just click on the 'Add Promo code' button and fill in the form."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Promo Codes Table */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Promo Codes</h2>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      #
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Room
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date From
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date To
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Promo Code
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Discount
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {promoCodes.length > 0 ? (
                    promoCodes.map((promo, index) => (
                      <tr key={promo.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-4 px-4 text-sm">{index + 1}</td>
                        <td className="py-4 px-4 text-sm">{promo.room}</td>
                        <td className="py-4 px-4 text-sm">{format(promo.dateFrom, "MM/dd/yyyy")}</td>
                        <td className="py-4 px-4 text-sm">{format(promo.dateTo, "MM/dd/yyyy")}</td>
                        <td className="py-4 px-4 text-sm font-medium">{promo.promoCode}</td>
                        <td className="py-4 px-4 text-sm">{promo.type === "percent" ? "Percent" : "Fixed Amount"}</td>
                        <td className="py-4 px-4 text-sm">
                          {promo.type === "percent" ? `${promo.discount}%` : `$${promo.discount}`}
                        </td>
                        <td className="py-4 px-4 text-sm">
                          <button onClick={() => handleDelete(promo.id)} className="text-red-500 hover:text-red-700">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-4 px-4 text-center text-sm text-gray-500">
                        No promo codes found. Add your first promo code.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {promoCodes.length > 0 && (
              <div className="mt-4">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
              </div>
            )}
          </div>
        </div>

        {/* Add Promo Code Form */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Add Promo Code</h2>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Room Selection */}
                <div>
                  <label htmlFor="room" className="block text-sm font-medium text-gray-700 mb-1">
                    Room
                  </label>
                  <Select value={formData.room} onValueChange={(value) => handleInputChange("room", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="-- Choose --" />
                    </SelectTrigger>
                    <SelectContent>
                      {roomOptions.map((room) => (
                        <SelectItem key={room.id} value={room.id.toString()}>
                          {room.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date From */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.dateFrom ? format(formData.dateFrom, "MM/dd/yyyy") : <span>mm/dd/yyyy</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.dateFrom}
                        onSelect={(date) => handleInputChange("dateFrom", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Date To */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.dateTo ? format(formData.dateTo, "MM/dd/yyyy") : <span>mm/dd/yyyy</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.dateTo}
                        onSelect={(date) => handleInputChange("dateTo", date)}
                        initialFocus
                        disabled={(date) => (formData.dateFrom ? date < formData.dateFrom : false)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Promo Code */}
                <div>
                  <label htmlFor="promoCode" className="block text-sm font-medium text-gray-700 mb-1">
                    Promo Code
                  </label>
                  <Input
                    id="promoCode"
                    value={formData.promoCode}
                    onChange={(e) => handleInputChange("promoCode", e.target.value)}
                    placeholder="Promo Code"
                  />
                </div>

                {/* Discount */}
                <div>
                  <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-1">
                    Discount
                  </label>
                  <Input
                    id="discount"
                    value={formData.discount}
                    onChange={(e) => handleInputChange("discount", e.target.value)}
                    placeholder="Discount"
                    type="number"
                  />
                </div>

                {/* Type */}
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {typeOptions.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full bg-gold hover:bg-gold/90 text-white">
                  Save
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the promo code "{promoToDelete?.promoCode}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
