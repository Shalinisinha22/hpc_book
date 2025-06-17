"use client"

import { useState, useEffect } from "react"
import { API_ROUTES } from "@/config/api"
import { Hall } from "@/types/hall"
import { uploadToCloudinary } from "@/config/cloudinary"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
import { Plus, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { AddHallForm } from "@/components/add-hall-form"
import { apiCall } from "@/lib/api-utils"
import { withAuth } from "@/components/withAuth"
import { useTokenErrorHandler } from "@/hooks/useTokenErrorHandler"
import { add } from "date-fns"

function HallsPage() {
  const [halls, setHalls] = useState<Hall[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddHallOpen, setIsAddHallOpen] = useState(false)
  const [editingHall, setEditingHall] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [hallToDelete, setHallToDelete] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()
  const { handleApiError } = useTokenErrorHandler()

  // Helper function to convert base64 data URL to File object
  const dataURLtoFile = (dataurl: string, filename: string): File => {
    const arr = dataurl.split(',')
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png'
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, { type: mime })
  }

  // Fetch halls from API
  const fetchHalls = async () => {
    try {
      const responseData = await apiCall(API_ROUTES.halls, {
        method: "GET",
      })

      // Check if response has the expected structure
      if (responseData.success && Array.isArray(responseData.data)) {
        setHalls(responseData.data)
      } else if (Array.isArray(responseData)) {
        // Handle case where API returns array directly
        setHalls(responseData)
      } else {
        throw new Error("Invalid response format")
      }
    } catch (error) {
      console.error("Fetch halls error:", error)
      
      // Use the token error handler to handle authentication errors
      handleApiError(error, "Failed to fetch halls")
      setHalls([]) // Set empty array on error
    } finally {
      setIsLoading(false)
    }
  }

  // Create new hall
  const handleAddHall = async (data: any) => {
    try {
      const token = localStorage.getItem("auth-token");
      if (!token) throw new Error("Not authenticated");

      // Debug: Log the incoming data to see what we're working with
      console.log('handleAddHall received data:', data);
      console.log('data.image type:', typeof data.image);

      // Handle image upload with proper validation
      let imageData = null;
      if (data.image) {
        try {
          let fileToUpload: File;

          // Check if it's a File object
          if (data.image instanceof File) {
            console.log('File details:', {
              name: data.image.name,
              type: data.image.type,
              size: data.image.size
            });

            // Check if it's actually an image
            if (!data.image.type.startsWith('image/')) {
              throw new Error('Selected file is not an image. Please select an image file.');
            }

            // Check file size (optional - adjust limit as needed)
            if (data.image.size > 10 * 1024 * 1024) { // 10MB limit
              throw new Error('Image file is too large. Please select an image smaller than 10MB.');
            }

            fileToUpload = data.image;
          }
          // Check if it's a blob URL
          else if (typeof data.image === 'string' && data.image.startsWith('blob:')) {
            console.log('Processing blob URL...');
            fileToUpload = data.image; // uploadToCloudinary can handle blob URLs
          }
          // Check if it's a base64 data URL
          else if (typeof data.image === 'string' && data.image.startsWith('data:image/')) {
            console.log('Processing base64 data URL...');
            
            // Convert base64 to File object
            const filename = `hall-image-${Date.now()}.png`;
            fileToUpload = dataURLtoFile(data.image, filename);
            
            console.log('Converted to File:', {
              name: fileToUpload.name,
              type: fileToUpload.type,
              size: fileToUpload.size
            });

            // Check file size after conversion
            if (fileToUpload.size > 10 * 1024 * 1024) { // 10MB limit
              throw new Error('Image file is too large. Please select an image smaller than 10MB.');
            }
          }
          else {
            console.error('Invalid image format. Expected File object, blob URL, or base64 data URL, got:', typeof data.image);
            throw new Error('Invalid image format. Please select a valid image file.');
          }

          console.log('Uploading image to Cloudinary...');
          const cloudinaryResponse = await uploadToCloudinary(fileToUpload, 'image');
          
          if (!cloudinaryResponse || !cloudinaryResponse.secure_url) {
            throw new Error('Failed to upload image to Cloudinary');
          }
          
          console.log('Cloudinary upload successful:', cloudinaryResponse);
          
          imageData = {
            url: cloudinaryResponse.secure_url,
            name: cloudinaryResponse.public_id,
            ext: cloudinaryResponse.format
          };
        } catch (uploadError) {
          console.error('Image upload error:', uploadError);
          toast({
            title: "Error",
            description: uploadError instanceof Error ? uploadError.message : "Failed to upload image. Please try again.",
            variant: "destructive",
          });
          return;
        }
      } else {
        console.log('No image provided, proceeding without image');
      }

      const hallData = {
        hall_name: data.name,
        max_capacity: Number(data.maxCapacity),
        short_intro: data.shortIntro,
        desc: data.description,
        length: Number(data.length),
        breadth: Number(data.breadth),
        height: Number(data.height),
        area: Number(data.area),
        guest_entry_point: data.guestEntryPoint,
        phone:data.phone,
        email:data.email,
        seating: {
          theatre: Number(data.seatingStyles.theater) || 0,
          ushaped: Number(data.seatingStyles.uShaped) || 0,
          boardroom: Number(data.seatingStyles.boardroom) || 0,
          classroom: Number(data.seatingStyles.classroom) || 0,
          reception: Number(data.seatingStyles.reception) || 0
        },
        hall_image: imageData ? [imageData] : [],
        additionalDetails: data.additionalDetails || [],
        status: "available"
      };

      console.log('Sending hall data to API:', hallData);

      const response = await fetch(`${API_ROUTES.halls}/create`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(hallData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create hall");
      }

      const result = await response.json();
      console.log('Hall created successfully:', result);

      await fetchHalls();
      setIsAddHallOpen(false);
      toast({
        title: "Success",
        description: "Hall created successfully",
      });
    } catch (error) {
      console.error("Create hall error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create hall",
        variant: "destructive",
      });
    }
  }

  const handleEditHall = (hall) => {
    setEditingHall(hall)
    setIsAddHallOpen(true)
  }

  // Update existing hall
  const handleUpdateHall = async (data: any) => {
    try {
      setIsUpdating(true);
      const token = localStorage.getItem("auth-token");
      if (!token) throw new Error("Not authenticated");

      console.log('handleUpdateHall received data:', data);
      console.log('data.image type:', typeof data.image);

      // Handle image upload with proper validation (only if new image is provided)
      let imageData = null;
      if (data.image) {
        try {
          let fileToUpload: File;

          // Check if it's a File object
          if (data.image instanceof File) {
            console.log('File details:', {
              name: data.image.name,
              type: data.image.type,
              size: data.image.size
            });

            // Check if it's actually an image
            if (!data.image.type.startsWith('image/')) {
              throw new Error('Selected file is not an image. Please select an image file.');
            }

            // Check file size
            if (data.image.size > 10 * 1024 * 1024) { // 10MB limit
              throw new Error('Image file is too large. Please select an image smaller than 10MB.');
            }

            fileToUpload = data.image;
          }
          // Check if it's a blob URL
          else if (typeof data.image === 'string' && data.image.startsWith('blob:')) {
            console.log('Processing blob URL...');
            fileToUpload = data.image;
          }
          // Check if it's a base64 data URL
          else if (typeof data.image === 'string' && data.image.startsWith('data:image/')) {
            console.log('Processing base64 data URL...');
            
            const filename = `hall-image-${Date.now()}.png`;
            fileToUpload = dataURLtoFile(data.image, filename);
            
            console.log('Converted to File:', {
              name: fileToUpload.name,
              type: fileToUpload.type,
              size: fileToUpload.size
            });

            if (fileToUpload.size > 10 * 1024 * 1024) {
              throw new Error('Image file is too large. Please select an image smaller than 10MB.');
            }
          }
          else {
            console.error('Invalid image format for update:', typeof data.image);
            throw new Error('Invalid image format. Please select a valid image file.');
          }

          console.log('Uploading updated image to Cloudinary...');
          const cloudinaryResponse = await uploadToCloudinary(fileToUpload, 'image');
          
          if (!cloudinaryResponse || !cloudinaryResponse.secure_url) {
            throw new Error('Failed to upload image to Cloudinary');
          }
          
          console.log('Cloudinary upload successful:', cloudinaryResponse);
          
          imageData = {
            url: cloudinaryResponse.secure_url,
            name: cloudinaryResponse.public_id,
            ext: cloudinaryResponse.format
          };
        } catch (uploadError) {
          console.error('Image upload error:', uploadError);
          toast({
            title: "Error",
            description: uploadError instanceof Error ? uploadError.message : "Failed to upload image. Please try again.",
            variant: "destructive",
          });
          return;
        }
      }

      const hallData = {
        hall_name: data.name,
        max_capacity: Number(data.maxCapacity),
        short_intro: data.shortIntro,
        desc: data.description,
        length: Number(data.length),
        breadth: Number(data.breadth),
        height: Number(data.height),
        area: Number(data.area),
        guest_entry_point: data.guestEntryPoint,
        phone:data.phone,
        email:data.email,
        seating: {
          theatre: Number(data.seatingStyles.theater) || 0,
          ushaped: Number(data.seatingStyles.uShaped) || 0,
          boardroom: Number(data.seatingStyles.boardroom) || 0,
          classroom: Number(data.seatingStyles.classroom) || 0,
          reception: Number(data.seatingStyles.reception) || 0
        },
        additionalDetails:data.additionalDetails || [],
        status: "available",
        // Only include hall_image if new image was uploaded
        ...(imageData && { hall_image: [imageData] })
      };

      console.log('Sending updated hall data to API:', hallData);

      const response = await fetch(`${API_ROUTES.halls}/${data.id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(hallData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update hall");
      }

      const result = await response.json();
      console.log('Hall updated successfully:', result);

      await fetchHalls();
      setIsAddHallOpen(false);
      setEditingHall(null);
      toast({
        title: "Success",
        description: "Hall updated successfully",
      });
    } catch (error) {
      console.error("Update hall error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update hall",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  }

  const showDeleteConfirmation = (hall) => {
    setHallToDelete(hall)
    setIsDeleteDialogOpen(true)
  }

  // Delete hall
  const handleDeleteHall = async (id: string) => {
    try {
      setIsDeleting(true);
      const token = localStorage.getItem("auth-token");
      if (!token) throw new Error("Not authenticated");

      console.log('Deleting hall with ID:', id);

      const response = await fetch(`${API_ROUTES.halls}/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete hall");
      }

      const result = await response.json();
      console.log('Hall deleted successfully:', result);

      await fetchHalls();
      setIsDeleteDialogOpen(false);
      setHallToDelete(null);
      toast({
        title: "Success",
        description: "Hall deleted successfully",
      });
    } catch (error) {
      console.error("Delete hall error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete hall",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  // Load halls on mount
  useEffect(() => {
    fetchHalls()
  }, [])

  return (
    <div className="p-6">
      <PageHeader
        heading="Manage Halls"
        text="Below you can view available halls. Use the Add Hall button to add a new hall type. To edit a hall just click on the edit icon."
      />

      <div className="bg-white rounded-lg shadow p-6 mt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Halls</h2>
          <Button
            onClick={() => {
              setEditingHall(null)
              setIsAddHallOpen(true)
            }}
            className="bg-orange-500 hover:bg-orange-600"
            disabled={isUpdating}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Halls
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="py-3 px-4 text-left">#</th>
                <th className="py-3 px-4 text-left">IMAGE</th>
                <th className="py-3 px-4 text-left">HALL NAME</th>
                <th className="py-3 px-4 text-left">MAX CAPACITY</th>
                <th className="py-3 px-4 text-left">SHORT INTRO</th>
                <th className="py-3 px-4 text-left">DESCRIPTION</th>
                <th className="py-3 px-4 text-left">DIMENSIONS</th>
                <th className="py-3 px-4 text-left">AREA</th>
                <th className="py-3 px-4 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-gray-500">
                    Loading halls...
                  </td>
                </tr>
              ) : halls.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-gray-500">
                    No halls found. Add your first hall using the button above.
                  </td>
                </tr>
              ) : (
                halls.map((hall, index) => (
                  <tr key={hall._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden">
                        <img
                          src={hall.hall_image?.[0]?.url || "/placeholder.svg?height=64&width=64&query=hall"}
                          alt={hall.hall_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4">{hall.hall_name}</td>
                    <td className="py-3 px-4">{hall.max_capacity}</td>
                    <td className="py-3 px-4 max-w-[200px] truncate">{hall.short_intro}</td>
                    <td
                      className="py-3 px-4 max-w-[200px] truncate"
                      dangerouslySetInnerHTML={{ __html: hall.desc }}
                    ></td>
                    <td className="py-3 px-4">{`${hall.length}x${hall.breadth}x${hall.height}`}</td>
                    <td className="py-3 px-4">{hall.area}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center space-x-2">
                        <button 
                          onClick={() => handleEditHall(hall)} 
                          className="p-1 hover:bg-gray-100 rounded-full"
                          disabled={isUpdating || isDeleting}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => showDeleteConfirmation(hall)}
                          className="p-1 hover:bg-gray-100 rounded-full"
                          disabled={isUpdating || isDeleting}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isAddHallOpen} onOpenChange={setIsAddHallOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingHall ? (isUpdating ? "Updating Hall..." : "Edit Hall") : "Add Hall"}
            </DialogTitle>
          </DialogHeader>
          <AddHallForm
            onSubmit={editingHall ? handleUpdateHall : handleAddHall}
            initialData={editingHall}
            onCancel={() => {
              setIsAddHallOpen(false)
              setEditingHall(null)
            }}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this hall?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete "{hallToDelete?.hall_name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => hallToDelete && handleDeleteHall(hallToDelete._id)}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default withAuth(HallsPage)