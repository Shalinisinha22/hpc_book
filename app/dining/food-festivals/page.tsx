"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/components/ui/use-toast"
import RichTextEditor from "@/components/rich-text-editor"
import { cn } from "@/lib/utils"

// Sample data for food festivals
const initialFestivals = [
  {
    id: 1,
    name: "Summer Food Fiesta",
    description: "A celebration of summer flavors with special dishes from around the world.",
    startDate: new Date(2023, 5, 15),
    endDate: new Date(2023, 5, 30),
    image: "/elegant-hotel-dining.png",
  },
  {
    id: 2,
    name: "Autumn Harvest Festival",
    description: "Celebrating the bounty of autumn with seasonal ingredients and traditional recipes.",
    startDate: new Date(2023, 8, 10),
    endDate: new Date(2023, 8, 25),
    image: "/opulent-marble-spa.png",
  },
]

export default function FoodFestivalsPage() {
  const [festivals, setFestivals] = useState(initialFestivals)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newFestival, setNewFestival] = useState({
    name: "",
    description: "",
    startDate: null as Date | null,
    endDate: null as Date | null,
    image: null as File | null,
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setNewFestival({ ...newFestival, image: file })
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleDescriptionChange = (value: string) => {
    setNewFestival({ ...newFestival, description: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate form
    if (
      !newFestival.name ||
      !newFestival.description ||
      !newFestival.startDate ||
      !newFestival.endDate ||
      !newFestival.image
    ) {
      toast({
        title: "Error",
        description: "Please fill in all fields and upload an image.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      const newId = festivals.length > 0 ? Math.max(...festivals.map((f) => f.id)) + 1 : 1
      const imageUrl = imagePreview || "/elegant-hotel-dining.png" // Fallback if preview is not available

      setFestivals([
        ...festivals,
        {
          id: newId,
          name: newFestival.name,
          description: newFestival.description,
          startDate: newFestival.startDate!,
          endDate: newFestival.endDate!,
          image: imageUrl,
        },
      ])

      // Reset form
      setNewFestival({
        name: "",
        description: "",
        startDate: null,
        endDate: null,
        image: null,
      })
      setImagePreview(null)
      setIsAddDialogOpen(false)
      setIsSubmitting(false)

      toast({
        title: "Success",
        description: "Festival added successfully",
      })
    }, 1000)
  }

  const handleDelete = (id: number) => {
    setFestivals(festivals.filter((festival) => festival.id !== id))
    toast({
      title: "Success",
      description: "Festival deleted successfully",
    })
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Food Festivals</h1>
          <p className="text-sm text-gray-500 mt-1">Manage food festivals and special culinary events.</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Food Festival
        </Button>
      </div>

      <div className="rounded-lg border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Festival Name</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Start Date</th>
                <th className="px-4 py-3">End Date</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {festivals.map((festival, index) => (
                <tr key={festival.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">
                    <div className="h-12 w-16 overflow-hidden rounded-md">
                      <img
                        src={festival.image || "/placeholder.svg"}
                        alt={festival.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium">{festival.name}</td>
                  <td className="px-4 py-3 max-w-xs truncate">
                    {festival.description.replace(/<[^>]*>/g, "").substring(0, 100)}...
                  </td>
                  <td className="px-4 py-3">{format(festival.startDate, "MMM dd, yyyy")}</td>
                  <td className="px-4 py-3">{format(festival.endDate, "MMM dd, yyyy")}</td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" title="Edit">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Delete" onClick={() => handleDelete(festival.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {festivals.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    No food festivals found. Add your first food festival.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Food Festival Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Food Festival</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Food Festival Name</Label>
                <Input
                  id="name"
                  value={newFestival.name}
                  onChange={(e) => setNewFestival({ ...newFestival, name: e.target.value })}
                  placeholder="Enter festival name"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <div className="min-h-[200px] border rounded-md">
                  <RichTextEditor value={newFestival.description} onChange={handleDescriptionChange} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !newFestival.startDate && "text-muted-foreground",
                        )}
                      >
                        {newFestival.startDate ? format(newFestival.startDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newFestival.startDate || undefined}
                        onSelect={(date) => setNewFestival({ ...newFestival, startDate: date })}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="grid gap-2">
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !newFestival.endDate && "text-muted-foreground",
                        )}
                      >
                        {newFestival.endDate ? format(newFestival.endDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newFestival.endDate || undefined}
                        onSelect={(date) => setNewFestival({ ...newFestival, endDate: date })}
                        disabled={(date) => (newFestival.startDate ? date < newFestival.startDate : false)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="image">Upload Image</Label>
                <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
                {imagePreview && (
                  <div className="mt-2 relative h-40 rounded-md overflow-hidden">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Festival preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
