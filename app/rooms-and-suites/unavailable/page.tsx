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

interface UnavailableRoom {
  id: number
  dateFrom: string
  dateTo: string
  roomType: string
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



  const handleSave = () => {
    if (!selectedRoom || !dateFrom || !dateTo) {
      alert("Please fill in all fields")
      return
    }

    if (new Date(dateFrom) > new Date(dateTo)) {
      alert("Start date cannot be after end date")
      return
    }

    if (isEditing && editingId) {
      // Update existing room
       try{
         const response= await axios.put(`${API_ROUTES.rooms}/${editingId}`, {
          dateFrom, 

          dateTo,
          roomType: selectedRoom
       }
       catch (error) {
        console.error("Error updating room:", error)
        alert("Failed to update room. Please try again.")
        }
      setUnavailableRooms(
        unavailableRooms.map((room) =>
          room.id === editingId
            ? {
                ...room,
                dateFrom,
                dateTo,
                roomType: selectedRoom,
              }
            : room,
        ),
      )
      setIsEditing(false)
      setEditingId(null)
    } else {
      // Add new room
      const newId = unavailableRooms.length > 0 ? Math.max(...unavailableRooms.map((room) => room.id)) + 1 : 1
      setUnavailableRooms([
        ...unavailableRooms,
        {
          id: newId,
          dateFrom,
          dateTo,
          roomType: selectedRoom,
        },
      ])
    }

    // Reset form
    setSelectedRoom("")
    setDateFrom("")
    setDateTo("")
  }

  const handleEdit = (room: UnavailableRoom) => {
    setSelectedRoom(room.roomType)
    setDateFrom(room.dateFrom)
    setDateTo(room.dateTo)
    setIsEditing(true)
    setEditingId(room.id)
  }

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this unavailable room setting?")) {
      setUnavailableRooms(unavailableRooms.filter((room) => room.id !== id))
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, "yyyy-MM-dd")
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
                        <tr key={room.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                            {formatDate(room.dateFrom)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                            {formatDate(room.dateTo)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{room.roomType}</td>
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
                                onClick={() => handleDelete(room.id)}
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
                        {roomTypes.map((roomType) => (
                          <SelectItem key={roomType} value={roomType}>
                            {roomType}
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
                        value={dateFrom}
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
                        value={dateTo}
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
    </div>
  )
}
