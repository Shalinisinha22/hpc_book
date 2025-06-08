"use client"

import type React from "react"

import { useState, useRef } from "react"
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


interface Room {
  id: number
  title: string
  description: string
  maxPerson: number
  maxChildren: number
  totalRooms: number
  roomSize: number
  image: string
}

export default function RoomsAndSuitesPage() {
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: 1,
      title: "Premium Suite",
      description: "The Royal Bihar premium suite with all amenities",
      maxPerson: 3,
      maxChildren: 0,
      totalRooms: 4,
      roomSize: 560,
      image: "/opulent-suite.png",
    },
    {
      id: 2,
      title: "Premium Room",
      description: "The Royal Bihar premium room with modern facilities",
      maxPerson: 3,
      maxChildren: 0,
      totalRooms: 4,
      roomSize: 276,
      image: "/luxurious-city-view.png",
    },
    {
      id: 3,
      title: "Deluxe Room",
      description: "The Royal Bihar deluxe room with comfortable amenities",
      maxPerson: 3,
      maxChildren: 0,
      totalRooms: 1,
      roomSize: 238,
      image: "/luxurious-suite.png",
    },
    {
      id: 4,
      title: "Deluxe Suite",
      description: "The Royal Bihar deluxe suite with premium services",
      maxPerson: 3,
      maxChildren: 0,
      totalRooms: 4,
      roomSize: 342,
      image: "/luxurious-city-suite.png",
    },
    {
      id: 5,
      title: "The Royal Pent House",
      description: "The Royal Pent House with exclusive amenities and views",
      maxPerson: 3,
      maxChildren: 0,
      totalRooms: 4,
      roomSize: 1480,
      image: "/city-lights-penthouse.png",
    },
  ])

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

  // Function to create a new room
  const createRoom = async (roomData: FormData) => {
    try {
      // Get token from localStorage or your auth state management
      const token = localStorage.getItem("auth-token")
      if (!token) {
        throw new Error("User not authenticated")
      }
   

      const response = await fetch("http://localhost:8000/api/v1/rooms", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: roomData, 
      })

      console.log("Response status:", response.status)

      if (!response.status) {
        throw new Error("Failed to create room")
      }

      const data = await response.json()
      return data
    } catch (error) {
      throw error
    }
  }


  const handleAddRoom = async () => {
    try {
      // Create FormData object
      const formData = new FormData()

      // Add room images if they exist
      if (newImagePreview) {
        const response = await fetch(newImagePreview)
        const blob = await response.blob()
        formData.append("roomImage", blob, "room-image.jpg")
      }

      // Add other room data
      formData.append("room_title", newRoom.title)
      formData.append("desc", newRoom.description)
      formData.append("max_person", newRoom.maxPerson.toString())
      formData.append("max_children", newRoom.maxChildren.toString())
      formData.append("totalRooms", newRoom.totalRooms.toString())
      formData.append("roomSize", newRoom.roomSize.toString())

      // Send data to backend
      await createRoom(formData)

      // Reset form and show success message
      setNewRoom({
        title: "",
        description: "",
        maxPerson: 2,
        maxChildren: 0,
        totalRooms: 1,
        roomSize: 0,
        image: "",
      })
      setNewImagePreview(null)
      setIsAddDialogOpen(false)

      // Show success toast using your UI components
      toast({
        title: "Success",
        description: "Room created successfully",
      })
    } catch (error) {
      // Handle error
      toast({
        title: "Error",
        description: "Failed to create room",
        variant: "destructive",
      })
    }
  }

  const handleEditRoom = () => {
    if (!currentRoom) return

    const updatedRoom = {
      ...currentRoom,
      image: editImagePreview || currentRoom.image,
    }

    const updatedRooms = rooms.map((room) => (room.id === currentRoom.id ? updatedRoom : room))

    setRooms(updatedRooms)
    setIsEditDialogOpen(false)
    setCurrentRoom(null)
    setEditImagePreview(null)
  }

  const handleDeleteRoom = (id: number) => {
    const updatedRooms = rooms.filter((room) => room.id !== id)
    setRooms(updatedRooms)
    setIsDeleteDialogOpen(false)
    setRoomToDelete(null)
  }

  const openEditDialog = (room: Room) => {
    setCurrentRoom({ ...room })
    setEditImagePreview(null)
    setIsEditDialogOpen(true)
  }

  const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setNewImagePreview(imageUrl)
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
                          value={newRoom.maxPerson}
                          onChange={(e) => setNewRoom({ ...newRoom, maxPerson: Number.parseInt(e.target.value) })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="maxChildren">Max Children</Label>
                        <Input
                          id="maxChildren"
                          type="number"
                          value={newRoom.maxChildren}
                          onChange={(e) => setNewRoom({ ...newRoom, maxChildren: Number.parseInt(e.target.value) })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="totalRooms">Total Rooms</Label>
                        <Input
                          id="totalRooms"
                          type="number"
                          value={newRoom.totalRooms}
                          onChange={(e) => setNewRoom({ ...newRoom, totalRooms: Number.parseInt(e.target.value) })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="roomSize">Room Size (sq ft)</Label>
                        <Input
                          id="roomSize"
                          type="number"
                          value={newRoom.roomSize}
                          onChange={(e) => setNewRoom({ ...newRoom, roomSize: Number.parseInt(e.target.value) })}
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
                    <tr key={room.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="h-16 w-16 rounded-full overflow-hidden">
                          <Image
                            src={room.image || "/placeholder.svg"}
                            alt={room.title}
                            width={64}
                            height={64}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{room.title}</td>
                      <td className="px-4 py-4 text-sm text-gray-700 max-w-xs truncate">{room.description}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{room.maxPerson}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{room.maxChildren}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{room.totalRooms}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{room.roomSize}</td>
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
                        src={currentRoom.image || "/placeholder.svg"}
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
                      value={currentRoom.title}
                      onChange={(e) => setCurrentRoom({ ...currentRoom, title: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-description">Description</Label>
                    <Textarea
                      id="edit-description"
                      value={currentRoom.description}
                      onChange={(e) => setCurrentRoom({ ...currentRoom, description: e.target.value })}
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom section - Room details in a 2x2 grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-maxPerson">Max Person</Label>
                  <Input
                    id="edit-maxPerson"
                    type="number"
                    value={currentRoom.maxPerson}
                    onChange={(e) => setCurrentRoom({ ...currentRoom, maxPerson: Number.parseInt(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-maxChildren">Max Children</Label>
                  <Input
                    id="edit-maxChildren"
                    type="number"
                    value={currentRoom.maxChildren}
                    onChange={(e) => setCurrentRoom({ ...currentRoom, maxChildren: Number.parseInt(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-totalRooms">Total Rooms</Label>
                  <Input
                    id="edit-totalRooms"
                    type="number"
                    value={currentRoom.totalRooms}
                    onChange={(e) => setCurrentRoom({ ...currentRoom, totalRooms: Number.parseInt(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-roomSize">Room Size (sq ft)</Label>
                  <Input
                    id="edit-roomSize"
                    type="number"
                    value={currentRoom.roomSize}
                    onChange={(e) => setCurrentRoom({ ...currentRoom, roomSize: Number.parseInt(e.target.value) })}
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
              onClick={() => roomToDelete && handleDeleteRoom(roomToDelete.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
