"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import RichTextEditor from "@/components/rich-text-editor" // Changed from named import to default import
import { useToast } from "@/components/ui/use-toast"

export function AddHallForm({ onSubmit, initialData = null, onCancel }) {
  const { toast } = useToast()
  const [imagePreview, setImagePreview] = useState(null)
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    maxCapacity: "",
    shortIntro: "",
    description: "",
    length: "",
    breadth: "",
    height: "",
    area: "",
    guestEntryPoint: "",
    phone: "",
    email: "",
    image: null,
    imageUrl: "",
    seatingStyles: {
      theater: "",
      circular: "",
      uShaped: "",
      boardroom: "",
      classroom: "",
      reception: "",
    },
  })

  // Initialize form with initial data if provided
  useEffect(() => {
    if (initialData) {
      // Extract dimensions if available
      let length = "",
        breadth = "",
        height = ""
      if (initialData.dimensions) {
        const parts = initialData.dimensions.split("x").map((part) => part.trim())
        if (parts.length === 3) {
          length = parts[0].replace(/[^\d.]/g, "") || ""
          breadth = parts[1].replace(/[^\d.]/g, "") || ""
          height = parts[2].replace(/[^\d.]/g, "") || ""
        }
      }

      setFormData({
        id: initialData.id || null,
        name: initialData.name || "",
        maxCapacity: initialData.maxCapacity?.toString() || "",
        shortIntro: initialData.shortIntro || "",
        description: initialData.description || "",
        length: length,
        breadth: breadth,
        height: height,
        area: initialData.area?.toString() || "",
        guestEntryPoint: initialData.guestEntryPoint || "",
        phone: initialData.phone || "",
        email: initialData.email || "",
        image: null,
        imageUrl: initialData.image || "",
        seatingStyles: {
          theater: initialData.seatingStyles?.theater || "",
          circular: initialData.seatingStyles?.circular || "",
          uShaped: initialData.seatingStyles?.uShaped || "",
          boardroom: initialData.seatingStyles?.boardroom || "",
          classroom: initialData.seatingStyles?.classroom || "",
          reception: initialData.seatingStyles?.reception || "",
        },
      })

      if (initialData.image) {
        setImagePreview(initialData.image)
      }
    }
  }, [initialData])

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value || "",
        },
      })
    } else {
      setFormData({
        ...formData,
        [name]: value || "",
      })
    }
  }

  const handleDescriptionChange = (content) => {
    setFormData({
      ...formData,
      description: content || "",
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({
        ...formData,
        image: file,
      })

      const reader = new FileReader()
      reader.onload = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validation
    if (!formData.name) {
      toast({
        title: "Validation Error",
        description: "Hall name is required",
        variant: "destructive",
      })
      return
    }

    // Combine dimensions
    const dimensions = `${formData.length} x ${formData.breadth} x ${formData.height} Mt.`

    // Prepare data for submission
    const submissionData = {
      ...formData,
      dimensions,
      // Use the preview URL if no new image was uploaded
      image: imagePreview || "/grand-hallway.png",
    }

    onSubmit(submissionData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="name">Hall Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Hall Name"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="maxCapacity">Max Capacity</Label>
          <Input
            id="maxCapacity"
            name="maxCapacity"
            value={formData.maxCapacity}
            onChange={handleChange}
            placeholder="Max Capacity"
            type="number"
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="shortIntro">Short Intro</Label>
        <Textarea
          id="shortIntro"
          name="shortIntro"
          value={formData.shortIntro}
          onChange={handleChange}
          placeholder="Enter your short intro of hall"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <RichTextEditor id="description" value={formData.description} onChange={handleDescriptionChange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Label htmlFor="length">Length (Mt.)</Label>
          <Input
            id="length"
            name="length"
            value={formData.length}
            onChange={handleChange}
            placeholder="L (Mt.)"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="breadth">Breadth (Mt.)</Label>
          <Input
            id="breadth"
            name="breadth"
            value={formData.breadth}
            onChange={handleChange}
            placeholder="B (Mt.)"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="height">Height (Mt.)</Label>
          <Input
            id="height"
            name="height"
            value={formData.height}
            onChange={handleChange}
            placeholder="Height (Mt.)"
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="area">Area (Sq. Mt.)</Label>
          <Input
            id="area"
            name="area"
            value={formData.area}
            onChange={handleChange}
            placeholder="Area (Sq. Mt.)"
            type="number"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="guestEntryPoint">Guest Entry Point (#)</Label>
          <Input
            id="guestEntryPoint"
            name="guestEntryPoint"
            value={formData.guestEntryPoint}
            onChange={handleChange}
            placeholder="No of Entry Point"
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            type="email"
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label className="block text-sm font-medium text-gray-700 mb-4">SEATING STYLE</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label htmlFor="theater">Theater</Label>
            <Input
              id="theater"
              name="seatingStyles.theater"
              value={formData.seatingStyles.theater}
              onChange={handleChange}
              placeholder="Theater"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="circular">Circular</Label>
            <Input
              id="circular"
              name="seatingStyles.circular"
              value={formData.seatingStyles.circular}
              onChange={handleChange}
              placeholder="Circular"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="uShaped">U-Shaped</Label>
            <Input
              id="uShaped"
              name="seatingStyles.uShaped"
              value={formData.seatingStyles.uShaped}
              onChange={handleChange}
              placeholder="U-Shaped"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="boardroom">Boardroom</Label>
            <Input
              id="boardroom"
              name="seatingStyles.boardroom"
              value={formData.seatingStyles.boardroom}
              onChange={handleChange}
              placeholder="Boardroom"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="classroom">Classroom</Label>
            <Input
              id="classroom"
              name="seatingStyles.classroom"
              value={formData.seatingStyles.classroom}
              onChange={handleChange}
              placeholder="Classroom"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="reception">Reception</Label>
            <Input
              id="reception"
              name="seatingStyles.reception"
              value={formData.seatingStyles.reception}
              onChange={handleChange}
              placeholder="Reception"
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="image">Upload Image</Label>
        <div className="mt-1 flex items-center">
          <Input id="image" name="image" type="file" accept="image/*" onChange={handleImageChange} className="mt-1" />
        </div>
        {imagePreview && (
          <div className="mt-4 flex justify-center">
            <div className="w-64 h-64 relative border rounded-md overflow-hidden">
              <img src={imagePreview || "/placeholder.svg"} alt="Hall preview" className="w-full h-full object-cover" />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-start">
        <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
          Save
        </Button>
        <Button type="button" variant="outline" className="ml-2" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
