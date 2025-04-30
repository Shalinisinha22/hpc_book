import type React from "react"
import Sidebar from "@/components/sidebar"
import { Toaster } from "@/components/toaster"

export default function DiningLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeItem="Dinings" />
      <main className="flex-1 overflow-y-auto">{children}</main>
      <Toaster />
    </div>
  )
}
