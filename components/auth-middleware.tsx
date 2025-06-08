'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/lib/auth-store'

const PUBLIC_PATHS = ['/login', '/register']

export function AuthMiddleware({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, user } = useAuthStore()

  useEffect(() => {
    const checkAuth = () => {
      const authState = window.localStorage.getItem('auth-state')
      const token = window.localStorage.getItem('auth-token')
      const isPublicPath = PUBLIC_PATHS.includes(pathname)

      if ((!authState || !token) && !isPublicPath) {
        router.push('/login')
        return
      }

      if (authState && token && isPublicPath) {
        router.push('/dashboard')
      }
    }

    checkAuth()
  }, [pathname, router])

  return <>{children}</>
}