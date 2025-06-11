"use client"

import { useEffect } from 'react'
import { useAuthStore } from '@/lib/auth-store'
import { isTokenValid } from '@/lib/utils/token-validator'

/**
 * Hook to automatically check token validity and handle expiration
 * This should be used in the main app component or layout to ensure
 * token expiration is handled globally
 */
export const useAuthGuard = () => {
  const { user, isAuthenticated, handleTokenExpiration, checkTokenValidity } = useAuthStore()

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return

    // Function to check token validity
    const checkToken = () => {
      if (isAuthenticated && user?.token) {
        if (!isTokenValid(user.token)) {
          console.warn('Token expired during session, logging out user')
          handleTokenExpiration()
          return false
        }
      }
      return true
    }

    // Check token immediately
    checkToken()

    // Set up interval to check token validity every minute
    const interval = setInterval(() => {
      checkToken()
    }, 60000) // Check every minute

    // Cleanup interval on unmount
    return () => clearInterval(interval)
  }, [isAuthenticated, user?.token, handleTokenExpiration])

  // Also check token validity when the page becomes visible again
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isAuthenticated && user?.token) {
        if (!isTokenValid(user.token)) {
          console.warn('Token expired while page was hidden, logging out user')
          handleTokenExpiration()
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [isAuthenticated, user?.token, handleTokenExpiration])

  return {
    isTokenValid: checkTokenValidity,
    checkToken: () => {
      if (isAuthenticated && user?.token) {
        return isTokenValid(user.token)
      }
      return false
    }
  }
}