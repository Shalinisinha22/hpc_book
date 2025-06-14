"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/auth-store"
import { Header } from "@/components/header"
import { PermissionBasedSidebar } from "@/components/permission-based-sidebar"
import { Toaster } from "@/components/toaster"

export default function DashboardLayout({ children }) {
  const router = useRouter()
  const { isAuthenticated, isInitialized } = useAuthStore()

  useEffect(() => {
    // Only check auth after initialization is complete
    if (!isInitialized) {
      return
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      router.replace("/login")
    }
  }, [isAuthenticated, isInitialized, router])

  // Show loading while auth is being initialized
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, don't render anything (redirect will happen)
  if (!isAuthenticated) {
    return null
  }

  // Render dashboard for authenticated users
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <PermissionBasedSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
        <Toaster />
      </div>
    </div>
  )
}
