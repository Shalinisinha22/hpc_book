"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
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
import axios from "axios"
import { uploadToCloudinary } from '@/config/cloudinary';
import { API_ROUTES } from '@/config/api';

interface Hall {
  _id: string;
  hall_name: string;
  hall_image: { url: string; name: string; ext: string; _id: string }[];
}

export default function HallsGalleryPage() {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Halls state
  const [halls, setHalls] = useState<Hall[]>([])

  // Add photo dialog state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedHallId, setSelectedHallId] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // Delete confirmation dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [imageToDelete, setImageToDelete] = useState<{ hallId: string; imageId: string } | null>(null)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Fetch halls on mount
  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const res = await axios.get(API_ROUTES.halls)
        setHalls(res.data.halls || res.data)
      } catch (err) {
        toast({ title: "Error", description: "Failed to load halls", variant: "destructive" })
      }
    }
    fetchHalls()
  }, [])

  // Helper to flatten all images with hall info
  const getAllImages = () => {
    return halls.flatMap((hall) =>
      (hall.hall_image || []).map((img) => ({
        ...img,
        hallId: hall._id,
        hallName: hall.hall_name
      }))
    );
  };

  const totalPages = Math.ceil(getAllImages().length / itemsPerPage)

  // Get current page data (images)
  const getCurrentPageData = () => {
    const allImages = getAllImages();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return allImages.slice(startIndex, endIndex);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle save button click
  const handleSave = async () => {
    if (!selectedHallId) {
      toast({ title: "Hall required", description: "Please select a hall", variant: "destructive" })
      return
    }
    if (!selectedFile) {
      toast({ title: "Image required", description: "Please select an image to upload", variant: "destructive" })
      return
    }
    try {
      // 1. Upload to Cloudinary
      const cloudData = await uploadToCloudinary(selectedFile, 'image');
      const imagePayload = {
        url: cloudData.secure_url,
        name: cloudData.public_id,
        ext: cloudData.format
      };
      const token = localStorage.getItem("auth-token");
      if (!token) throw new Error("Not authenticated");
      // 2. Send to backend
      await axios.post(
        `${API_ROUTES.halls}/${selectedHallId}/image`,
        imagePayload,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      )
      toast({ title: "Image added", description: "The image has been uploaded successfully." })
      setIsAddDialogOpen(false)
      setSelectedHallId("")
      setSelectedFile(null)
      setPreviewUrl(null)
      // Refetch halls to update gallery
      const res = await axios.get(API_ROUTES.halls)
      setHalls(res.data.halls || res.data)
    } catch (err) {
      toast({ title: "Error", description: "Failed to upload image", variant: "destructive" })
    }
  }

  // Handle delete button click
  const handleDelete = (hallId: string, imageId: string) => {
    setImageToDelete({ hallId, imageId })
    setIsDeleteDialogOpen(true)
  }

  // Confirm delete
  const confirmDelete = async () => {
    if (imageToDelete) {
      try {
        await axios.delete(`${API_ROUTES.halls}/${imageToDelete.hallId}/image/${imageToDelete.imageId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth-token")}`
          }
        })
        toast({ title: "Image deleted", description: "The image has been removed from the gallery." })
        // Refetch halls to update gallery
        const res = await axios.get(API_ROUTES.halls)
        setHalls(res.data.halls || res.data)
      } catch (err) {
        toast({ title: "Error", description: "Failed to delete image", variant: "destructive" })
      }
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
                {getCurrentPageData().length > 0 ? (
                  getCurrentPageData().map((img, idx) => (
                    <tr key={img._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                      <td className="px-4 py-4">
                        <div className="h-20 w-32 relative">
                          <Image
                            src={img.url || "/placeholder.svg"}
                            alt={`${img.hallName} image`}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{img.hallName}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500"
                          onClick={() => handleDelete(img.hallId, img._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
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
          {halls.length > 0 && (
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
              <Select value={selectedHallId} onValueChange={setSelectedHallId}>
                <SelectTrigger id="hall-type" className="w-full">
                  <SelectValue placeholder="-- Choose Hall --" />
                </SelectTrigger>
                <SelectContent>
                  {halls.map((hall) => (
                    <SelectItem key={hall._id} value={hall._id}>
                      {hall.hall_name}
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
