"use client"

import { useEffect, useState } from "react"
import { Info, Pencil, Trash2, Calendar } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { format, set } from "date-fns"
import { Pagination } from "@/components/pagination"
import axios from "axios"   
import { API_ROUTES } from "@/config/api"
import { headers } from "next/headers"
import { toast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"

// Update UnavailableRoom type to match API
interface UnavailableRoom {
  _id: string;
  roomId: { _id: string; room_title: string } | null;
  fromDate: string;
  toDate: string;
  createdAt: string;
  __v: number;
}

export default function UnavailableRoomsPage() {
  const [unavailableRooms, setUnavailableRooms] = useState<UnavailableRoom[]>([])
  const [availableRooms, setAvailableRooms] = useState<any[]>([])
  const [selectedRoom, setSelectedRoom] = useState<string>("")
  const [dateFrom, setDateFrom] = useState<string>("")
  const [dateTo, setDateTo] = useState<string>("")
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [roomTypes,setRoomTypes] = useState<string[]>([])
  const [isLoadingRooms, setIsLoadingRooms] = useState<boolean>(false)

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [roomToDelete, setRoomToDelete] = useState<UnavailableRoom | null>(null)

    // Fetch available rooms count
    useEffect(() => {
      const fetchAvailableRooms = async () => {
        try {
          setIsLoadingRooms(true)
          const response = await fetch(`${API_ROUTES.rooms}`)

          console.log("Available rooms response:", response)
          if (response.ok) {
            const data = await response.json()
            if (Array.isArray(data)) {
              const availableRooms = data.filter((room: any) => room.status == "available")
              const unavailableRooms= data.filter((room: any) => room.status == "unavailable")
              setAvailableRooms(availableRooms)
              setUnavailableRooms(unavailableRooms)
              setRoomTypes(availableRooms.map((room: any) => room.room_title))


            }  
         
          } else {
            console.error('Failed to fetch available rooms:', response.statusText)
          }
        } catch (error) {
          console.error('Error fetching available rooms:', error)
        } finally {
          setIsLoadingRooms(false)
        }
      }
  
      fetchAvailableRooms()
    }, [])

    // Fetch unavailable rooms from new API
    useEffect(() => {
      const fetchUnavailableRooms = async () => {
        try {
          const response = await axios.get(API_ROUTES.unavailabilities, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
            },
          })
          if (response.data && response.data.success) {
            setUnavailableRooms(response.data.data)
          }
        } catch (error) {
          console.error('Error fetching unavailable rooms:', error)
        }
      }
      fetchUnavailableRooms()
    }, [])

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const totalPages = Math.ceil(unavailableRooms.length / itemsPerPage)

  // Get current page data
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return unavailableRooms.slice(startIndex, endIndex)
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Helper to refresh unavailable rooms
  const fetchUnavailableRooms = async () => {
    try {
      const response = await axios.get(API_ROUTES.unavailabilities, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
        },
      })
      if (response.data && response.data.success) {
        setUnavailableRooms(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching unavailable rooms:', error)
    }
  }

  // Combine all rooms for dropdown (unique by _id)
  const allRooms = [
    ...availableRooms,
    ...unavailableRooms
      .filter((ur) => ur.roomId && !availableRooms.some((ar) => ar._id === ur.roomId!._id))
      .map((ur) => ur.roomId!)
  ].filter(Boolean)

  // Add this function to call the unavailable API
  const setRoomUnavailable = async (roomId: string, fromDate: string, toDate: string) => {


    try {
      await axios.post(
        `${API_ROUTES.rooms}/status/unavailable`,
        {
          roomId,
          fromDate: new Date(fromDate).toISOString(),
          toDate: new Date(toDate).toISOString(),
        },
        {
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${localStorage.getItem("auth-token")}`
          },
        }
      )
      toast({ title: "Room set as unavailable successfully!", variant: "default" })
    } catch (error) {
      console.error('Failed to set room unavailable:', error)
      toast({ title: "Failed to set room unavailable.", variant: "destructive" })
    }
  }

  const handleSave = async () => {
    if (!selectedRoom || !dateFrom || !dateTo) {
      toast({ title: "Please fill in all fields", variant: "destructive" })
      return
    }

    const today = new Date()
    today.setHours(0,0,0,0)
    const from = new Date(dateFrom)
    const to = new Date(dateTo)
    if (from < today) {
      toast({ title: "'Date From' must be today or later.", variant: "destructive" })
      return
    }
    if (to < from) {
      toast({ title: "'Date To' cannot be before 'Date From'.", variant: "destructive" })
      return
    }

    // Find the selected room's ID
    const selectedRoomObj = allRooms.find((room) => room.room_title === selectedRoom)
    if (!selectedRoomObj) {
      toast({ title: "Selected room not found!", variant: "destructive" })
      return
    }

    if (isEditing && editingId) {
      // Update existing room (API call for update)
      try {
        await axios.put(
          `${API_ROUTES.unavailabilities}/${editingId}`,
          {
            roomId: selectedRoomObj._id,
            fromDate: new Date(dateFrom).toISOString(),
            toDate: new Date(dateTo).toISOString(),
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
            },
          }
        )
        await fetchUnavailableRooms()
        toast({ title: "Unavailable room updated successfully!", variant: "default" })
      } catch (error) {
        toast({ title: "Failed to update unavailable room.", variant: "destructive" })
      }
    } else {
      // Add new room (API call for add should be implemented here)
      await setRoomUnavailable(selectedRoomObj._id, dateFrom, dateTo)
      await fetchUnavailableRooms()
    }

    // Reset form
    setSelectedRoom("")
    setDateFrom("")
    setDateTo("")
  }

  const handleEdit = (room: any) => {
    setSelectedRoom(room.roomId? room.roomId.room_title : "")
    setDateFrom(room.fromDate ? room.fromDate.slice(0,10) : "")
    setDateTo(room.toDate ? room.toDate.slice(0,10) : "")
    setIsEditing(true)
    setEditingId(room._id)
  }

  const openDeleteDialog = (room: UnavailableRoom) => {
    setRoomToDelete(room)
    setDeleteDialogOpen(true)
  }
  const closeDeleteDialog = () => {
    setRoomToDelete(null)
    setDeleteDialogOpen(false)
  }

  const handleDelete = async (id: string) => {
    if (roomToDelete) {
      try {
        await axios.delete(`${API_ROUTES.unavailabilities}/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
          },
        })
        setUnavailableRooms(unavailableRooms.filter((room) => room._id !== id))
        toast({ title: "Unavailable room deleted successfully!", variant: "default" })
      } catch (error) {
        toast({ title: "Failed to delete unavailable room.", variant: "destructive" })
      }
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "—"
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return "—"
    return format(date, "yyyy-MM-dd")
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - hidden on mobile */}
      <Sidebar className="hidden md:flex" activeItem="Rooms & Suites" />

      {/* Main Content */}
      <div className="flex-1">
        <PageHeader heading="Rooms Unavailable" />

        <main className="p-4 md:p-6">
          <div className="bg-gold p-4 md:p-6 rounded-t-lg">
            <h1 className="text-xl md:text-2xl font-bold text-white">Set Unavailable Rooms</h1>
            <div className="flex items-start mt-2 text-white">
              <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm">
                Here you can set selected rooms as unavailable for a predefined period of time. Rooms with "Unavailable"
                status won't be available for bookings.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Unavailable Rooms List */}
            <div className="lg:col-span-2">
              <Card className="border-t-0 rounded-t-none">
                <div className="p-4 md:p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Unavailable Rooms</h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 text-left">
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date From
                        </th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date To
                        </th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Room(s)
                        </th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                            {formatDate(room.fromDate)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                            {formatDate(room.toDate)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{room.roomId ? room.roomId.room_title : "—"}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-500"
                                onClick={() => handleEdit(room)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-500"
                                onClick={() => openDeleteDialog(room)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {unavailableRooms.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                            No unavailable rooms set
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
              {/* Add pagination component */}
              {unavailableRooms.length > 0 && (
                <div className="p-4 border-t border-gray-200">
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                </div>
              )}
            </div>

            {/* Add/Edit Form */}
            <div>
              <Card className="border-t-0 rounded-t-none lg:rounded-t-lg lg:border-t">
                <div className="p-4 md:p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">{isEditing ? "Edit" : "Add"}</h2>
                </div>

                <div className="p-4 md:p-6 space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="room-select" className="block text-sm font-medium text-gray-700">
                      Room(s)
                    </label>
                    <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                      <SelectTrigger id="room-select" className="w-full">
                        <SelectValue placeholder="Select Room" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {allRooms.map((room) => (
                          <SelectItem key={room._id} value={room.room_title}>
                            {room.room_title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="date-from" className="block text-sm font-medium text-gray-700">
                      Date From
                    </label>
                    <div className="relative">
                      <Input
                        id="date-from"
                        type="date"
                        value={dateFrom || ""}
                        min={format(new Date(), "yyyy-MM-dd")}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="w-full"
                      />
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="date-to" className="block text-sm font-medium text-gray-700">
                      Date To
                    </label>
                    <div className="relative">
                      <Input
                        id="date-to"
                        type="date"
                        value={dateTo || ""}
                        min={dateFrom || format(new Date(), "yyyy-MM-dd")}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="w-full"
                      />
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <Button className="w-full bg-gold hover:bg-gold-dark" onClick={handleSave}>
                    {isEditing ? "Update" : "Save"}
                  </Button>

                  {isEditing && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setIsEditing(false)
                        setEditingId(null)
                        setSelectedRoom("")
                        setDateFrom("")
                        setDateTo("")
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Room Unavailability?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this unavailable room setting?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeDeleteDialog}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (roomToDelete) {
                  await handleDelete(roomToDelete._id)
                  closeDeleteDialog()
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
