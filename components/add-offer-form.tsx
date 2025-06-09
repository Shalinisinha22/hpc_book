"use client"

import type React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import RichTextEditor from "./rich-text-editor"
import Image from "next/image"

// Update the interface to match the API data structure
interface Offer {
  _id: string
  offer_name: string
  offer_rate_code: string
  short_intro: string
  desc: string
  terms: string
  email_text: string
  status: string
  image?: {
    url: string
    name: string
    ext: string
  }
}

interface AddOfferFormProps {
  offer: Offer | null
  onSave: (offer: Omit<Offer, "id">) => void
  onCancel: () => void
}

// Define validation schema
const offerSchema = z.object({
  offer_name: z.string().min(1, "Offer name is required"),
  offer_rate_code: z.string().min(1, "Rate code is required"),
  short_intro: z.string().min(1, "Short intro is required"),
  desc: z.string().optional(),
  terms: z.string().optional(),
  email_text: z.string().optional(),
  image: z.any().optional(),
})

type OfferFormData = z.infer<typeof offerSchema>

export function AddOfferForm({ offer, onSave, onCancel }: AddOfferFormProps) {
  // Remove duplicate state management, use only React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<OfferFormData>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      offer_name: offer?.offer_name || "",
      offer_rate_code: offer?.offer_rate_code || "",
      short_intro: offer?.short_intro || "",
      desc: offer?.desc || "",
      terms: offer?.terms || "",
      email_text: offer?.email_text || "",
    },
  })

  const [description, setDescription] = useState(offer?.desc || "")
  const [terms, setTerms] = useState(offer?.terms || "")
  const [emailText, setEmailText] = useState(offer?.email_text || "")
  const [previewImage, setPreviewImage] = useState(offer?.image?.url || "")
  const imageInputRef = useRef<HTMLInputElement | null>(null)

  // Update form when offer changes
  useEffect(() => {
    if (offer) {
      setValue("offer_name", offer.offer_name)
      setValue("offer_rate_code", offer.offer_rate_code)
      setValue("short_intro", offer.short_intro)
      setDescription(offer.desc || "")
      setTerms(offer.terms || "")
      setEmailText(offer.email_text || "")
      setPreviewImage(offer.image?.url || "")
    }
  }, [offer, setValue])

  // Handle form submission
  const handleFormSubmit = async (data: OfferFormData) => {
    try {
      const formData = new FormData()
      formData.append("offer_name", data.offer_name)
      formData.append("offer_rate_code", data.offer_rate_code)
      formData.append("short_intro", data.short_intro)
      formData.append("desc", description)
      formData.append("terms", terms)
      formData.append("email_text", emailText)
      formData.append("status", "active")

      // Handle image
      const imageFile = imageInputRef.current?.files?.[0]
      if (imageFile) {
        formData.append("image", imageFile)
      } else if (offer?.image) {
        // If editing and no new image selected, keep existing image
        formData.append("image", JSON.stringify(offer.image))
      }

      await onSave(formData)
    } catch (error) {
      console.error("Form submission error:", error)
    }
  }

  // Handle image file selection and validation
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        alert("File size must be less than 2MB")
        e.target.value = ""
        return
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("File must be an image")
        e.target.value = ""
        return
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setPreviewImage(previewUrl)

      // Clean up the old preview URL when component unmounts
      return () => URL.revokeObjectURL(previewUrl)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="name">Offer Name</Label>
          <Input
            id="name"
            {...register("offer_name")}
            className={errors.offer_name ? "border-red-500" : ""}
          />
          {errors.offer_name && (
            <span className="text-sm text-red-500">{errors.offer_name.message}</span>
          )}
        </div>

        <div>
          <Label htmlFor="rateCode">Offer Rate Code</Label>
          <Input
            id="rateCode"
            {...register("offer_rate_code")}
            className={errors.rateCode ? "border-red-500" : ""}
          />
          {errors.rateCode && (
            <p className="text-red-500 text-sm mt-1">{errors.rateCode.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="shortIntro">Short Intro</Label>
        <Textarea
          id="shortIntro"
          {...register("short_intro")}
          className={`resize-none ${errors.shortIntro ? "border-red-500" : ""}`}
          rows={3}
        />
        {errors.shortIntro && (
          <p className="text-red-500 text-sm mt-1">{errors.shortIntro.message}</p>
        )}
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
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="max-w-xs"
            ref={imageInputRef}
          />
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
