"use client"

import { useEffect } from 'react'
import { useAuthGuard } from '@/hooks/use-auth-guard'

interface AuthWrapperProps {
  children: React.ReactNode
}

/**
 * Component that wraps the app to provide automatic token expiration handling
 * This should be placed high in the component tree to ensure global coverage
 */
export const AuthWrapper = ({ children }: AuthWrapperProps) => {
  // This hook will automatically handle token expiration
  useAuthGuard()

  return <>{children}</>
}