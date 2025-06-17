"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import RichTextEditor from "@/components/rich-text-editor"
import { useToast } from "@/components/ui/use-toast"

export function AddHallForm({ onSubmit, initialData = null, onCancel }) {
  const { toast } = useToast()
  const [imagePreview, setImagePreview] = useState(null)
  const [newDetail, setNewDetail] = useState("")
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
    image: null,
    imageUrl: "",
    phone: "",
    email:"",
    seatingStyles: {
      theater: "",
      uShaped: "",
      boardroom: "",
      classroom: "",
      reception: "",
    },
    additionalDetails: [],
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

      // Map backend data to form structure
      setFormData({
        id: initialData._id || initialData.id || null,
        name: initialData.hall_name || initialData.name || "",
        maxCapacity: (initialData.max_capacity || initialData.maxCapacity)?.toString() || "",
        shortIntro: initialData.short_intro || initialData.shortIntro || "",
        description: initialData.desc || initialData.description || "",
        length: length || initialData.length?.toString() || "",
        breadth: breadth || initialData.breadth?.toString() || "",
        height: height || initialData.height?.toString() || "",
        area: initialData.area?.toString() || "",
        guestEntryPoint: initialData.guest_entry_point || initialData.guestEntryPoint || "",
        phone:initialData.phone || "",
        email:initialData.email || "",
        image: null,
        imageUrl: initialData.hall_image?.[0]?.url || initialData.image || initialData.imageUrl || "",
        seatingStyles: {
          theater: initialData.seating?.theatre?.toString() || initialData.seatingStyles?.theater || "",
          uShaped: initialData.seating?.ushaped?.toString() || initialData.seatingStyles?.uShaped || "",
          boardroom: initialData.seating?.boardroom?.toString() || initialData.seatingStyles?.boardroom || "",
          classroom: initialData.seating?.classroom?.toString() || initialData.seatingStyles?.classroom || "",
          reception: initialData.seating?.reception?.toString() || initialData.seatingStyles?.reception || "",
        },
        additionalDetails: initialData.additionalDetails || [],
      })

      // Set image preview
      const imageUrl = initialData.hall_image?.[0]?.url || initialData.image || initialData.imageUrl
      if (imageUrl) {
        setImagePreview(imageUrl)
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

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Error",
          description: "Please select an image file",
          variant: "destructive",
        })
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast({
          title: "Error",
          description: "Image must be less than 5MB",
          variant: "destructive",
        })
        return
      }

      // Update form data with the file
      setFormData((prev) => ({
        ...prev,
        image: file,
      }))

      // Create preview
      const reader = new FileReader()
      reader.onload = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (!formData.name || !formData.maxCapacity || !formData.shortIntro) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // Create submission data object (not FormData)
    const submissionData = {
      id: formData.id,
      name: formData.name,
      maxCapacity: formData.maxCapacity,
      shortIntro: formData.shortIntro,
      description: formData.description,
      length: formData.length,
      breadth: formData.breadth,
      height: formData.height,
      area: formData.area,
      guestEntryPoint: formData.guestEntryPoint,
      phone:formData.phone,
      email:formData.email,
      seatingStyles: {
        theater: formData.seatingStyles.theater,
        uShaped: formData.seatingStyles.uShaped,
        boardroom: formData.seatingStyles.boardroom,
        classroom: formData.seatingStyles.classroom,
        reception: formData.seatingStyles.reception,
      },
      additionalDetails: formData.additionalDetails,
      // Pass the image file directly
      image: formData.image,
      imageUrl: formData.imageUrl,
    }

    console.log('Form submitting data:', submissionData)
    console.log('Image type:', typeof submissionData.image)
    console.log('Image instanceof File:', submissionData.image instanceof File)

    try {
      await onSubmit(submissionData)
    } catch (error) {
      console.error('Form submission error:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to save hall",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="name">Hall Name *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Hall Name"
            className="mt-1"
            required
          />
        </div>
        <div>
          <Label htmlFor="maxCapacity">Max Capacity *</Label>
          <Input
            id="maxCapacity"
            name="maxCapacity"
            value={formData.maxCapacity}
            onChange={handleChange}
            placeholder="Max Capacity"
            type="number"
            className="mt-1"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="shortIntro">Short Intro *</Label>
        <Textarea
          id="shortIntro"
          name="shortIntro"
          value={formData.shortIntro}
          onChange={handleChange}
          placeholder="Enter your short intro of hall"
          className="mt-1"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <RichTextEditor id="description" value={formData.description} onChange={handleDescriptionChange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Label htmlFor="length">Length (ft.)</Label>
          <Input
            id="length"
            name="length"
            value={formData.length}
            onChange={handleChange}
            placeholder="L (Mt.)"
            type="number"
            step="0.1"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="breadth">Breadth (ft.)</Label>
          <Input
            id="breadth"
            name="breadth"
            value={formData.breadth}
            onChange={handleChange}
            placeholder="B (Mt.)"
            type="number"
            step="0.1"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="height">Height (ft.)</Label>
          <Input
            id="height"
            name="height"
            value={formData.height}
            onChange={handleChange}
            placeholder="Height (Mt.)"
            type="number"
            step="0.1"
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="area">Area (Sq. ft.)</Label>
          <Input
            id="area"
            name="area"
            value={formData.area}
            onChange={handleChange}
            placeholder="Area (Sq. Mt.)"
            type="number"
            step="0.1"
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
            type="number"
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
            type="tel"
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
              type="number"
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
              type="number"
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
              type="number"
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
              type="number"
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
              type="number"
              className="mt-1"
            />
          </div>
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
                setFormData({
                  ...formData,
                  additionalDetails: [...(formData.additionalDetails || []), newDetail.trim()]
                })
                setNewDetail('')
              }
            }}
          >
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.additionalDetails?.map((detail, index) => (
            <div
              key={index}
              className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2"
            >
              <span>{detail}</span>
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    ...formData,
                    additionalDetails: formData.additionalDetails?.filter((_, i) => i !== index)
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

      <div>
        <Label htmlFor="image">Upload Image</Label>
        <div className="mt-1 flex items-center">
          <Input 
            id="image" 
            name="image" 
            type="file" 
            accept="image/*" 
            onChange={handleImageChange} 
            className="mt-1" 
          />
        </div>
        {imagePreview && (
          <div className="mt-4 flex justify-center">
            <div className="w-64 h-64 relative border rounded-md overflow-hidden">
              <img 
                src={imagePreview || "/placeholder.svg"} 
                alt="Hall preview" 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-start space-x-2">
        <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
          {initialData ? "Update Hall" : "Save Hall"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}