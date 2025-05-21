"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Pencil, Trash2, Plus, Eye } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { RichTextEditor } from "@/components/rich-text-editor"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
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

export default function EventsPage() {
  const { toast } = useToast()
  const [openDialog, setOpenDialog] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [currentEvent, setCurrentEvent] = useState(null)
  const [description, setDescription] = useState("")
  const [terms, setTerms] = useState("")
  const [mainImage, setMainImage] = useState(null)
  const [additionalImage, setAdditionalImage] = useState(null)
  const [mainImagePreview, setMainImagePreview] = useState("/swimming-pool.png")
  const [additionalImagePreview, setAdditionalImagePreview] = useState("/romantic-dinner.png")
  const [previewEvent, setPreviewEvent] = useState(null)
  const [showPreview, setShowPreview] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [eventToDelete, setEventToDelete] = useState(null)
  const [selectedEvents, setSelectedEvents] = useState([])
  const [showBatchDeleteDialog, setShowBatchDeleteDialog] = useState(false)

  // Sample events data
  const [events, setEvents] = useState([
    {
      id: 1,
      image: "/valentines-celebration.png",
      name: "Valentine's Day Celebrations",
      shortIntro: "Celebrate with your loved one at The Royal Bihar Hotel.",
      description: "<div class='container'><p>Experience a romantic evening with your partner.</p></div>",
      terms: "<div class='container'><h2>Terms & Conditions</h2><p>Booking required in advance.</p></div>",
    },
    {
      id: 2,
      image: "/valentines-spa.png",
      name: "Valentine's Eternal Spa Week Awaits",
      shortIntro: "Pamper yourself and your partner with our special spa treatments.",
      description: "<h1>Valentine's Eternal Spa Week</h1><p>Indulge in luxury treatments designed for couples.</p>",
      terms: "<div class='container'><p>Limited availability. Book early to avoid disappointment.</p></div>",
    },
  ])

  const handleOpenDialog = (event = null) => {
    if (event) {
      setCurrentEvent(event)
      setDescription(event.description)
      setTerms(event.terms)
      setMainImagePreview(event.image)
      setEditMode(true)
    } else {
      setCurrentEvent(null)
      setDescription("")
      setTerms("")
      setMainImagePreview("/swimming-pool.png")
      setAdditionalImagePreview("/romantic-dinner.png")
      setEditMode(false)
    }
    setOpenDialog(true)
  }

  const handleMainImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setMainImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setMainImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAdditionalImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAdditionalImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setAdditionalImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveEvent = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const eventName = formData.get("eventName")
    const shortIntro = formData.get("shortIntro")

    if (editMode && currentEvent) {
      // Update existing event
      const updatedEvents = events.map((event) =>
        event.id === currentEvent.id
          ? {
              ...event,
              name: eventName,
              shortIntro: shortIntro,
              description: description,
              terms: terms,
              // In a real app, you would upload the image and get a URL back
              image: mainImagePreview,
            }
          : event,
      )
      setEvents(updatedEvents)
      toast({
        title: "Event Updated",
        description: `${eventName} has been updated successfully.`,
      })
    } else {
      // Add new event
      const newEvent = {
        id: events.length + 1,
        name: eventName,
        shortIntro: shortIntro,
        description: description,
        terms: terms,
        image: mainImagePreview,
      }
      setEvents([...events, newEvent])
      toast({
        title: "Event Added",
        description: `${eventName} has been added successfully.`,
      })
    }
    setOpenDialog(false)
  }

  const handleOpenDeleteDialog = (event) => {
    setEventToDelete(event)
    setShowDeleteDialog(true)
  }

  const handleDeleteEvent = (id) => {
    const updatedEvents = events.filter((event) => event.id !== id)
    setEvents(updatedEvents)
    toast({
      title: "Event Deleted",
      description: "The event has been deleted successfully.",
    })
    setShowDeleteDialog(false)
    setEventToDelete(null)
  }

  const handlePreviewEvent = (event) => {
    setPreviewEvent(event)
    setShowPreview(true)
  }

  const handleSelectEvent = (eventId) => {
    if (selectedEvents.includes(eventId)) {
      setSelectedEvents(selectedEvents.filter((id) => id !== eventId))
    } else {
      setSelectedEvents([...selectedEvents, eventId])
    }
  }

  const handleSelectAllEvents = (e) => {
    if (e.target.checked) {
      setSelectedEvents(events.map((event) => event.id))
    } else {
      setSelectedEvents([])
    }
  }

  const handleBatchDelete = () => {
    if (selectedEvents.length > 0) {
      setShowBatchDeleteDialog(true)
    } else {
      toast({
        title: "No events selected",
        description: "Please select at least one event to delete.",
        variant: "destructive",
      })
    }
  }

  const confirmBatchDelete = () => {
    const updatedEvents = events.filter((event) => !selectedEvents.includes(event.id))
    setEvents(updatedEvents)
    toast({
      title: "Events Deleted",
      description: `${selectedEvents.length} event(s) have been deleted successfully.`,
    })
    setSelectedEvents([])
    setShowBatchDeleteDialog(false)
  }

  // Render a card view for mobile screens
  const renderMobileView = () => {
    return (
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {events.map((event) => (
          <div
            key={event.id}
            className={`bg-white rounded-lg shadow overflow-hidden ${selectedEvents.includes(event.id) ? "border-2 border-amber-500" : ""}`}
          >
            <div className="relative h-40">
              <img src={event.image || "/placeholder.svg"} alt={event.name} className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2">
                <input
                  type="checkbox"
                  checked={selectedEvents.includes(event.id)}
                  onChange={() => handleSelectEvent(event.id)}
                  className="h-5 w-5 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                />
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{event.name}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{event.shortIntro}</p>

              <div className="flex justify-between items-center mt-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => handleOpenDialog(event)}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit this event</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleOpenDeleteDialog(event)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete this event</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        ))}
        {events.length === 0 && (
          <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
            No events found. Click the "Add Event" button to create one.
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <PageHeader
        heading="Manage Events"
        text="You can manage different types of special events. Just click on the 'Add Event' button and fill in the form."
      >
        <div className="flex space-x-2">
          {selectedEvents.length > 0 && (
            <Button onClick={handleBatchDelete} variant="destructive" className="text-white">
              <Trash2 className="mr-2 h-4 w-4" /> Delete Selected ({selectedEvents.length})
            </Button>
          )}
          <Button onClick={() => handleOpenDialog()} className="bg-amber-500 hover:bg-amber-600 text-white">
            <Plus className="mr-2 h-4 w-4" /> <span className="hidden sm:inline">Add Event</span>
          </Button>
        </div>
      </PageHeader>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Events</h2>
          <div className="md:hidden">
            <Button onClick={() => handleOpenDialog()} size="sm" className="bg-amber-500 hover:bg-amber-600 text-white">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile view */}
        {renderMobileView()}

        {/* Desktop view */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3 w-[5%]">
                  <input
                    type="checkbox"
                    onChange={handleSelectAllEvents}
                    checked={selectedEvents.length === events.length && events.length > 0}
                    className="rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                  />
                </th>
                <th className="px-6 py-3 w-[5%]">#</th>
                <th className="px-6 py-3 w-[15%]">Image</th>
                <th className="px-6 py-3 w-[20%]">Offer Name</th>
                <th className="px-6 py-3 w-[25%]">Short Intro</th>
                <th className="px-6 py-3 w-[15%] hidden lg:table-cell">Description</th>
                <th className="px-6 py-3 w-[10%] hidden lg:table-cell">Terms</th>
                <th className="px-6 py-3 w-[10%] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map((event) => (
                <tr
                  key={event.id}
                  className={`hover:bg-gray-50 ${selectedEvents.includes(event.id) ? "bg-amber-50" : ""}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <input
                      type="checkbox"
                      checked={selectedEvents.includes(event.id)}
                      onChange={() => handleSelectEvent(event.id)}
                      className="rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center">
                      <img
                        src={event.image || "/placeholder.svg"}
                        alt={event.name}
                        className="h-16 w-16 rounded-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{event.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="max-w-xs overflow-hidden text-ellipsis line-clamp-2">{event.shortIntro}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 hidden lg:table-cell">
                    <div
                      className="max-w-xs overflow-hidden text-ellipsis line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: event.description }}
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 hidden lg:table-cell">
                    <div
                      className="max-w-xs overflow-hidden text-ellipsis line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: event.terms }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePreviewEvent(event)}
                              className="text-green-600 hover:text-green-900"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Preview this event</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenDialog(event)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit this event</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenDeleteDialog(event)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete this event</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    No events found. Click the "Add Event" button to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Event Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{editMode ? "Update Event" : "Add Event"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveEvent} className="space-y-6 py-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="eventName">Event Name</Label>
                <Input
                  id="eventName"
                  name="eventName"
                  defaultValue={currentEvent?.name || ""}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="shortIntro">Short Intro</Label>
                <Textarea
                  id="shortIntro"
                  name="shortIntro"
                  defaultValue={currentEvent?.shortIntro || ""}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <div className="mt-1 border rounded-md overflow-hidden">
                  <RichTextEditor id="description" value={description} onChange={setDescription} />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Upload Main Image</Label>
                  <div className="border rounded-md p-4">
                    <div className="mb-4">
                      <img
                        src={mainImagePreview || "/placeholder.svg"}
                        alt="Main event image"
                        className="w-full h-48 object-cover rounded-md"
                      />
                    </div>
                    <Input type="file" accept="image/*" onChange={handleMainImageChange} className="mt-2" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Upload Additional Image</Label>
                  <div className="border rounded-md p-4">
                    <div className="mb-4">
                      <img
                        src={additionalImagePreview || "/placeholder.svg"}
                        alt="Additional event image"
                        className="w-full h-48 object-cover rounded-md"
                      />
                    </div>
                    <Input type="file" accept="image/*" onChange={handleAdditionalImageChange} className="mt-2" />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="terms">Terms & Conditions</Label>
                <div className="mt-1 border rounded-md overflow-hidden">
                  <RichTextEditor id="terms" value={terms} onChange={setTerms} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch id="published" defaultChecked={true} />
                  <Label htmlFor="published">Publish this event</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="featured" />
                  <Label htmlFor="featured">Feature on homepage</Label>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setOpenDialog(false)} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white w-full sm:w-auto">
                {editMode ? "Update" : "Save"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Event Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Event Preview</DialogTitle>
          </DialogHeader>
          {previewEvent && (
            <div className="space-y-6">
              <div className="relative h-64 rounded-lg overflow-hidden">
                <img
                  src={previewEvent.image || "/placeholder.svg"}
                  alt={previewEvent.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-white">{previewEvent.name}</h2>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Event Overview</h3>
                <p className="text-gray-700">{previewEvent.shortIntro}</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Description</h3>
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: previewEvent.description }} />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Terms & Conditions</h3>
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: previewEvent.terms }} />
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button onClick={() => setShowPreview(false)} className="bg-amber-500 hover:bg-amber-600 text-white">
                  Close Preview
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this event?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to delete "{eventToDelete?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => eventToDelete && handleDeleteEvent(eventToDelete.id)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Batch Delete Confirmation Dialog */}
      <AlertDialog open={showBatchDeleteDialog} onOpenChange={setShowBatchDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete these events?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to delete {selectedEvents.length} event(s). This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBatchDelete} className="bg-red-600 hover:bg-red-700 text-white">
              Delete {selectedEvents.length} Event{selectedEvents.length !== 1 ? "s" : ""}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
