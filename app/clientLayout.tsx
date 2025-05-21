"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/auth-store"
import { PermissionBasedSidebar } from "@/components/permission-based-sidebar"
import { Header } from "@/components/header"
import { Toaster } from "@/components/toaster"

export default function ClientLayout({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()
  const [isMounted, setIsMounted] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted && !isAuthenticated && pathname !== "/login" && pathname !== "/logout") {
      router.push("/login")
    }
  }, [isMounted, isAuthenticated, pathname, router])

  if (!isMounted) {
    return null
  }

  if (!isAuthenticated && pathname !== "/login" && pathname !== "/logout") {
    return null
  }

  if (pathname === "/login" || pathname === "/logout") {
    return (
      <>
        {children}
        <Toaster />
      </>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <PermissionBasedSidebar onCollapsedChange={(collapsed) => setSidebarCollapsed(collapsed)} />
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out`}>
        <Header sidebarCollapsed={sidebarCollapsed} />
        <main className="flex-1 overflow-y-auto bg-gray-50">{children}</main>
      </div>
      <Toaster />
    </div>
  )
}
