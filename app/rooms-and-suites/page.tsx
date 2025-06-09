"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Pencil, Eye, Trash2, Info, Plus, Upload, X } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import Image from "next/image"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Pagination } from "@/components/pagination"
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
import { toast } from "@/components/ui/use-toast"
import { uploadToCloudinary } from '@/config/cloudinary';


interface Room {
  _id: string;  // Changed from 'id' to '_id' to match MongoDB
  room_title: string;
  desc: string;
  max_person: number;
  max_children: number;
  totalRooms: number;
  roomSize: number;
  roomImage: Array<{
    url: string;
    name: string;
    ext: string;
  }>;
  status: 'available' | 'unavailable';
  cdate: string;
}

export default function RoomsAndSuitesPage() {
  // Replace the static rooms array with useState
const [rooms, setRooms] = useState<Room[]>([]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null)
  const [newRoom, setNewRoom] = useState<Partial<Room>>({
    title: "",
    description: "",
    maxPerson: 2,
    maxChildren: 0,
    totalRooms: 1,
    roomSize: 0,
    image: "",
  })

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const totalPages = Math.ceil(rooms.length / itemsPerPage)

  // Get current page data
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return rooms.slice(startIndex, endIndex)
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // For image upload
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null)
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null)
  const newImageInputRef = useRef<HTMLInputElement>(null)
  const editImageInputRef = useRef<HTMLInputElement>(null)



const fetchRooms = async () => {
  try {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      throw new Error("User not authenticated");
    }

    const response = await fetch("http://localhost:8000/api/v1/rooms", {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch rooms");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch rooms error:", error);
    throw error;
  }
};

  const handleAddRoom = async () => {
    try {
      // Handle image upload first
      const imageFile = newImageInputRef.current?.files?.[0];
      let imageData = null;

      if (imageFile) {
        try {
          const cloudinaryResponse = await uploadToCloudinary(imageFile, 'image');
          
          imageData = {
            url: cloudinaryResponse.secure_url,
            name: cloudinaryResponse.public_id,
            ext: cloudinaryResponse.format
          };
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          toast({
            title: 'Error',
            description: 'Failed to upload image. Please try again.',
            variant: 'destructive',
          });
          return;
        }
      }

      console.log('Image data:', imageData);

      // Create room data
      const roomData = {
        room_title: newRoom.title || '',
        desc: newRoom.description || '',
        max_person: Number(newRoom.maxPerson || 0),
        max_children: Number(newRoom.maxChildren || 0),
        totalRooms: Number(newRoom.totalRooms || 0),
        roomSize: Number(newRoom.roomSize || 0),
        status: 'available',
       roomImage: imageData ? [imageData] : [] 
      };

      // Send the request
      const token = localStorage.getItem("auth-token");
      if (!token) throw new Error("Not authenticated");

      const response = await fetch("http://localhost:8000/api/v1/rooms", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(roomData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create room");
      }

      const data = await response.json();
      
      if (data) {
        // Reset form and show success
        setNewRoom({
          title: '',
          description: '',
          maxPerson: 2,
          maxChildren: 0,
          totalRooms: 1,
          roomSize: 0,
          image: '',
        });
        setNewImagePreview(null);
        if (newImageInputRef.current) {
          newImageInputRef.current.value = '';
        }
        setIsAddDialogOpen(false);

        // Refresh rooms list
        const updatedRooms = await fetchRooms();
        setRooms(updatedRooms);

        toast({
          title: 'Success',
          description: 'Room created successfully',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create room',
        variant: 'destructive',
      });
      console.error('Error creating room:', error);
    }
  };


  const convertBlobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(blob);
    });
  }

  const handleEditRoom = async () => {
    try {
      if (!currentRoom) return;

      const formData = new FormData();

      // Upload new image to Cloudinary if exists
      if (editImagePreview) {
        const cloudinaryResponse = await uploadToCloudinary(editImagePreview, 'image');
        console.log('Cloudinary response:', cloudinaryResponse);
        
        formData.append('roomImage', JSON.stringify([{
          url: cloudinaryResponse.secure_url,
          name: cloudinaryResponse.public_id,
          ext: cloudinaryResponse.format
        }]));
      }

      // Add other room data
      formData.append('room_title', currentRoom.room_title);
      formData.append('desc', currentRoom.desc);
      formData.append('max_person', String(currentRoom.max_person));
      formData.append('max_children', String(currentRoom.max_children));
      formData.append('totalRooms', String(currentRoom.totalRooms));
      formData.append('roomSize', String(currentRoom.roomSize));
      formData.append('status', currentRoom.status);

      await updateRoom(currentRoom._id, formData);

      // Refresh the rooms list
      const updatedRooms = await fetchRooms();
      setRooms(updatedRooms);

      setIsEditDialogOpen(false);
      setCurrentRoom(null);
      setEditImagePreview(null);

      toast({
        title: 'Success',
        description: 'Room updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update room',
        variant: 'destructive',
      });
      console.error('Error updating room:', error);
    }
  }

  const handleDeleteRoom = async (id: string) => {
    try {
      await deleteRoom(id);

      // Refresh the rooms list
      const updatedRooms = await fetchRooms();
      setRooms(updatedRooms);

      setIsDeleteDialogOpen(false);
      setRoomToDelete(null);

      toast({
        title: 'Success',
        description: 'Room deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete room',
        variant: 'destructive',
      });
      console.error('Error deleting room:', error);
    }
  }

  const openEditDialog = (room: Room) => {
    setCurrentRoom({ ...room })
    setEditImagePreview(null)
    setIsEditDialogOpen(true)
  }

const handleNewImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    try {
      // Validate file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        throw new Error('File size must be less than 2MB');
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
      }

      // Create preview
      const imageUrl = URL.createObjectURL(file);
      setNewImagePreview(imageUrl);

      // Store file for later upload
      if (newImageInputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        newImageInputRef.current.files = dataTransfer.files;
      }

    } catch (error) {
      console.error('Error handling image:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to process image',
        variant: 'destructive',
      });
      // Clear the input
      if (newImageInputRef.current) {
        newImageInputRef.current.value = '';
      }
    }
  }
}


  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setEditImagePreview(imageUrl)
    }
  }

  const clearNewImage = () => {
    setNewImagePreview(null)
    if (newImageInputRef.current) {
      newImageInputRef.current.value = ""
    }
  }

  const clearEditImage = () => {
    setEditImagePreview(null)
    if (editImageInputRef.current) {
      editImageInputRef.current.value = ""
    }
  }

  const openDeleteDialog = (room: Room) => {
    setRoomToDelete(room)
    setIsDeleteDialogOpen(true)
  }

  
const updateRoom = async (roomId: string, roomData: FormData) => {
  try {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      throw new Error("User not authenticated");
    }

    const formDataObj = Object.fromEntries(roomData.entries());
    console.log("Updating room with data:", formDataObj);

    const response = await fetch(`http://localhost:8000/api/v1/rooms/${roomId}`, {
      method: "PUT",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        room_title: formDataObj.room_title,
        desc: formDataObj.desc,
        max_person: parseInt(formDataObj.max_person as string),
        max_children: parseInt(formDataObj.max_children as string),
        totalRooms: parseInt(formDataObj.totalRooms as string),
        roomSize: parseInt(formDataObj.roomSize as string),
        status: formDataObj.status,
        ...(formDataObj.roomImage && { roomImage: JSON.parse(formDataObj.roomImage as string) })
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update room");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Update room error:", error);
    throw error;
  }
};

const deleteRoom = async (roomId: string) => {
  try {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      throw new Error("User not authenticated");
    }

    const response = await fetch(`http://localhost:8000/api/v1/rooms/${roomId}`, {
      method: "DELETE",
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete room");
    }

    return true;
  } catch (error) {
    console.error("Delete room error:", error);
    throw error;
  }
};

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const fetchedRooms = await fetchRooms();
        setRooms(fetchedRooms);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load rooms',
          variant: 'destructive',
        });
        console.error('Error loading rooms:', error);
      }
    };

    loadRooms();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - hidden on mobile */}
      <Sidebar className="hidden md:flex" activeItem="Rooms & Suites" />

      {/* Main Content */}
      <div className="flex-1">
        <PageHeader />

        <main className="p-4 md:p-6">
          <div className="bg-gold p-4 md:p-6 rounded-t-lg">
            <h1 className="text-xl md:text-2xl font-bold text-white">Manage Rooms & Suites</h1>
            <div className="flex items-start mt-2 text-white">
              <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm">
                Below you can view available room types and their count. Use the Add Room button to add a new room type.
                To edit a room just click on the edit icon.
              </p>
            </div>
          </div>

          <Card className="border-t-0 rounded-t-none">
            <div className="p-4 md:p-6 flex justify-between items-center border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Rooms & Suites</h2>
              <Button className="bg-gold hover:bg-gold-dark" onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Rooms
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="w-[95vw] max-w-[800px] h-auto max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Room</DialogTitle>
                    <DialogDescription>Enter the details for the new room type.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-6 py-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Image Upload - Takes full width on mobile, left column on desktop */}
                      <div className="space-y-2">
                        <Label htmlFor="image">Room Image</Label>
                        {newImagePreview ? (
                          <div className="relative w-full h-48 md:h-64">
                            <Image
                              src={newImagePreview || "/placeholder.svg"}
                              alt="Room preview"
                              fill
                              className="object-cover rounded-md"
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 h-6 w-6 rounded-full"
                              onClick={clearNewImage}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div
                            className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center h-48 md:h-64 cursor-pointer hover:border-gold-light hover:bg-gold/5 transition-colors"
                            onClick={() => newImageInputRef.current?.click()}
                            onDragOver={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              e.currentTarget.classList.add("border-gold", "bg-gold/5")
                            }}
                            onDragLeave={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              e.currentTarget.classList.remove("border-gold", "bg-gold/5")
                            }}
                            onDrop={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              e.currentTarget.classList.remove("border-gold", "bg-gold/5")

                              if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                                const file = e.dataTransfer.files[0]
                                if (file.type.startsWith("image/")) {
                                  const imageUrl = URL.createObjectURL(file)
                                  setNewImagePreview(imageUrl)

                                  // Update the file input
                                  if (newImageInputRef.current) {
                                    const dataTransfer = new DataTransfer()
                                    dataTransfer.items.add(file)
                                    newImageInputRef.current.files = dataTransfer.files
                                  }
                                }
                              }
                            }}
                          >
                            <Upload className="h-10 w-10 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500 mb-2">Click to upload or drag and drop</p>
                            <p className="text-xs text-gray-400">SVG, PNG, JPG or GIF (max. 2MB)</p>
                          </div>
                        )}
                        <Input
                          id="image"
                          type="file"
                          accept="image/*"
                          ref={newImageInputRef}
                          onChange={handleNewImageChange}
                          className={newImagePreview ? "hidden" : ""}
                        />
                      </div>

                      {/* Right column on desktop - Basic info */}
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Room Title</Label>
                          <Input
                            id="title"
                            value={newRoom.title}
                            onChange={(e) => setNewRoom({ ...newRoom, title: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={newRoom.description}
                            onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                            className="min-h-[100px]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Bottom section - Room details in a 2x2 grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="maxPerson">Max Person</Label>
                        <Input
                          id="maxPerson"
                          type="number"
                          value={newRoom.maxPerson || 0}
                          onChange={(e) => setNewRoom({ 
                            ...newRoom, 
                            maxPerson: e.target.value ? Number(e.target.value) : 0 
                          })}
                          min="0"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="maxChildren">Max Children</Label>
                        <Input
                          id="maxChildren"
                          type="number"
                          value={newRoom.maxChildren || 0}
                          onChange={(e) => setNewRoom({ 
                            ...newRoom, 
                            maxChildren: e.target.value ? Number(e.target.value) : 0 
                          })}
                          min="0"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="totalRooms">Total Rooms</Label>
                        <Input
                          id="totalRooms"
                          type="number"
                          value={newRoom.totalRooms || 0}
                          onChange={(e) => setNewRoom({ 
                            ...newRoom, 
                            totalRooms: e.target.value ? Number(e.target.value) : 0 
                          })}
                          min="0"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="roomSize">Room Size (sq ft)</Label>
                        <Input
                          id="roomSize"
                          type="number"
                          value={newRoom.roomSize || 0}
                          onChange={(e) => setNewRoom({ 
                            ...newRoom, 
                            roomSize: e.target.value ? Number(e.target.value) : 0 
                          })}
                          min="0"
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter className="sm:justify-end">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAddDialogOpen(false)
                        setNewImagePreview(null)
                      }}
                    >
                      Cancel
                    </Button>
                    <Button className="bg-gold hover:bg-gold-dark" onClick={handleAddRoom}>
                      Add Room
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Room Title</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Max. Person
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Max. Children
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Rooms
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Room Size</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {getCurrentPageData().map((room, index) => (
                    <tr key={room._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="h-16 w-16 rounded-full overflow-hidden">
                         
                          <Image
                            src={room.roomImage?.[0]?.url || "/placeholder.svg"}
                            alt={room.room_title}
                            width={64}
                            height={64}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {room.room_title}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700 max-w-xs truncate">
                        {room.desc}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                        {room.max_person}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                        {room.max_children}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                        {room.totalRooms}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                        {room.roomSize}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-gray-500"
                                  onClick={() => openEditDialog(room)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Edit Room</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>View Details</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-red-500"
                                  onClick={() => openDeleteDialog(room)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Delete Room</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {getCurrentPageData().length === 0 && (
                    <tr>
                      <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                        No rooms found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Add pagination component */}
            {rooms.length > 0 && (
              <div className="p-4 border-t border-gray-200">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
              </div>
            )}
          </Card>
        </main>
      </div>

      {/* Edit Room Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="w-[95vw] max-w-[800px] h-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Room</DialogTitle>
            <DialogDescription>Update the details for this room type.</DialogDescription>
          </DialogHeader>
          {currentRoom && (
            <div className="grid gap-6 py-4">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Image Upload - Takes full width on mobile, left column on desktop */}
                <div className="space-y-2">
                  <Label htmlFor="edit-image">Room Image</Label>
                  {editImagePreview ? (
                    <div className="relative w-full h-48 md:h-64">
                      <Image
                        src={editImagePreview || "/placeholder.svg"}
                        alt="Room preview"
                        fill
                        className="object-cover rounded-md"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6 rounded-full"
                        onClick={clearEditImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div
                      className="relative w-full h-48 md:h-64 cursor-pointer"
                      onClick={() => editImageInputRef.current?.click()}
                      onDragOver={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        e.currentTarget.classList.add("ring-2", "ring-gold")
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        e.currentTarget.classList.remove("ring-2", "ring-gold")
                      }}
                      onDrop={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        e.currentTarget.classList.remove("ring-2", "ring-gold")

                        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                          const file = e.dataTransfer.files[0]
                          if (file.type.startsWith("image/")) {
                            const imageUrl = URL.createObjectURL(file)
                            setEditImagePreview(imageUrl)

                            // Update the file input
                            if (editImageInputRef.current) {
                              const dataTransfer = new DataTransfer()
                              dataTransfer.items.add(file)
                              editImageInputRef.current.files = dataTransfer.files
                            }
                          }
                        }
                      }}
                    >
                      <Image
                        src={currentRoom.roomImage?.[0]?.url || "/placeholder.svg"}
                        alt="Current room image"
                        fill
                        className="object-cover rounded-md"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <p className="text-white text-sm">Click or drag image to change</p>
                      </div>
                    </div>
                  )}
                  <Input
                    id="edit-image"
                    type="file"
                    accept="image/*"
                    ref={editImageInputRef}
                    onChange={handleEditImageChange}
                  />
                </div>

                {/* Right column on desktop - Basic info */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-title">Room Title</Label>
                    <Input
                      id="edit-title"
                      value={currentRoom.room_title}
                      onChange={(e) => setCurrentRoom({ ...currentRoom, room_title: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-description">Description</Label>
                    <Textarea
                      id="edit-description"
                      value={currentRoom.desc}
                      onChange={(e) => setCurrentRoom({ ...currentRoom, desc: e.target.value })}
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom section - Room details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-maxPerson">Max Person</Label>
                  <Input
                    id="edit-maxPerson"
                    type="number"
                    value={currentRoom.max_person || 0}
                    onChange={(e) => setCurrentRoom({ 
                      ...currentRoom, 
                      max_person: e.target.value ? Number(e.target.value) : 0 
                    })}
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-maxChildren">Max Children</Label>
                  <Input
                    id="edit-maxChildren"
                    type="number"
                    value={currentRoom.max_children || 0}
                    onChange={(e) => setCurrentRoom({ 
                      ...currentRoom, 
                      max_children: e.target.value ? Number(e.target.value) : 0 
                    })}
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-totalRooms">Total Rooms</Label>
                  <Input
                    id="edit-totalRooms"
                    type="number"
                    value={currentRoom.totalRooms || 0}
                    onChange={(e) => setCurrentRoom({ 
                      ...currentRoom, 
                      totalRooms: e.target.value ? Number(e.target.value) : 0 
                    })}
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-roomSize">Room Size (sq ft)</Label>
                  <Input
                    id="edit-roomSize"
                    type="number"
                    value={currentRoom.roomSize || 0}
                    onChange={(e) => setCurrentRoom({ 
                      ...currentRoom, 
                      roomSize: e.target.value ? Number(e.target.value) : 0 
                    })}
                    min="0"
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="sm:justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false)
                setEditImagePreview(null)
              }}
            >
              Cancel
            </Button>
            <Button className="bg-gold hover:bg-gold-dark" onClick={handleEditRoom}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this room?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to delete &quot;{roomToDelete?.title}&quot;. This action cannot be undone and all data
              associated with this room will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRoomToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={() => roomToDelete && handleDeleteRoom(roomToDelete._id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}



