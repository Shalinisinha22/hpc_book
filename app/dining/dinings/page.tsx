"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Pagination } from "@/components/pagination"
import { ImagePlus, Plus, Trash2, User, Pencil,Eye } from "lucide-react"
import RichTextEditor from "@/components/rich-text-editor"
import { uploadToCloudinary } from "@/config/cloudinary"
import { API_BASE_URL,API_ROUTES } from "@/config/api"

// Backend Dining type (align with Mongoose schema)
type Dining = {
  _id: string
  name: string
  shortIntro: string
  description: string
  breakfastTiming?: string
  lunchDinnerTiming?: string
  avgPriceFor2: number
  phone?: string
  location?: string
  image: Array<{ url: string; name: string; ext: string }>
  cdate?: string
}

type DiningForm = {
  name: string
  shortIntro: string
  description: string
  breakfastTiming?: string
  lunchDinnerTiming?: string
  avgPriceFor2: string
  phone?: string
  location?: string
  images: File[]
}

// Helper: generate time options (every 30 min)
const timeOptions = [
  ...Array.from({ length: 24 * 2 }, (_, i) => {
    const hour = Math.floor(i / 2)
    const min = i % 2 === 0 ? "00" : "30"
    const ampm = hour < 12 ? "AM" : "PM"
    const hour12 = hour % 12 === 0 ? 12 : hour % 12
    return `${hour12}:${min} ${ampm}`
  })
]

export default function DiningsPage() {
  const [dinings, setDinings] = useState<Dining[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedDining, setSelectedDining] = useState<Dining | null>(null)
  const [editFormData, setEditFormData] = useState<DiningForm | null>(null)
  const [editId, setEditId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const itemsPerPage = 5

  // Form state
  const [formData, setFormData] = useState<DiningForm>({
    name: "",
    shortIntro: "",
    description: "",
    breakfastTiming: "",
    lunchDinnerTiming: "",
    avgPriceFor2: "",
    phone: "",
    location: "",
    images: [],
  })

  // Preview images
  const [imagePreview, setImagePreview] = useState("")

  // For time range selection
  const [breakfastStart, setBreakfastStart] = useState("")
  const [breakfastEnd, setBreakfastEnd] = useState("")
  const [lunchStart, setLunchStart] = useState("")
  const [lunchEnd, setLunchEnd] = useState("")

  // Fetch dinings from backend
  useEffect(() => {
    setLoading(true)
    fetch(`${API_ROUTES.dining}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch dinings")
        const data = await res.json()
      console.log("Fetched dinings:", data)
        setDinings(data || [])
        setError(null)
      })
      .catch((err) => {
        setError(err.message)
        setDinings([])
      })
      .finally(() => setLoading(false))
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleDescriptionChange = (content: string) => {
    setFormData({
      ...formData,
      description: content,
    })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setFormData({
        ...formData,
        images: Array.from(files),
      })
    }
  }

  // Add new dining (with Cloudinary upload)
  const handleAddDining = async () => {
    if (
      !formData.name ||
      !formData.shortIntro ||
      !formData.avgPriceFor2 ||
      !formData.location ||
      formData.images.length === 0
    ) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields and upload at least one image",
        variant: "destructive",
      })
      return
    }
    setLoading(true)
    try {
      // Upload all images to Cloudinary and map to { url, name, ext }
      const uploadedImagesRaw = await Promise.all(
        formData.images.map((file) => uploadToCloudinary(file, "image"))
      )
      const uploadedImages = uploadedImagesRaw.map(img => ({
        url: img.secure_url,
        name: img.original_filename,
        ext: img.format
      }))
      // Prepare payload for backend
      const payload = {
        name: formData.name,
        shortIntro: formData.shortIntro,
        description: formData.description.replace(/<[^>]+>/g, '').trim(), // strip HTML tags
        breakfastTiming: formData.breakfastTiming,
        lunchDinnerTiming: formData.lunchDinnerTiming,
        avgPriceFor2: Number(formData.avgPriceFor2),
        phone: formData.phone,
        location: formData.location,
        image: uploadedImages,
      }
      const res = await fetch(`${API_ROUTES.dining}`, {
        method: "POST",
        headers: { "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("auth-token")}` 
         },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error("Failed to add dining")
      const data = await res.json()
      setDinings((prev) => [...prev, data.dining])
      setIsAddDialogOpen(false)
      resetForm()
      toast({
        title: "Dining Added",
        description: `${formData.name} has been added successfully`,
      })
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to add dining",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (dining: Dining) => {
    setSelectedDining(dining)
    setIsDeleteDialogOpen(true)
  }

  // Delete dining via backend
  const handleDeleteConfirm = async () => {
    if (!selectedDining) return
    setLoading(true)
    try {
      const res = await fetch(`${API_ROUTES.dining}/${selectedDining._id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete dining")
      setDinings((prev) => prev.filter((d) => d._id !== selectedDining._id))
      setIsDeleteDialogOpen(false)
      setSelectedDining(null)
      toast({
        title: "Dining Deleted",
        description: `${selectedDining.name} has been deleted successfully`,
      })
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to delete dining",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // View handler
  const handleViewClick = (dining: Dining) => {
    setSelectedDining(dining)
    setIsViewDialogOpen(true)
  }
  // Edit handler
  const handleEditClick = (dining: Dining) => {
    setEditId(dining._id)
    setEditFormData({
      name: dining.name,
      shortIntro: dining.shortIntro,
      description: dining.description,
      breakfastTiming: dining.breakfastTiming || "",
      lunchDinnerTiming: dining.lunchDinnerTiming || "",
      avgPriceFor2: dining.avgPriceFor2.toString(),
      phone: dining.phone || "",
      location: dining.location,
      images: [], // images not re-uploaded unless changed
    })
    setIsEditDialogOpen(true)
  }
  // Edit form change
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editFormData) return
    const { name, value } = e.target
    setEditFormData({ ...editFormData, [name]: value })
  }
  const handleEditDescriptionChange = (content: string) => {
    if (!editFormData) return
    setEditFormData({ ...editFormData, description: content })
  }
  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editFormData) return
    const files = e.target.files
    if (files && files.length > 0) {
      setEditFormData({ ...editFormData, images: Array.from(files) })
    }
  }
  // Edit submit
  const handleEditSubmit = async () => {
    if (!editFormData || !editId) return
    setLoading(true)
    try {
      let uploadedImages = undefined
      if (editFormData.images.length > 0) {
        const uploadedImagesRaw = await Promise.all(
          editFormData.images.map((file) => uploadToCloudinary(file, "image"))
        )
        uploadedImages = uploadedImagesRaw.map(img => ({
          url: img.secure_url,
          name: img.original_filename,
          ext: img.format
        }))
      }
      const payload = {
        name: editFormData.name,
        shortIntro: editFormData.shortIntro,
        description: editFormData.description.replace(/<[^>]+>/g, '').trim(),
        breakfastTiming: editFormData.breakfastTiming,
        lunchDinnerTiming: editFormData.lunchDinnerTiming,
        avgPriceFor2: Number(editFormData.avgPriceFor2),
        phone: editFormData.phone,
        location: editFormData.location,
        ...(uploadedImages ? { image: uploadedImages } : {}),
      }
      const res = await fetch(`${API_ROUTES.dining}/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("auth-token")}` },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error("Failed to update dining")
      const data = await res.json()
      setDinings((prev) => prev.map(d => d._id === editId ? data.dining : d))
      setIsEditDialogOpen(false)
      setEditFormData(null)
      setEditId(null)
      toast({ title: "Dining Updated", description: `${editFormData.name} has been updated.` })
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to update dining", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      shortIntro: "",
      description: "",
      breakfastTiming: "",
      lunchDinnerTiming: "",
      avgPriceFor2: "",
      phone: "",
      location: "",
      images: [],
    })
    setImagePreview("")
    // Reset time pickers
    setBreakfastStart("")
    setBreakfastEnd("")
    setLunchStart("")
    setLunchEnd("")
  }

  // When time range changes, update formData
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      breakfastTiming: breakfastStart && breakfastEnd ? `${breakfastStart} - ${breakfastEnd}` : "",
      lunchDinnerTiming: lunchStart && lunchEnd ? `${lunchStart} - ${lunchEnd}` : "",
    }))
  }, [breakfastStart, breakfastEnd, lunchStart, lunchEnd])

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
          <Button onClick={() => setIsAddDialogOpen(true)} disabled={loading}>
            <Plus className="mr-2 h-4 w-4" /> Add Dining
          </Button>
        </div>
      </div>

      <main className="p-4 md:p-6">
        <div className="rounded-lg border bg-white shadow-sm">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading...</div>
            ) : error ? (
              <div className="p-8 text-center text-red-500">{error}</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Image</th>
                    <th className="px-4 py-3">Dining Name</th>
                    <th className="px-4 py-3">Short Intro</th>
                    <th className="px-4 py-3">Description</th>
                    <th className="px-4 py-3">Breakfast Timing</th>
                    <th className="px-4 py-3">Lunch & Dinner Timing</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {currentItems.length > 0 ? (
                    currentItems.map((dining, index) => (
                      <tr key={dining._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">{indexOfFirstItem + index + 1}</td>
                        <td className="px-4 py-3">
                          <div className="h-12 w-16 overflow-hidden rounded-md">
                            <img
                              src={dining.image && dining.image.length > 0 ? dining.image[0].url : "/placeholder.svg"}
                              alt={dining.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium">{dining.name}</td>
                        <td className="px-4 py-3">{dining.shortIntro}</td>
                        <td className="px-4 py-3 max-w-xs truncate">{dining.description}</td>
                        <td className="px-4 py-3">{dining.breakfastTiming || <span className="text-gray-400">—</span>}</td>
                        <td className="px-4 py-3">{dining.lunchDinnerTiming || <span className="text-gray-400">—</span>}</td>
                        <td className="px-4 py-3">{dining.phone}</td>
                        <td className="px-4 py-3">{dining.location}</td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon" title="View" onClick={() => handleViewClick(dining)}>
                                  <Eye className="h-4 w-4" />
                               
                            </Button>
                            <Button variant="ghost" size="icon" title="Edit" onClick={() => handleEditClick(dining)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" title="Delete" onClick={() => handleDeleteClick(dining)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )
                  : (
                    <tr>
                      <td colSpan={10} className="px-4 py-16 text-center text-gray-400">
                        <div className="flex flex-col items-center gap-2">
                          <ImagePlus className="w-10 h-10 mb-2 text-gray-300" />
                          <span className="text-lg font-semibold">No dining options found</span>
                          <span className="text-sm">Get started by adding your first dining option.</span>
                          <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" /> Add Dining
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
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
              <RichTextEditor value={formData.description} onChange={handleDescriptionChange} />
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Breakfast Timing */}
              <div className="space-y-2">
                <Label>Breakfast Timing</Label>
                <div className="flex gap-2">
                  <select
                    className="border rounded px-2 py-1 w-full"
                    value={breakfastStart}
                    onChange={e => setBreakfastStart(e.target.value)}
                  >
                    <option value="">Start</option>
                    {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <span className="self-center">to</span>
                  <select
                    className="border rounded px-2 py-1 w-full"
                    value={breakfastEnd}
                    onChange={e => setBreakfastEnd(e.target.value)}
                  >
                    <option value="">End</option>
                    {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              {/* Lunch/Dinner Timing */}
              <div className="space-y-2">
                <Label>Lunch/Dinner Timing</Label>
                <div className="flex gap-2">
                  <select
                    className="border rounded px-2 py-1 w-full"
                    value={lunchStart}
                    onChange={e => setLunchStart(e.target.value)}
                  >
                    <option value="">Start</option>
                    {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <span className="self-center">to</span>
                  <select
                    className="border rounded px-2 py-1 w-full"
                    value={lunchEnd}
                    onChange={e => setLunchEnd(e.target.value)}
                  >
                    <option value="">End</option>
                    {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Average Price for 2 */}
            <div className="space-y-2">
              <Label htmlFor="avgPriceFor2">Average Price for 2</Label>
              <Input
                id="avgPriceFor2"
                name="avgPriceFor2"
                type="number"
                value={formData.avgPriceFor2}
                onChange={handleInputChange}
                placeholder="e.g., 2500"
              />
            </div>
            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="images">Upload Images</Label>
              <Input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="cursor-pointer"
              />
              <p className="text-xs text-gray-500 mt-1">
                Upload one or more images of the dining area (PNG or JPG)
              </p>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddDialogOpen(false)
                  resetForm()
                }}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button onClick={handleAddDining} disabled={loading}>Save</Button>
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
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={loading}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteConfirm} disabled={loading}>
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Dining Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Dining Details</DialogTitle>
          </DialogHeader>
          {selectedDining && (
            <div className="grid gap-4 py-2">
              <div className="flex gap-4">
                <div className="h-32 w-48 overflow-hidden rounded-md bg-gray-100 flex items-center justify-center">
                  <img src={selectedDining.image && selectedDining.image.length > 0 ? selectedDining.image[0].url : "/placeholder.svg"} alt={selectedDining.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 space-y-2">
                  <div><span className="font-semibold">Name:</span> {selectedDining.name}</div>
                  <div><span className="font-semibold">Short Intro:</span> {selectedDining.shortIntro}</div>
                  <div><span className="font-semibold">Description:</span> {selectedDining.description}</div>
                  <div><span className="font-semibold">Breakfast Timing:</span> {selectedDining.breakfastTiming || <span className="text-gray-400">—</span>}</div>
                  <div><span className="font-semibold">Lunch/Dinner Timing:</span> {selectedDining.lunchDinnerTiming || <span className="text-gray-400">—</span>}</div>
                  <div><span className="font-semibold">Avg Price for 2:</span> ₹{selectedDining.avgPriceFor2}</div>
                  <div><span className="font-semibold">Phone:</span> {selectedDining.phone}</div>
                  <div><span className="font-semibold">Location:</span> {selectedDining.location}</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dining Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Dining</DialogTitle>
          </DialogHeader>
          {editFormData && (
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Dining Name</Label>
                  <Input id="name" name="name" value={editFormData.name} onChange={handleEditInputChange} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="shortIntro">Short Introduction</Label>
                <Input id="shortIntro" name="shortIntro" value={editFormData.shortIntro} onChange={handleEditInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <RichTextEditor value={editFormData.description} onChange={handleEditDescriptionChange} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" value={editFormData.phone} onChange={handleEditInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" name="location" value={editFormData.location} onChange={handleEditInputChange} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Breakfast Timing</Label>
                  <Input name="breakfastTiming" value={editFormData.breakfastTiming} onChange={handleEditInputChange} placeholder="e.g., 7:00 AM - 10:30 AM" />
                </div>
                <div className="space-y-2">
                  <Label>Lunch/Dinner Timing</Label>
                  <Input name="lunchDinnerTiming" value={editFormData.lunchDinnerTiming} onChange={handleEditInputChange} placeholder="e.g., 12:00 PM - 11:00 PM" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="avgPriceFor2">Average Price for 2</Label>
                <Input id="avgPriceFor2" name="avgPriceFor2" type="number" value={editFormData.avgPriceFor2} onChange={handleEditInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="images">Current Images</Label>
                <div className="flex flex-wrap gap-2">
                  {editId && dinings.find(d => d._id === editId)?.image?.length > 0 ? (
                    dinings.find(d => d._id === editId)!.image.map((img, idx) => (
                      <img
                        key={img.url + idx}
                        src={img.url}
                        alt={img.name}
                        className="h-20 w-32 object-cover rounded border"
                      />
                    ))
                  ) : (
                    <span className="text-gray-400">No images</span>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="images">Upload New Images (optional)</Label>
                <Input id="images" type="file" accept="image/*" multiple onChange={handleEditImageChange} className="cursor-pointer" />
                <p className="text-xs text-gray-500 mt-1">Upload new images to replace existing ones.</p>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={loading}>Cancel</Button>
                <Button onClick={handleEditSubmit} disabled={loading}>Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
