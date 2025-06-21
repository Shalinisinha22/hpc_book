"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Pagination } from "@/components/pagination"
import { ImagePlus, Plus, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { uploadToCloudinary } from "@/config/cloudinary"
import { API_ROUTES } from "@/config/api"

type Dining = {
  _id: string
  name: string
  image: Array<{ url: string; name: string; ext: string; _id?: string }>
}
type GalleryItem = {
  id: string
  imgId: string | number
  image: string
  diningId: string
  diningName: string
}
type FormData = {
  diningId: string
  photos: File[]
}

export default function DiningsGalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [dinings, setDinings] = useState<Dining[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [formData, setFormData] = useState<FormData>({
    diningId: "",
    photos: [],
  })
  const [photosPreviews, setPhotosPreviews] = useState<string[]>([])

  // Fetch all dinings and flatten images for gallery
  useEffect(() => {
    fetch(`${API_ROUTES.dining}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch dinings")
        const data = await res.json()
        setDinings(data.dinings || data || [])
      
        // Flatten all images for gallery view
        const allImages: GalleryItem[] = []
        ;(data.dinings || data || []).forEach((dining: Dining) => {
          if (dining.image && Array.isArray(dining.image)) {
            dining.image.forEach((img, idx) => {
              allImages.push({
                id: `${dining._id}_${idx}`,
                imgId: img._id || idx,
                image: img.url,
                diningId: dining._id,
                diningName: dining.name,
              })
            })
          }
        })
        setGalleryItems(allImages)
      })
      .catch(() => setGalleryItems([]))
  }, [])

  const handleDiningTypeChange = (value: string) => {
    setFormData({
      ...formData,
      diningId: value,
    })
  }

  const handlePhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[]
    if (files.length > 0) {
      setFormData({
        ...formData,
        photos: [...formData.photos, ...files],
      })

      // Generate previews for all selected files
      const newPreviews: string[] = []
      files.forEach((file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          newPreviews.push(reader.result as string)
          if (newPreviews.length === files.length) {
            setPhotosPreviews([...photosPreviews, ...newPreviews])
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const handleRemovePhoto = (index: number) => {
    const updatedPhotos = [...formData.photos]
    updatedPhotos.splice(index, 1)

    const updatedPreviews = [...photosPreviews]
    updatedPreviews.splice(index, 1)

    setFormData({
      ...formData,
      photos: updatedPhotos,
    })
    setPhotosPreviews(updatedPreviews)
  }

  const handleAddPhotos = async () => {
    if (!formData.diningId) {
      toast({ title: "Missing Dining", description: "Please select a dining", variant: "destructive" })
      return
    }

    if (formData.photos.length === 0) {
      toast({ title: "No Photos Selected", description: "Please upload at least one photo", variant: "destructive" })
      return
    }

    try {
      // Upload all images to Cloudinary
      const uploadedImagesRaw = await Promise.all(
        formData.photos.map((file) => uploadToCloudinary(file, "image"))
      )
      const uploadedImages = uploadedImagesRaw.map(img => ({
        url: img.secure_url,
        name: img.original_filename,
        ext: img.format
      }))

      // Send to backend
      const res = await fetch(`${API_ROUTES.dining}/${formData.diningId}/image`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("auth-token")}` },
        body: JSON.stringify({ images: uploadedImages }),
      })
      if (!res.ok) throw new Error("Failed to add images")
      toast({ title: "Photos Added", description: `${formData.photos.length} photo(s) have been added.` })
      setIsAddDialogOpen(false)
      resetForm()

      // Refresh gallery
      const data = await res.json()
      window.location.reload()
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to add images", variant: "destructive" })
    }
  }

  const handleDeleteClick = (item: GalleryItem) => {
    setSelectedItem(item)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (selectedItem) {
      try {
        const res = await fetch(`${API_ROUTES.dining}/${selectedItem.diningId}/image/${selectedItem.imgId}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${localStorage.getItem("auth-token")}` },
        })
        if (!res.ok) throw new Error("Failed to delete image")
        setGalleryItems(galleryItems.filter((item) => item.id !== selectedItem.id))
        setIsDeleteDialogOpen(false)
        setSelectedItem(null)
        toast({ title: "Photo Deleted", description: "The photo has been deleted successfully" })
      } catch (err: any) {
        toast({ title: "Error", description: err.message || "Failed to delete image", variant: "destructive" })
      }
    }
  }

  const resetForm = () => {
    setFormData({ diningId: "", photos: [] })
    setPhotosPreviews([])
  }

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = galleryItems.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(galleryItems.length / itemsPerPage)

  return (
    <div className="flex-1">
      <div className="flex flex-col gap-4 p-4 md:p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dinings Gallery</h1>
          <p className="text-sm text-gray-500 mt-1">Manage photos of dining areas and food presentations.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Dinings Photos
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
                  <th className="px-4 py-3">Dining Type</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {currentItems.length > 0 ? (
                  currentItems.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{indexOfFirstItem + index + 1}</td>
                      <td className="px-4 py-3">
                        <div className="h-16 w-24 overflow-hidden rounded-md">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={`Dining photo ${item.id}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium">{item.diningName}</td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon" title="Delete" onClick={() => handleDeleteClick(item)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                      No photos found. Add your first dining photo.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {galleryItems.length > itemsPerPage && (
            <div className="border-t bg-white p-4">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          )}
        </div>
      </main>

      {/* Add Photos Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Dinings Photos</DialogTitle>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* Dining Type */}
            <div className="space-y-2">
              <Label htmlFor="diningType">Dining Type</Label>
              <Select value={formData.diningId} onValueChange={handleDiningTypeChange}>
                <SelectTrigger id="diningType">
                  <SelectValue placeholder="Select dining" />
                </SelectTrigger>
                <SelectContent>
                  {dinings.map((dining) => (
                    <SelectItem key={dining._id} value={dining._id}>{dining.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Photos Upload */}
            <div className="space-y-2">
              <Label htmlFor="photos">Upload Photos</Label>
              <div className="border rounded-md p-4 bg-gray-50">
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="photos"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <ImagePlus className="w-8 h-8 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG or WEBP (MAX. 5MB per image)</p>
                    </div>
                    <input
                      id="photos"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotosChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Preview of uploaded photos */}
                {photosPreviews.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Selected Photos ({photosPreviews.length})</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {photosPreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <div className="h-24 w-full overflow-hidden rounded-md">
                            <img
                              src={preview || "/placeholder.svg"}
                              alt={`Preview ${index + 1}`}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
              <Button onClick={handleAddPhotos} className="bg-amber-500 hover:bg-amber-600 text-white">
                Save
              </Button>
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
            <p>Are you sure you want to delete this photo? This action cannot be undone.</p>
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
