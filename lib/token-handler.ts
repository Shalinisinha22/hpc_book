import { useAuthStore } from '@/lib/auth-store'

// Backend token expiration response format
interface TokenExpiredResponse {
  error: string
  code: string
  expiredAt: string
}

// Check if a response indicates token expiration
export const isTokenExpiredResponse = (errorData: any): boolean => {
  return (
    errorData?.code === 'TOKEN_EXPIRED' ||
    errorData?.error === 'Token expired' ||
    (errorData?.error && errorData.error.toLowerCase().includes('token expired'))
  )
}

// Check if a response indicates any token-related error
export const isTokenError = (errorData: any): boolean => {
  if (isTokenExpiredResponse(errorData)) {
    return true
  }
  
  const tokenErrorMessages = [
    'Invalid token',
    'No token provided',
    'User not found',
    'Please authenticate',
    'Unauthorized',
    'Authentication required'
  ]
  
  return tokenErrorMessages.some(msg => 
    errorData?.error?.toLowerCase().includes(msg.toLowerCase()) ||
    errorData?.message?.toLowerCase().includes(msg.toLowerCase())
  )
}

// Handle token expiration from API responses
export const handleTokenExpiration = (errorData?: any) => {
  console.warn('Handling token expiration:', errorData)
  
  // Log specific expiration details if available
  if (errorData?.expiredAt) {
    console.warn(`Token expired at: ${errorData.expiredAt}`)
  }
  
  // Get current page to redirect back after login
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''
  if (currentPath && currentPath !== '/login' && currentPath !== '/') {
    localStorage.setItem('redirect-after-login', currentPath)
  }
  
  // Clear auth state and redirect
  const { logout } = useAuthStore.getState()
  logout()
}

// Axios interceptor for handling token expiration
export const createTokenInterceptor = () => {
  return {
    response: (response: any) => response,
    error: (error: any) => {
      if (error.response?.status === 401) {
        const errorData = error.response?.data
        
        if (isTokenError(errorData)) {
          handleTokenExpiration(errorData)
        }
      }
      return Promise.reject(error)
    }
  }
}

// Fetch wrapper that handles token expiration
export const fetchWithTokenHandling = async (
  url: string, 
  options: RequestInit = {}
): Promise<Response> => {
  const token = localStorage.getItem('auth-token')
  
  // Add authorization header if token exists
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    })

    // Handle 401 responses
    if (response.status === 401) {
      try {
        const errorData = await response.clone().json()
        
        if (isTokenError(errorData)) {
          handleTokenExpiration(errorData)
          throw new Error('Your session has expired. Please log in again.')
        }
      } catch (parseError) {
        // If we can't parse the response, assume token issue
        handleTokenExpiration()
        throw new Error('Authentication expired. Please log in again.')
      }
    }

    return response
  } catch (error) {
    // Re-throw the error for the caller to handle
    throw error
  }
}

// Helper to show user-friendly token expiration messages
export const getTokenErrorMessage = (errorData: any): string => {
  if (isTokenExpiredResponse(errorData)) {
    return 'Your session has expired. Please log in again.'
  }
  
  if (isTokenError(errorData)) {
    return 'Authentication failed. Please log in again.'
  }
  
  return errorData?.error || errorData?.message || 'An error occurred'
}