"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Pagination } from "@/components/pagination"
import { ImagePlus, Plus, Trash2, User, Pencil } from "lucide-react"
import RichTextEditor from "@/components/rich-text-editor"

// Sample data for dinings
const initialDinings = [
  {
    id: 1,
    image: "/elegant-hotel-dining.png",
    logo: "/royal-bihar-logo.png",
    name: "Royal Spice",
    shortIntro: "Authentic Indian Cuisine",
    description:
      "Experience the rich flavors of India with our authentic dishes prepared by master chefs using traditional recipes and premium ingredients.",
    phone: "+91 1234567890",
    location: "Ground Floor, East Wing",
    avgPrice: "₹2,500",
  },
  {
    id: 2,
    image: "/city-lights-hotel.png",
    logo: "/generic-indian-emblem.png",
    name: "Panorama Lounge",
    shortIntro: "International Fusion",
    description:
      "A sophisticated dining experience with panoramic city views, offering a fusion of international cuisines crafted with locally sourced ingredients.",
    phone: "+91 9876543210",
    location: "15th Floor, Rooftop",
    avgPrice: "₹3,200",
  },
]

export default function DiningsPage() {
  const [dinings, setDinings] = useState(initialDinings)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedDining, setSelectedDining] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    shortIntro: "",
    description: "",
    phone: "",
    location: "",
    avgPrice: "",
    logo: null,
    image: null,
  })

  // Preview images
  const [logoPreview, setLogoPreview] = useState("")
  const [imagePreview, setImagePreview] = useState("")

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleDescriptionChange = (content) => {
    setFormData({
      ...formData,
      description: content,
    })
  }

  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({
        ...formData,
        logo: file,
      })
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({
        ...formData,
        image: file,
      })
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddDining = () => {
    // Validate form
    if (
      !formData.name ||
      !formData.shortIntro ||
      !formData.description ||
      !formData.phone ||
      !formData.location ||
      !formData.avgPrice
    ) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    if (!formData.logo || !formData.image) {
      toast({
        title: "Missing Images",
        description: "Please upload both logo and image",
        variant: "destructive",
      })
      return
    }

    // Add new dining
    const newDining = {
      id: dinings.length + 1,
      image: imagePreview || "/elegant-hotel-dining.png", // Use preview or fallback
      logo: logoPreview || "/royal-bihar-logo.png", // Use preview or fallback
      name: formData.name,
      shortIntro: formData.shortIntro,
      description: formData.description,
      phone: formData.phone,
      location: formData.location,
      avgPrice: formData.avgPrice,
    }

    setDinings([...dinings, newDining])
    setIsAddDialogOpen(false)
    resetForm()

    toast({
      title: "Dining Added",
      description: `${formData.name} has been added successfully`,
    })
  }

  const handleDeleteClick = (dining) => {
    setSelectedDining(dining)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (selectedDining) {
      setDinings(dinings.filter((dining) => dining.id !== selectedDining.id))
      setIsDeleteDialogOpen(false)
      setSelectedDining(null)

      toast({
        title: "Dining Deleted",
        description: `${selectedDining.name} has been deleted successfully`,
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      shortIntro: "",
      description: "",
      phone: "",
      location: "",
      avgPrice: "",
      logo: null,
      image: null,
    })
    setLogoPreview("")
    setImagePreview("")
  }

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = dinings.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(dinings.length / itemsPerPage)

  return (
    <div className="flex-1">
      <div className="flex flex-col gap-4 p-4 md:p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dinings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage dining options and restaurants in your hotel.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Dining
          </Button>
        </div>
      </div>

      <main className="p-4 md:p-6">
        <div className="rounded-lg border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Image</th>
                  <th className="px-4 py-3">Logo</th>
                  <th className="px-4 py-3">Dining Name</th>
                  <th className="px-4 py-3">Short Intro</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {currentItems.length > 0 ? (
                  currentItems.map((dining, index) => (
                    <tr key={dining.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{indexOfFirstItem + index + 1}</td>
                      <td className="px-4 py-3">
                        <div className="h-12 w-16 overflow-hidden rounded-md">
                          <img
                            src={dining.image || "/placeholder.svg"}
                            alt={dining.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-10 w-10 overflow-hidden rounded-full bg-white">
                          <img
                            src={dining.logo || "/placeholder.svg"}
                            alt={`${dining.name} logo`}
                            className="h-full w-full object-contain"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium">{dining.name}</td>
                      <td className="px-4 py-3">{dining.shortIntro}</td>
                      <td className="px-4 py-3 max-w-xs truncate">{dining.description}</td>
                      <td className="px-4 py-3">{dining.phone}</td>
                      <td className="px-4 py-3">{dining.location}</td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon" title="View">
                            <User className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Edit">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Delete" onClick={() => handleDeleteClick(dining)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                      No dining options found. Add your first dining option.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {dinings.length > itemsPerPage && (
            <div className="border-t bg-white p-4">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          )}
        </div>
      </main>

      {/* Add Dining Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Dining</DialogTitle>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Logo Upload */}
              <div className="space-y-2">
                <Label htmlFor="logo">Header Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="border rounded-md p-2 flex items-center justify-center h-24 w-24 bg-gray-50">
                    {logoPreview ? (
                      <img
                        src={logoPreview || "/placeholder.svg"}
                        alt="Logo Preview"
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <ImagePlus className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <Input
                      id="logo"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-gray-500 mt-1">Upload a square logo image (PNG or JPG)</p>
                  </div>
                </div>
              </div>

              {/* Dining Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Dining Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Royal Spice"
                />
              </div>
            </div>

            {/* Short Intro */}
            <div className="space-y-2">
              <Label htmlFor="shortIntro">Short Introduction</Label>
              <Input
                id="shortIntro"
                name="shortIntro"
                value={formData.shortIntro}
                onChange={handleInputChange}
                placeholder="e.g., Authentic Indian Cuisine"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <RichTextEditor id="description" value={formData.description} onChange={handleDescriptionChange} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="e.g., +91 1234567890"
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Ground Floor, East Wing"
                />
              </div>
            </div>

            {/* Average Price */}
            <div className="space-y-2">
              <Label htmlFor="avgPrice">Average Price for 2</Label>
              <Input
                id="avgPrice"
                name="avgPrice"
                value={formData.avgPrice}
                onChange={handleInputChange}
                placeholder="e.g., ₹2,500"
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="image">Upload Image</Label>
              <div className="flex items-center gap-4">
                <div className="border rounded-md p-2 flex items-center justify-center h-32 w-48 bg-gray-50">
                  {imagePreview ? (
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Image Preview"
                      className="max-h-full max-w-full object-cover"
                    />
                  ) : (
                    <ImagePlus className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Upload a high-quality image of the dining area (16:9 ratio recommended)
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddDialogOpen(false)
                  resetForm()
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleAddDining}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to delete <strong>{selectedDining?.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2 pt-6">
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteConfirm}>
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
