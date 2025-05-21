"use client"

import type React from "react"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { ChevronLeft, ChevronRight, Plus, Trash2, User } from "lucide-react"

// Define event types
interface Event {
  id: number
  title: string
  start: string
  end: string
  location: string
  description: string
  attendees: string[]
  color: string
}

// Sample event data
const initialEvents: Event[] = [
  {
    id: 1,
    title: "Board Meeting",
    start: "2025-05-20T09:00",
    end: "2025-05-20T11:00",
    location: "Conference Room A",
    description: "Quarterly board meeting to discuss financial results and future strategy.",
    attendees: ["John Smith", "Jane Doe", "Robert Johnson"],
    color: "#4f46e5", // indigo
  },
  {
    id: 2,
    title: "Team Lunch",
    start: "2025-05-20T12:30",
    end: "2025-05-20T13:30",
    location: "Hotel Restaurant",
    description: "Team lunch to celebrate project completion.",
    attendees: ["Marketing Team", "Sales Team"],
    color: "#10b981", // emerald
  },
  {
    id: 3,
    title: "Client Meeting",
    start: "2025-05-21T14:00",
    end: "2025-05-21T15:30",
    location: "Meeting Room B",
    description: "Meeting with ABC Corp to discuss new contract.",
    attendees: ["Sarah Williams", "Michael Brown"],
    color: "#f59e0b", // amber
  },
  {
    id: 4,
    title: "Wedding Reception",
    start: "2025-05-22T18:00",
    end: "2025-05-22T23:00",
    location: "Grand Ballroom",
    description: "Smith-Johnson wedding reception.",
    attendees: ["Wedding Party", "Guests"],
    color: "#ec4899", // pink
  },
  {
    id: 5,
    title: "Corporate Retreat",
    start: "2025-05-25T09:00",
    end: "2025-05-27T17:00",
    location: "Resort Conference Center",
    description: "Annual corporate retreat for team building and strategy planning.",
    attendees: ["Executive Team", "Department Heads"],
    color: "#8b5cf6", // violet
  },
]

// Color options for events
const colorOptions = [
  { name: "Blue", value: "#3b82f6" },
  { name: "Green", value: "#10b981" },
  { name: "Red", value: "#ef4444" },
  { name: "Yellow", value: "#f59e0b" },
  { name: "Purple", value: "#8b5cf6" },
  { name: "Pink", value: "#ec4899" },
  { name: "Indigo", value: "#4f46e5" },
]

export default function EventsCalendarPage() {
  const { toast } = useToast()
  const [events, setEvents] = useState<Event[]>(initialEvents)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month")
  const [newAttendee, setNewAttendee] = useState("")

  // New event form state
  const [newEvent, setNewEvent] = useState<Omit<Event, "id">>({
    title: "",
    start: "",
    end: "",
    location: "",
    description: "",
    attendees: [],
    color: "#3b82f6", // default blue
  })

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })
  }

  // Get days in month for the calendar
  const getDaysInMonth = (year: number, month: number) => {
    const date = new Date(year, month, 1)
    const days = []
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay()

    // Add days from previous month to fill the first week
    for (let i = 0; i < firstDay; i++) {
      const prevDate = new Date(date.getFullYear(), date.getMonth(), 0 - i)
      days.unshift({
        date: prevDate,
        isCurrentMonth: false,
      })
    }

    // Add days of current month
    while (date.getMonth() === month) {
      days.push({
        date: new Date(date),
        isCurrentMonth: true,
      })
      date.setDate(date.getDate() + 1)
    }

    // Add days from next month to complete the last week
    const lastDay = days[days.length - 1].date.getDay()
    for (let i = 1; i < 7 - lastDay; i++) {
      const nextDate = new Date(date.getFullYear(), date.getMonth(), i)
      days.push({
        date: nextDate,
        isCurrentMonth: false,
      })
    }

    return days
  }

  // Get events for a specific day
  const getEventsForDay = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    return events.filter((event) => {
      const eventStartDate = event.start.split("T")[0]
      const eventEndDate = event.end.split("T")[0]
      return eventStartDate <= dateStr && eventEndDate >= dateStr
    })
  }

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  // Navigate to today
  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Handle input change for new event form
  const handleNewEventChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewEvent({
      ...newEvent,
      [name]: value,
    })
  }

  // Handle select change for new event form
  const handleNewEventSelectChange = (name: string, value: string) => {
    setNewEvent({
      ...newEvent,
      [name]: value,
    })
  }

  // Add attendee to new event
  const handleAddAttendee = () => {
    if (!newAttendee.trim()) return
    if (isEditDialogOpen && currentEvent) {
      setCurrentEvent({
        ...currentEvent,
        attendees: [...currentEvent.attendees, newAttendee],
      })
    } else {
      setNewEvent({
        ...newEvent,
        attendees: [...newEvent.attendees, newAttendee],
      })
    }
    setNewAttendee("")
  }

  // Remove attendee from new event
  const handleRemoveAttendee = (index: number) => {
    if (isEditDialogOpen && currentEvent) {
      const updatedAttendees = [...currentEvent.attendees]
      updatedAttendees.splice(index, 1)
      setCurrentEvent({
        ...currentEvent,
        attendees: updatedAttendees,
      })
    } else {
      const updatedAttendees = [...newEvent.attendees]
      updatedAttendees.splice(index, 1)
      setNewEvent({
        ...newEvent,
        attendees: updatedAttendees,
      })
    }
  }

  // Handle add event
  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.start || !newEvent.end) {
      toast({
        title: "Error",
        description: "Title, start date, and end date are required.",
        variant: "destructive",
      })
      return
    }

    const startDate = new Date(newEvent.start)
    const endDate = new Date(newEvent.end)

    if (endDate < startDate) {
      toast({
        title: "Error",
        description: "End date cannot be before start date.",
        variant: "destructive",
      })
      return
    }

    const newId = events.length > 0 ? Math.max(...events.map((event) => event.id)) + 1 : 1

    setEvents([
      ...events,
      {
        id: newId,
        ...newEvent,
      },
    ])

    setNewEvent({
      title: "",
      start: "",
      end: "",
      location: "",
      description: "",
      attendees: [],
      color: "#3b82f6",
    })

    setIsAddDialogOpen(false)

    toast({
      title: "Success",
      description: "Event added successfully.",
    })
  }

  // Handle edit event
  const handleEditEvent = (event: Event) => {
    setCurrentEvent(event)
    setIsEditDialogOpen(true)
  }

  // Handle update event
  const handleUpdateEvent = () => {
    if (!currentEvent || !currentEvent.title || !currentEvent.start || !currentEvent.end) {
      toast({
        title: "Error",
        description: "Title, start date, and end date are required.",
        variant: "destructive",
      })
      return
    }

    const startDate = new Date(currentEvent.start)
    const endDate = new Date(currentEvent.end)

    if (endDate < startDate) {
      toast({
        title: "Error",
        description: "End date cannot be before start date.",
        variant: "destructive",
      })
      return
    }

    setEvents(events.map((event) => (event.id === currentEvent.id ? currentEvent : event)))

    setIsEditDialogOpen(false)
    setCurrentEvent(null)

    toast({
      title: "Success",
      description: "Event updated successfully.",
    })
  }

  // Handle delete event
  const handleDeleteEvent = (id: number) => {
    setEvents(events.filter((event) => event.id !== id))

    if (isEditDialogOpen) {
      setIsEditDialogOpen(false)
      setCurrentEvent(null)
    }

    toast({
      title: "Success",
      description: "Event deleted successfully.",
    })
  }

  // Get days for the current month
  const days = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth())

  return (
    <div className="p-6 space-y-6">
      <PageHeader heading="Events Calendar" text="Manage and schedule events for your hotel." />

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-semibold min-w-[200px] text-center">{formatDate(currentDate)}</h2>
              <Button variant="outline" size="sm" onClick={goToNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={goToToday}>
                Today
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Select value={viewMode} onValueChange={(value) => setViewMode(value as "month" | "week" | "day")}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="View" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="day">Day</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={() => setIsAddDialogOpen(true)} className="bg-amber-500 hover:bg-amber-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day headers */}
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center font-medium py-2 text-gray-500">
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {days.map((day, index) => {
              const dayEvents = getEventsForDay(day.date)
              return (
                <div
                  key={index}
                  className={`min-h-[120px] border p-1 ${
                    day.isCurrentMonth ? "bg-white" : "bg-gray-50 text-gray-400"
                  } ${
                    day.date.toDateString() === new Date().toDateString()
                      ? "border-amber-500 border-2"
                      : "border-gray-200"
                  }`}
                >
                  <div className="text-right p-1">{day.date.getDate()}</div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        className="text-xs p-1 rounded truncate cursor-pointer"
                        style={{ backgroundColor: event.color, color: "white" }}
                        onClick={() => handleEditEvent(event)}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-gray-500 p-1">+{dayEvents.length - 3} more</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Add Event Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Event</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                name="title"
                value={newEvent.title}
                onChange={handleNewEventChange}
                placeholder="Enter event title"
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start">Start Date & Time</Label>
                <Input
                  id="start"
                  name="start"
                  type="datetime-local"
                  value={newEvent.start}
                  onChange={handleNewEventChange}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="end">End Date & Time</Label>
                <Input
                  id="end"
                  name="end"
                  type="datetime-local"
                  value={newEvent.end}
                  onChange={handleNewEventChange}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={newEvent.location}
                onChange={handleNewEventChange}
                placeholder="Enter event location"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={newEvent.description}
                onChange={handleNewEventChange}
                placeholder="Enter event description"
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="color">Event Color</Label>
              <Select value={newEvent.color} onValueChange={(value) => handleNewEventSelectChange("color", value)}>
                <SelectTrigger id="color" className="mt-1">
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: color.value }}></div>
                        {color.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Attendees</Label>
              <div className="flex mt-1 gap-2">
                <Input
                  value={newAttendee}
                  onChange={(e) => setNewAttendee(e.target.value)}
                  placeholder="Add attendee"
                  className="flex-1"
                />
                <Button type="button" variant="outline" onClick={handleAddAttendee}>
                  Add
                </Button>
              </div>
              {newEvent.attendees.length > 0 && (
                <div className="mt-2 space-y-1">
                  {newEvent.attendees.map((attendee, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{attendee}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveAttendee(index)}
                        className="h-6 w-6 p-0 text-gray-500 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={handleAddEvent} className="bg-amber-500 hover:bg-amber-600 text-white">
                Add Event
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Event Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>

          {currentEvent && (
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="edit-title">Event Title</Label>
                <Input
                  id="edit-title"
                  name="title"
                  value={currentEvent.title}
                  onChange={(e) => setCurrentEvent({ ...currentEvent, title: e.target.value })}
                  placeholder="Enter event title"
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-start">Start Date & Time</Label>
                  <Input
                    id="edit-start"
                    name="start"
                    type="datetime-local"
                    value={currentEvent.start}
                    onChange={(e) => setCurrentEvent({ ...currentEvent, start: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="edit-end">End Date & Time</Label>
                  <Input
                    id="edit-end"
                    name="end"
                    type="datetime-local"
                    value={currentEvent.end}
                    onChange={(e) => setCurrentEvent({ ...currentEvent, end: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit-location">Location</Label>
                <Input
                  id="edit-location"
                  name="location"
                  value={currentEvent.location}
                  onChange={(e) => setCurrentEvent({ ...currentEvent, location: e.target.value })}
                  placeholder="Enter event location"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  value={currentEvent.description}
                  onChange={(e) => setCurrentEvent({ ...currentEvent, description: e.target.value })}
                  placeholder="Enter event description"
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="edit-color">Event Color</Label>
                <Select
                  value={currentEvent.color}
                  onValueChange={(value) => setCurrentEvent({ ...currentEvent, color: value })}
                >
                  <SelectTrigger id="edit-color" className="mt-1">
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: color.value }}></div>
                          {color.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Attendees</Label>
                <div className="flex mt-1 gap-2">
                  <Input
                    value={newAttendee}
                    onChange={(e) => setNewAttendee(e.target.value)}
                    placeholder="Add attendee"
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" onClick={handleAddAttendee}>
                    Add
                  </Button>
                </div>
                {currentEvent.attendees.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {currentEvent.attendees.map((attendee, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{attendee}</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveAttendee(index)}
                          className="h-6 w-6 p-0 text-gray-500 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  onClick={() => handleDeleteEvent(currentEvent.id)}
                  variant="outline"
                  className="text-red-500 border-red-200 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
                <Button onClick={handleUpdateEvent} className="bg-amber-500 hover:bg-amber-600 text-white">
                  Update Event
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
