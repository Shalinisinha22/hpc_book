"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import RichTextEditor from "./rich-text-editor"
import Image from "next/image"

interface Offer {
  id: number
  name: string
  rateCode: string
  shortIntro: string
  description: string
  terms: string
  emailText: string
  imageUrl: string
}

interface AddOfferFormProps {
  offer: Offer | null
  onSave: (offer: Omit<Offer, "id">) => void
  onCancel: () => void
}

export function AddOfferForm({ offer, onSave, onCancel }: AddOfferFormProps) {
  const [name, setName] = useState(offer?.name || "")
  const [rateCode, setRateCode] = useState(offer?.rateCode || "")
  const [shortIntro, setShortIntro] = useState(offer?.shortIntro || "")
  const [description, setDescription] = useState(offer?.description || "")
  const [terms, setTerms] = useState(offer?.terms || "")
  const [emailText, setEmailText] = useState(offer?.emailText || "")
  const [imageUrl, setImageUrl] = useState(offer?.imageUrl || "")
  const [previewImage, setPreviewImage] = useState<string | null>(offer?.imageUrl || null)

  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, you would upload the file to a server
      // For now, we'll just create a local URL for preview
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        setPreviewImage(result)
        // In a real app, you would set imageUrl to the URL returned from the server
        setImageUrl(`/placeholder-${file.name}`)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const newErrors: Record<string, string> = {}
    if (!name.trim()) newErrors.name = "Offer name is required"
    if (!rateCode.trim()) newErrors.rateCode = "Rate code is required"
    if (!shortIntro.trim()) newErrors.shortIntro = "Short intro is required"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Submit form
    onSave({
      name,
      rateCode,
      shortIntro,
      description,
      terms,
      emailText,
      imageUrl: previewImage || "/placeholder.svg",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="name">Offer Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <Label htmlFor="rateCode">Offer Rate Code</Label>
          <Input
            id="rateCode"
            value={rateCode}
            onChange={(e) => setRateCode(e.target.value)}
            className={errors.rateCode ? "border-red-500" : ""}
          />
          {errors.rateCode && <p className="text-red-500 text-sm mt-1">{errors.rateCode}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="shortIntro">Short Intro</Label>
        <Textarea
          id="shortIntro"
          value={shortIntro}
          onChange={(e) => setShortIntro(e.target.value)}
          className={`resize-none ${errors.shortIntro ? "border-red-500" : ""}`}
          rows={3}
        />
        {errors.shortIntro && <p className="text-red-500 text-sm mt-1">{errors.shortIntro}</p>}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <RichTextEditor value={description} onChange={setDescription} />
      </div>

      <div>
        <Label htmlFor="terms">Terms & Conditions</Label>
        <RichTextEditor value={terms} onChange={setTerms} />
      </div>

      <div>
        <Label htmlFor="emailText">Email Text</Label>
        <RichTextEditor value={emailText} onChange={setEmailText} />
      </div>

      <div>
        <Label htmlFor="image">Upload Image</Label>
        <div className="mt-2 flex items-center gap-4">
          <Input id="image" type="file" accept="image/*" onChange={handleImageChange} className="max-w-xs" />
          {previewImage && (
            <div className="relative h-20 w-20 rounded-full overflow-hidden border">
              <Image src={previewImage || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-gold hover:bg-gold/90 text-white">
          Save Offer
        </Button>
      </div>
    </form>
  )
}
