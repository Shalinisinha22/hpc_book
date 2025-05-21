"use client"

import { useState } from "react"
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

// Sample hall data
const initialHalls = [
  {
    id: 1,
    name: "Swarn Mahal",
    image: "/hall-swarn-mahal.png",
    maxCapacity: 600,
    shortIntro: "Unforgettable experiences...",
    description: "<p>Welcome to our the Royal...</p>",
    dimensions: "40 x 125 x 22 Mt.",
    area: 5000,
    guestEntryPoint: "",
    phone: "",
    email: "",
    seatingStyles: {
      theater: "",
      circular: "",
      uShaped: "",
      boardroom: "",
      classroom: "",
      reception: "",
    },
  },
  {
    id: 2,
    name: "Crystal",
    image: "/hall-crystal.png",
    maxCapacity: 30,
    shortIntro: "A stunning venue that co...",
    description: "<p>There is enough room i...</p>",
    dimensions: "21 x 38 x 9 Mt.",
    area: 800,
    guestEntryPoint: "",
    phone: "",
    email: "",
    seatingStyles: {
      theater: "",
      circular: "",
      uShaped: "",
      boardroom: "",
      classroom: "",
      reception: "",
    },
  },
  {
    id: 3,
    name: "Suloon",
    image: "/hall-suloon.png",
    maxCapacity: 80,
    shortIntro: "A captivating venue that ...",
    description: "<p>Sammaan Meeting &amp; ...</p>",
    dimensions: "21 x 38 x 9 Mt.",
    area: 800,
    guestEntryPoint: "",
    phone: "",
    email: "",
    seatingStyles: {
      theater: "",
      circular: "",
      uShaped: "",
      boardroom: "",
      classroom: "",
      reception: "",
    },
  },
  {
    id: 4,
    name: "Magadh",
    image: "/hall-magadh.png",
    maxCapacity: 125,
    shortIntro: "A premier meeting and eve...",
    description: "<p>The famous and well-eq...</p>",
    dimensions: "38 x 20 x 8 Mt.",
    area: 760,
    guestEntryPoint: "",
    phone: "",
    email: "",
    seatingStyles: {
      theater: "",
      circular: "",
      uShaped: "",
      boardroom: "",
      classroom: "",
      reception: "",
    },
  },
  {
    id: 5,
    name: "Mithila",
    image: "/hall-mithila.png",
    maxCapacity: 80,
    shortIntro: "A captivating venue that...",
    description: "<p>The leading location M...</p>",
    dimensions: "39 x 36 x 9 Mt.",
    area: 1404,
    guestEntryPoint: "",
    phone: "",
    email: "",
    seatingStyles: {
      theater: "",
      circular: "",
      uShaped: "",
      boardroom: "",
      classroom: "",
      reception: "",
    },
  },
]

export default function HallsPage() {
  const [halls, setHalls] = useState(initialHalls)
  const [isAddHallOpen, setIsAddHallOpen] = useState(false)
  const [editingHall, setEditingHall] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [hallToDelete, setHallToDelete] = useState(null)
  const { toast } = useToast()

  const handleAddHall = (newHall) => {
    const id = halls.length > 0 ? Math.max(...halls.map((hall) => hall.id)) + 1 : 1

    // Ensure numeric values are properly converted
    const processedHall = {
      ...newHall,
      id,
      maxCapacity: Number.parseInt(newHall.maxCapacity) || 0,
      area: Number.parseInt(newHall.area) || 0,
    }

    setHalls([...halls, processedHall])
    setIsAddHallOpen(false)
    toast({
      title: "Hall added",
      description: `${newHall.name} has been added successfully.`,
    })
  }

  const handleEditHall = (hall) => {
    setEditingHall(hall)
    setIsAddHallOpen(true)
  }

  const handleUpdateHall = (updatedHall) => {
    // Ensure numeric values are properly converted
    const processedHall = {
      ...updatedHall,
      maxCapacity: Number.parseInt(updatedHall.maxCapacity) || 0,
      area: Number.parseInt(updatedHall.area) || 0,
    }

    setHalls(halls.map((hall) => (hall.id === processedHall.id ? processedHall : hall)))
    setIsAddHallOpen(false)
    setEditingHall(null)
    toast({
      title: "Hall updated",
      description: `${updatedHall.name} has been updated successfully.`,
    })
  }

  const showDeleteConfirmation = (hall) => {
    setHallToDelete(hall)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteHall = (id) => {
    setHalls(halls.filter((hall) => hall.id !== id))
    setIsDeleteDialogOpen(false)
    toast({
      title: "Hall deleted",
      description: "The hall has been deleted successfully.",
    })
  }

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
              {halls.map((hall, index) => (
                <tr key={hall.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden">
                      <img
                        src={hall.image || "/placeholder.svg?height=64&width=64&query=hall"}
                        alt={hall.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="py-3 px-4">{hall.name}</td>
                  <td className="py-3 px-4">{hall.maxCapacity}</td>
                  <td className="py-3 px-4 max-w-[200px] truncate">{hall.shortIntro}</td>
                  <td
                    className="py-3 px-4 max-w-[200px] truncate"
                    dangerouslySetInnerHTML={{ __html: hall.description }}
                  ></td>
                  <td className="py-3 px-4">{hall.dimensions}</td>
                  <td className="py-3 px-4">{hall.area}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center space-x-2">
                      <button onClick={() => handleEditHall(hall)} className="p-1 hover:bg-gray-100 rounded-full">
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => showDeleteConfirmation(hall)}
                        className="p-1 hover:bg-gray-100 rounded-full"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isAddHallOpen} onOpenChange={setIsAddHallOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingHall ? "Edit Hall" : "Add Hall"}</DialogTitle>
          </DialogHeader>
          <AddHallForm
            onSubmit={editingHall ? handleUpdateHall : handleAddHall}
            initialData={editingHall}
            onCancel={() => setIsAddHallOpen(false)}
          />
        </DialogContent>
      </Dialog>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this hall?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete {hallToDelete?.name}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => hallToDelete && handleDeleteHall(hallToDelete.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
