import type React from "react"
import { Toaster } from "@/components/toaster"

export default function OffersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <Toaster />
    </>
  )
}
