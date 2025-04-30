import { Toaster } from "@/components/toaster"
import type React from "react"

export default function FoodFestivalsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster />
    </>
  )
}
