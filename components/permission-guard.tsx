"use client"

import { useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/auth-store"
import type { Permission } from "@/lib/permissions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface PermissionGuardProps {
  children: ReactNode
  requiredPermission: Permission
  fallback?: ReactNode
}

export function PermissionGuard({ children, requiredPermission, fallback }: PermissionGuardProps) {
  const router = useRouter()
  const { hasPermission, isAuthenticated } = useAuthStore()

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      router.push("/login")
      return
    }
  }, [isAuthenticated, router])

  // If has permission, render children
  if (isAuthenticated && hasPermission(requiredPermission)) {
    return <>{children}</>
  }

  // If fallback is provided, render it
  if (fallback) {
    return <>{fallback}</>
  }

  // Otherwise render access denied message
  return (
    <div className="flex items-center justify-center h-full p-6">
      <Alert variant="destructive" className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Access Denied</AlertTitle>
        <AlertDescription>
          You don't have permission to access this page. Please contact your administrator if you believe this is an
          error.
        </AlertDescription>
      </Alert>
    </div>
  )
}
