import { useAuthStore } from '@/lib/auth-store'
import { isTokenValid } from '@/lib/utils/token-validator'

export const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('auth-token')
  
  // Check if token exists and is valid before making the request
  if (!token || !isTokenValid(token)) {
    console.warn('Token is missing or expired, logging out user')
    useAuthStore.getState().logout()
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
    throw new Error('Authentication expired')
  }
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  // Handle various authentication/authorization errors
  if (response.status === 401) {
    console.warn('Received 401 Unauthorized response, token may be invalid')
    
    // Try to get error details from response
    let errorMessage = 'Authentication expired'
    try {
      const errorData = await response.json()
      
      // Handle your backend's specific error format
      if (errorData.error) {
        if (errorData.error === 'Invalid token' || 
            errorData.error === 'No token provided' || 
            errorData.error === 'User not found' ||
            errorData.error === 'Please authenticate') {
          errorMessage = 'Invalid or expired token'
        } else {
          errorMessage = errorData.error
        }
      } else if (errorData.message && errorData.message.toLowerCase().includes('token')) {
        errorMessage = 'Invalid or expired token'
      }
    } catch (e) {
      // If we can't parse the error response, use default message
      console.warn('Could not parse 401 error response:', e)
    }
    
    // Clear auth state and redirect to login
    useAuthStore.getState().logout()
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
    throw new Error(errorMessage)
  }

  if (response.status === 403) {
    console.warn('Received 403 Forbidden response, insufficient permissions')
    throw new Error('Insufficient permissions')
  }

  return response
}

// Wrapper for making authenticated API calls with better error handling
export const apiCall = async <T = any>(
  url: string, 
  options: RequestInit = {}
): Promise<T> => {
  try {
    const response = await authenticatedFetch(url, options)
    
    if (!response.ok) {
      // Try to get error message from response
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`
      try {
        const errorData = await response.json()
        
        // Handle your backend's error format (prioritize 'error' field over 'message')
        if (errorData.error) {
          errorMessage = errorData.error
          // Include details if available
          if (errorData.details) {
            errorMessage += ` - ${errorData.details}`
          }
        } else if (errorData.message) {
          errorMessage = errorData.message
        }
      } catch (e) {
        // If we can't parse the error response, use default message
        console.warn('Could not parse error response:', e)
      }
      throw new Error(errorMessage)
    }
    
    // Try to parse JSON response
    const data = await response.json()
    return data
  } catch (error) {
    console.error('API call failed:', error)
    throw error
  }
}

// Example usage in a component
const SecuredComponent = () => {
  const hasPermission = useAuthStore(state => state.hasPermission)
  
  if (!hasPermission('MANAGE_USERS')) {
    return <div>Access Denied</div>
  }

  return <div>Protected Content</div>
}