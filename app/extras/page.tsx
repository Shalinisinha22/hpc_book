"use client"

import type React from "react"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit2, Trash2, Download, Printer, FileText } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

// Define the Extra type
interface Extra {
  id: number
  name: string
  price: number
  per: string
  description: string
}

export default function ExtrasPage() {
  const { toast } = useToast()
  const [extras, setExtras] = useState<Extra[]>([
    {
      id: 1,
      name: "Airport Pick Up",
      price: 600,
      per: "Per person",
      description: "Parking charge not included.",
    },
    {
      id: 2,
      name: "Dedicated Wi-Fi",
      price: 500,
      per: "Per person",
      description: "5 MBPS Dedicated Wi-Fi for 12 Hrs.",
    },
  ])

  const [editingExtra, setEditingExtra] = useState<Extra | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Form state for adding a new extra
  const [newExtra, setNewExtra] = useState({
    name: "",
    price: "",
    per: "Per booking",
    description: "",
  })

  // Handle input change for the add form
  const handleAddInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewExtra({
      ...newExtra,
      [name]: value,
    })
  }

  // Handle select change for the add form
  const handleAddSelectChange = (value: string) => {
    setNewExtra({
      ...newExtra,
      per: value,
    })
  }

  // Handle save for adding a new extra
  const handleAddSave = () => {
    if (!newExtra.name || !newExtra.price) {
      toast({
        title: "Error",
        description: "Name and price are required fields.",
        variant: "destructive",
      })
      return
    }

    const newId = extras.length > 0 ? Math.max(...extras.map((extra) => extra.id)) + 1 : 1

    setExtras([
      ...extras,
      {
        id: newId,
        name: newExtra.name,
        price: Number.parseFloat(newExtra.price),
        per: newExtra.per,
        description: newExtra.description,
      },
    ])

    // Reset form
    setNewExtra({
      name: "",
      price: "",
      per: "Per booking",
      description: "",
    })

    toast({
      title: "Success",
      description: "Extra added successfully.",
    })
  }

  // Handle edit button click
  const handleEditClick = (extra: Extra) => {
    setEditingExtra(extra)
    setIsEditDialogOpen(true)
  }

  // Handle input change for the edit form
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editingExtra) return

    const { name, value } = e.target
    setEditingExtra({
      ...editingExtra,
      [name]: value,
    })
  }

  // Handle select change for the edit form
  const handleEditSelectChange = (value: string) => {
    if (!editingExtra) return

    setEditingExtra({
      ...editingExtra,
      per: value,
    })
  }

  // Handle save for editing an extra
  const handleEditSave = () => {
    if (!editingExtra) return

    if (!editingExtra.name || !editingExtra.price) {
      toast({
        title: "Error",
        description: "Name and price are required fields.",
        variant: "destructive",
      })
      return
    }

    setExtras(extras.map((extra) => (extra.id === editingExtra.id ? editingExtra : extra)))

    setIsEditDialogOpen(false)
    setEditingExtra(null)

    toast({
      title: "Success",
      description: "Extra updated successfully.",
    })
  }

  // Handle delete button click
  const handleDelete = (id: number) => {
    setExtras(extras.filter((extra) => extra.id !== id))

    toast({
      title: "Success",
      description: "Extra deleted successfully.",
    })
  }

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        heading="Manage Extras"
        subheading="These are special items and/or services which your clients can book. For example a breakfast, airport pickup, or anything else that you offer."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Extras</h2>

            <div className="flex flex-wrap gap-2 mb-4">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Printer className="h-4 w-4" />
                <span>Print</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                <span>Excel</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>PDF</span>
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-sm text-gray-500">#</th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-gray-500">NAME</th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-gray-500">PRICE</th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-gray-500">PER</th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-gray-500">DESCRIPTION</th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-gray-500">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {extras.length > 0 ? (
                    extras.map((extra) => (
                      <tr key={extra.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">{extra.id}</td>
                        <td className="py-3 px-4">{extra.name}</td>
                        <td className="py-3 px-4">{extra.price}</td>
                        <td className="py-3 px-4">{extra.per}</td>
                        <td className="py-3 px-4">{extra.description}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditClick(extra)}
                              className="h-8 w-8 text-gray-500 hover:text-gray-700"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(extra.id)}
                              className="h-8 w-8 text-gray-500 hover:text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-4 px-4 text-center text-gray-500">
                        No extras available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Add an extra</h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Name"
                  value={newExtra.name}
                  onChange={handleAddInputChange}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="price">Price</Label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-500">₹</span>
                  </div>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    placeholder="Price"
                    value={newExtra.price}
                    onChange={handleAddInputChange}
                    className="pl-7"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Description"
                  value={newExtra.description}
                  onChange={handleAddInputChange}
                  className="mt-1 resize-none h-24"
                />
              </div>

              <div>
                <Label htmlFor="per">Per</Label>
                <Select value={newExtra.per} onValueChange={handleAddSelectChange}>
                  <SelectTrigger id="per" className="mt-1">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Per booking">Per booking</SelectItem>
                    <SelectItem value="Per person">Per person</SelectItem>
                    <SelectItem value="Per night">Per night</SelectItem>
                    <SelectItem value="Per day">Per day</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleAddSave} className="bg-amber-500 hover:bg-amber-600 text-white">
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Extra</DialogTitle>
          </DialogHeader>

          {editingExtra && (
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  name="name"
                  placeholder="Name"
                  value={editingExtra.name}
                  onChange={handleEditInputChange}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="edit-price">Price</Label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-500">₹</span>
                  </div>
                  <Input
                    id="edit-price"
                    name="price"
                    type="number"
                    placeholder="Price"
                    value={editingExtra.price}
                    onChange={handleEditInputChange}
                    className="pl-7"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  placeholder="Description"
                  value={editingExtra.description}
                  onChange={handleEditInputChange}
                  className="mt-1 resize-none h-24"
                />
              </div>

              <div>
                <Label htmlFor="edit-per">Per</Label>
                <Select value={editingExtra.per} onValueChange={handleEditSelectChange}>
                  <SelectTrigger id="edit-per" className="mt-1">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Per booking">Per booking</SelectItem>
                    <SelectItem value="Per person">Per person</SelectItem>
                    <SelectItem value="Per night">Per night</SelectItem>
                    <SelectItem value="Per day">Per day</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleEditSave} className="bg-amber-500 hover:bg-amber-600 text-white">
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
