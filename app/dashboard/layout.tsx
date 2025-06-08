"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/auth-store"
import { Header } from "@/components/header"
import { PermissionBasedSidebar } from "@/components/permission-based-sidebar"
import { Toaster } from "@/components/toaster"

export default function DashboardLayout({ children }) {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [mounted, setMounted] = useState(false)

  // Log on mount and state changes
  useEffect(() => {
    setMounted(true)
    console.group('Dashboard Authentication State')
    console.log('Component mounted:', mounted)
    console.log('Is authenticated:', isAuthenticated)
    console.log('Auth state:', localStorage.getItem('auth-state'))
    console.log('Auth token:', localStorage.getItem('auth-token'))
    console.groupEnd()

    // Cleanup function
    return () => {
      console.log('Dashboard component unmounting')
    }
  }, [isAuthenticated, mounted])

  useEffect(() => {
    const authState = window.localStorage.getItem('auth-state')
    const token = window.localStorage.getItem('auth-token')
    console.log("Auth state:", authState)
    console.log("Token:", token)  
    console.log("Is authenticated:", isAuthenticated)

    if (!authState || !token || !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null // Return null while redirecting
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <PermissionBasedSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-50">{children}</main>
        <Toaster />
      </div>
    </div>
  )
}
