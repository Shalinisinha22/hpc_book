import { useCallback } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { 
  isTokenError, 
  isTokenExpiredResponse, 
  handleTokenExpiration, 
  getTokenErrorMessage 
} from '@/lib/token-handler'

export const useTokenErrorHandler = () => {
  const { toast } = useToast()

  const handleError = useCallback((error: any) => {
    // Check if it's a network error with response data
    const errorData = error?.response?.data || error?.data || error

    // Handle token-related errors
    if (isTokenError(errorData)) {
      const message = getTokenErrorMessage(errorData)
      
      // Show user-friendly toast message
      toast({
        title: "Session Expired",
        description: message,
        variant: "destructive",
      })

      // Handle the token expiration (logout and redirect)
      handleTokenExpiration(errorData)
      return true // Indicates error was handled
    }

    // Handle other 401 errors
    if (error?.status === 401 || error?.response?.status === 401) {
      toast({
        title: "Authentication Error",
        description: "You are not authorized to perform this action.",
        variant: "destructive",
      })
      return true
    }

    // Handle 403 errors
    if (error?.status === 403 || error?.response?.status === 403) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to perform this action.",
        variant: "destructive",
      })
      return true
    }

    return false // Error was not handled
  }, [toast])

  const handleApiError = useCallback((error: any, customMessage?: string) => {
    const wasHandled = handleError(error)
    
    if (!wasHandled) {
      // Show generic error message
      const message = customMessage || 
                     error?.message || 
                     error?.error || 
                     'An unexpected error occurred'
      
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      })
    }
  }, [handleError, toast])

  return {
    handleError,
    handleApiError,
  }
}