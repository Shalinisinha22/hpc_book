'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/lib/auth-store'

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  redirectTo: string = '/login'
) {
  return function AuthenticatedComponent(props: P) {
    const router = useRouter()
    const pathname = usePathname()
    const { isAuthenticated, isInitialized } = useAuthStore()

    useEffect(() => {
      // Only check auth after initialization is complete
      if (!isInitialized) {
        return
      }

      // If not authenticated, redirect to login
      if (!isAuthenticated) {
        router.replace(redirectTo)
      }
    }, [isAuthenticated, isInitialized, router])

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

    // If not authenticated, don't render anything (redirect will happen)
    if (!isAuthenticated) {
      return null
    }

    // Render the wrapped component for authenticated users
    return <WrappedComponent {...props} />
  }
}