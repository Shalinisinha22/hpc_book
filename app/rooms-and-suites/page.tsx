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
  _id: string;
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
    pricePerNight: number; 
  // roomView: 'City View' | 'Garden View' | 'Pool View' | 'Ocean View' | 'Mountain View';
  bedType: 'Single' | 'Double' | 'Queen' | 'King' | 'Twin';
  amenities: string[];
  additionalDetails: string[];
  status: 'available' | 'unavailable';
  cdate: string;
}
export default function RoomsAndSuitesPage() {
  // Replace the static rooms array with useState
const [rooms, setRooms] = useState<Room[]>([]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null)
  const [newAmenity, setNewAmenity] = useState('')
  const [newDetail, setNewDetail] = useState('')
  const [newRoom, setNewRoom] = useState<Partial<Room>>({
    title: "",
    description: "",
    maxPerson: 2,
    maxChildren: 0,
    totalRooms: 1,
    roomSize: 0,
    pricePerNight: 0, 
    roomView: "City View",
    bedType: "Single",
    amenities: [],
    additionalDetails: [],
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
        pricePerNight: Number(newRoom.pricePerNight),
        // roomView: newRoom.roomView,
        bedType: newRoom.bedType,
        amenities: newRoom.amenities || [],
        additionalDetails: newRoom.additionalDetails || [],
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
          // roomView: 'City View',
          bedType: 'Single',
          amenities: [],
          additionalDetails: [],
          pricePerNight: 0
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

      // Create the update data object
      const updateData = {
        room_title: currentRoom.room_title,
        desc: currentRoom.desc,
        max_person: Number(currentRoom.max_person),
        max_children: Number(currentRoom.max_children),
        totalRooms: Number(currentRoom.totalRooms),
        roomSize: Number(currentRoom.roomSize),
        status: currentRoom.status,
        bedType: currentRoom.bedType,
        pricePerNight: Number(currentRoom.pricePerNight),
        // Ensure amenities and additionalDetails are arrays
        amenities: Array.isArray(currentRoom.amenities) 
          ? currentRoom.amenities 
          : [],
        additionalDetails: Array.isArray(currentRoom.additionalDetails) 
          ? currentRoom.additionalDetails 
          : []
      };

      // Handle image update if there's a new image
      if (editImagePreview) {
        const cloudinaryResponse = await uploadToCloudinary(editImagePreview, 'image');
        updateData.roomImage = [{
          url: cloudinaryResponse.secure_url,
          name: cloudinaryResponse.public_id,
          ext: cloudinaryResponse.format
        }];
      }

      // Send update request
      const response = await fetch(`http://localhost:8000/api/v1/rooms/${currentRoom._id}`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("auth-token")}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update room");
      }

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
      console.error("Update room error:", error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update room',
        variant: 'destructive',
      });
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
    // Parse amenities and additionalDetails if they're strings
    let parsedAmenities = room.amenities;
    let parsedAdditionalDetails = room.additionalDetails;

    // Handle string case (when it comes as JSON string)
    if (typeof room.amenities === 'string') {
      try {
        parsedAmenities = JSON.parse(room.amenities);
      } catch (e) {
        console.error('Error parsing amenities:', e);
        parsedAmenities = [];
      }
    }

    if (typeof room.additionalDetails === 'string') {
      try {
        parsedAdditionalDetails = JSON.parse(room.additionalDetails);
      } catch (e) {
        console.error('Error parsing additional details:', e);
        parsedAdditionalDetails = [];
      }
    }

    // Set the parsed data in currentRoom
    setCurrentRoom({
      ...room,
      amenities: Array.isArray(parsedAmenities) ? parsedAmenities : [],
      additionalDetails: Array.isArray(parsedAdditionalDetails) ? parsedAdditionalDetails : []
    });
    setEditImagePreview(null);
    setIsEditDialogOpen(true);
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
        // roomView: formDataObj.roomView,
        amenities: formDataObj.amenities,  
        additionalDetails: formDataObj.additionalDetails,
        bedType: formDataObj.bedType,
        pricePerNight: parseFloat(formDataObj.pricePerNight as string) ,
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

  // Add this style to the number inputs
  const numberInputStyles = {
    MozAppearance: 'textfield',
    WebkitAppearance: 'none',
    appearance: 'textfield',
  } as const;

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

                      <div className="space-y-2">
                        <Label htmlFor="pricePerNight">Price Per Night</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                          <Input
                            id="pricePerNight"
                            type="number"
                            value={newRoom.pricePerNight}
                            onChange={(e) => setNewRoom({ 
                              ...newRoom, 
                              pricePerNight: e.target.value ? Number(e.target.value) : 0 
                            })}
                            style={numberInputStyles}
                            className="pl-8"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Additional details section */}
                    <div className="grid gap-6">
                      <div className="grid grid-cols-2 gap-4">
                        {/* <div className="space-y-2">
                          <Label htmlFor="roomView">Room View</Label>
                          <select
                            id="roomView"
                            className="w-full border rounded-md p-2"
                            value={newRoom.roomView}
                            onChange={(e) => setNewRoom({ ...newRoom, roomView: e.target.value })}
                          >
                            <option value="City View">City View</option>
                            <option value="Garden View">Garden View</option>
                            <option value="Pool View">Pool View</option>
                            <option value="Ocean View">Ocean View</option>
                            <option value="Mountain View">Mountain View</option>
                          </select>
                        </div> */}

                        <div className="space-y-2">
                          <Label htmlFor="bedType">Bed Type</Label>
                          <select
                            id="bedType"
                            className="w-full border rounded-md p-2"
                            value={newRoom.bedType}
                            onChange={(e) => setNewRoom({ ...newRoom, bedType: e.target.value })}
                          >
                            <option value="Single">Single</option>
                            <option value="Double">Double</option>
                            <option value="Queen">Queen</option>
                            <option value="King">King</option>
                            <option value="Twin">Twin</option>
                          </select>
                        </div>
                      </div>

                      {/* Amenities Section */}
                      <div className="space-y-2">
                        <Label>Amenities</Label>
                        <div className="flex gap-2">
                          <Input
                            value={newAmenity}
                            onChange={(e) => setNewAmenity(e.target.value)}
                            placeholder="Add amenity"
                          />
                          <Button
                            type="button"
                            onClick={() => {
                              if (newAmenity.trim()) {
                                setNewRoom({
                                  ...newRoom,
                                  amenities: [...(newRoom.amenities || []), newAmenity.trim()]
                                })
                                setNewAmenity('')
                              }
                            }}
                          >
                            Add
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {newRoom.amenities?.map((amenity, index) => (
                            <div
                              key={index}
                              className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2"
                            >
                              <span>{amenity}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setNewRoom({
                                    ...newRoom,
                                    amenities: newRoom.amenities?.filter((_, i) => i !== index)
                                  })
                                }}
                                className="text-red-500 hover:text-red-700"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Additional Details Section */}
                      <div className="space-y-2">
                        <Label>Additional Details</Label>
                        <div className="flex gap-2">
                          <Input
                            value={newDetail}
                            onChange={(e) => setNewDetail(e.target.value)}
                            placeholder="Add detail"
                          />
                          <Button
                            type="button"
                            onClick={() => {
                              if (newDetail.trim()) {
                                setNewRoom({
                                  ...newRoom,
                                  additionalDetails: [...(newRoom.additionalDetails || []), newDetail.trim()]
                                })
                                setNewDetail('')
                              }
                            }}
                          >
                            Add
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {newRoom.additionalDetails?.map((detail, index) => (
                            <div
                              key={index}
                              className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2"
                            >
                              <span>{detail}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setNewRoom({
                                    ...newRoom,
                                    additionalDetails: newRoom.additionalDetails?.filter((_, i) => i !== index)
                                  })
                                }}
                                className="text-red-500 hover:text-red-700"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
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
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price/Night
                    </th>
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
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                        ₹{room?.pricePerNight.toLocaleString()}
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
            <>
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

                  <div className="space-y-2">
                    <Label htmlFor="edit-pricePerNight">Price Per Night</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                      <Input
                        id="edit-pricePerNight"
                        type="number"
                        value={currentRoom.pricePerNight || 0}
                        onChange={(e) => setCurrentRoom({ 
                          ...currentRoom, 
                          pricePerNight: e.target.value ? Number(e.target.value) : 0 
                        })}
                        style={numberInputStyles}
                        className="pl-8"
                      />
                    </div>
                  </div>


                  
                </div>

                {/* Add bed type, amenities, and additional details sections */}
                <div className="col-span-full grid gap-6">
                  {/* Bed Type Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="edit-bedType">Bed Type</Label>
                    <select
                      id="edit-bedType"
                      className="w-full border rounded-md p-2"
                      value={currentRoom.bedType}
                      onChange={(e) => setCurrentRoom({ ...currentRoom, bedType: e.target.value })}
                    >
                      <option value="Single">Single</option>
                      <option value="Double">Double</option>
                      <option value="Queen">Queen</option>
                      <option value="King">King</option>
                      <option value="Twin">Twin</option>
                    </select>
                  </div>

                  {/* Amenities Section */}
                  <div className="space-y-2">
                    <Label>Amenities</Label>
                    <div className="flex gap-2">
                      <Input
                        value={newAmenity}
                        onChange={(e) => setNewAmenity(e.target.value)}
                        placeholder="Add amenity"
                      />
                      <Button
                        type="button"
                        onClick={() => {
                          if (newAmenity.trim()) {
                            const updatedAmenities = Array.isArray(currentRoom.amenities)
                              ? [...currentRoom.amenities, newAmenity.trim()]
                              : [newAmenity.trim()];
                            setCurrentRoom({
                              ...currentRoom,
                              amenities: updatedAmenities
                            });
                            setNewAmenity('');
                          }
                        }}
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {Array.isArray(currentRoom.amenities) && currentRoom.amenities.map((amenity, index) => (
                        <div
                          key={index}
                          className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2"
                        >
                          <span>{amenity}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setCurrentRoom({
                                ...currentRoom,
                                amenities: currentRoom.amenities.filter((_, i) => i !== index)
                              });
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Additional Details Section */}
                  <div className="space-y-2">
                    <Label>Additional Details</Label>
                    <div className="flex gap-2">
                      <Input
                        value={newDetail}
                        onChange={(e) => setNewDetail(e.target.value)}
                        placeholder="Add detail"
                      />
                      <Button
                        type="button"
                        onClick={() => {
                          if (newDetail.trim()) {
                            const updatedDetails = Array.isArray(currentRoom.additionalDetails)
                              ? [...currentRoom.additionalDetails, newDetail.trim()]
                              : [newDetail.trim()];
                            setCurrentRoom({
                              ...currentRoom,
                              additionalDetails: updatedDetails
                            });
                            setNewDetail('');
                          }
                        }}
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {Array.isArray(currentRoom.additionalDetails) && currentRoom.additionalDetails.map((detail, index) => (
                        <div
                          key={index}
                          className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2"
                        >
                          <span>{detail}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setCurrentRoom({
                                ...currentRoom,
                                additionalDetails: currentRoom.additionalDetails.filter((_, i) => i !== index)
                              });
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
            </div>
            </>
          )}
        {/* </DialogContent> */}
          
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



