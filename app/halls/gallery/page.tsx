"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Info, Trash2, ImageIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"
import { Pagination } from "@/components/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
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

interface GalleryImage {
  id: number
  imageUrl: string
  hallType: string
}

export default function HallsGalleryPage() {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Gallery images state
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([
    { id: 1, imageUrl: "/hall-swarn-mahal.png", hallType: "Swarn Mahal" },
    { id: 2, imageUrl: "/hall-crystal.png", hallType: "Crystal" },
    { id: 3, imageUrl: "/hall-suloon.png", hallType: "Suloon" },
    { id: 4, imageUrl: "/hall-magadh.png", hallType: "Magadh" },
    { id: 5, imageUrl: "/hall-mithila.png", hallType: "Mithila" },
    { id: 6, imageUrl: "/grand-hallway.png", hallType: "Swarn Mahal" },
  ])

  // Add photo dialog state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedHallType, setSelectedHallType] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // Delete confirmation dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [imageToDelete, setImageToDelete] = useState<number | null>(null)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const totalPages = Math.ceil(galleryImages.length / itemsPerPage)

  // Hall types
  const hallTypes = ["Swarn Mahal", "Crystal", "Suloon", "Magadh", "Mithila"]

  // Get current page data
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return galleryImages.slice(startIndex, endIndex)
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)

      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle save button click
  const handleSave = () => {
    if (!selectedHallType) {
      toast({
        title: "Hall type required",
        description: "Please select a hall type",
        variant: "destructive",
      })
      return
    }

    if (!selectedFile && !previewUrl) {
      toast({
        title: "Image required",
        description: "Please select an image to upload",
        variant: "destructive",
      })
      return
    }

    // In a real app, you would upload the file to a server here
    // For now, we'll just add it to our state with the preview URL

    const newImage: GalleryImage = {
      id: galleryImages.length > 0 ? Math.max(...galleryImages.map((img) => img.id)) + 1 : 1,
      imageUrl: previewUrl || "/grand-hallway.png",
      hallType: selectedHallType,
    }

    setGalleryImages([...galleryImages, newImage])

    // Reset form and close dialog
    setSelectedHallType("")
    setSelectedFile(null)
    setPreviewUrl(null)
    setIsAddDialogOpen(false)

    toast({
      title: "Image added",
      description: "The image has been added to the gallery successfully.",
    })
  }

  // Handle delete button click
  const handleDelete = (id: number) => {
    setImageToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  // Confirm delete
  const confirmDelete = () => {
    if (imageToDelete !== null) {
      const updatedGallery = galleryImages.filter((img) => img.id !== imageToDelete)
      setGalleryImages(updatedGallery)

      toast({
        title: "Image deleted",
        description: "The image has been removed from the gallery.",
      })
    }
    setIsDeleteDialogOpen(false)
    setImageToDelete(null)
  }

  return (
    <div className="flex-1">
      <PageHeader />

      <main className="p-4 md:p-6">
        <div className="bg-gold p-4 md:p-6 rounded-t-lg flex justify-between items-center">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white">Halls Gallery</h1>
            <div className="flex items-start mt-2 text-white">
              <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm">Manage your hall photos here. You can add new photos or delete existing ones.</p>
            </div>
          </div>
          <Button className="bg-white text-gold hover:bg-gray-100" onClick={() => setIsAddDialogOpen(true)}>
            <ImageIcon className="h-4 w-4 mr-2" />
            Add Halls Photos
          </Button>
        </div>

        <Card className="border-t-0 rounded-t-none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Hall Type</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {getCurrentPageData().map((image, index) => (
                  <tr key={image.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-20 w-32 relative">
                        <Image
                          src={image.imageUrl || "/placeholder.svg?height=80&width=128&query=hall"}
                          alt={`${image.hallType} image`}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{image.hallType}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500"
                        onClick={() => handleDelete(image.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}

                {getCurrentPageData().length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                      No images found in the gallery
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {galleryImages.length > 0 && (
            <div className="p-4 border-t border-gray-200">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>
          )}
        </Card>
      </main>

      {/* Add Photo Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Halls Photos</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <label htmlFor="hall-type" className="block text-sm font-medium text-gray-700">
                Hall Type
              </label>
              <Select value={selectedHallType} onValueChange={setSelectedHallType}>
                <SelectTrigger id="hall-type" className="w-full">
                  <SelectValue placeholder="-- Choose Hall Type --" />
                </SelectTrigger>
                <SelectContent>
                  {hallTypes.map((hallType) => (
                    <SelectItem key={hallType} value={hallType}>
                      {hallType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Upload Photos</label>
              <div className="flex items-center gap-2">
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                <div className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-gray-500 text-sm">
                  {selectedFile ? selectedFile.name : "Choose file"}
                </div>
                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                  Browse
                </Button>
              </div>

              {previewUrl && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                  <div className="relative h-40 w-full">
                    <Image
                      src={previewUrl || "/placeholder.svg?height=160&width=320&query=hall"}
                      alt="Preview"
                      fill
                      className="object-contain rounded-md"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-gold hover:bg-gold/90" onClick={handleSave}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the image from the gallery.
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
