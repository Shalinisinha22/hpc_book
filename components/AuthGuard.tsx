'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/lib/auth-store'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, isInitialized } = useAuthStore()

  useEffect(() => {
    // Only check auth after initialization is complete
    if (!isInitialized) {
      return
    }

    // If not authenticated and not on login page, redirect to login
    if (!isAuthenticated && pathname !== '/login') {
      router.replace('/login')
    }
  }, [isAuthenticated, isInitialized, pathname, router])

  // Show loading while auth is being initialized
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // If not authenticated and not on login page, don't render anything (redirect will happen)
  if (!isAuthenticated && pathname !== '/login') {
    return null
  }

  return <>{children}</>
}