"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/auth-store"
import { Header } from "@/components/header"
import { PermissionBasedSidebar } from "@/components/permission-based-sidebar"
import { Toaster } from "@/components/toaster"

export default function UserRolesLayout({ children }) {
  const router = useRouter()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

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
