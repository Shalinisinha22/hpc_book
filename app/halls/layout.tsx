"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuthStore } from "@/lib/auth-store"
import { Sidebar } from "@/components/sidebar"
import { Toaster } from "@/components/toaster"

export default function HallsLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  // Determine the active item based on the current path
  const getActiveItem = () => {
    if (pathname === "/halls") {
      return "Halls"
    } else if (pathname === "/halls/booking-requests") {
      return "Booking Requests"
    }
    return "Halls"
  }

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null // Return null while redirecting
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeItem={getActiveItem()} />
      <main className="flex-1">{children}</main>
      <Toaster />
    </div>
  )
}
