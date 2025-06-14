import { useAuthStore } from '@/lib/auth-store'
import { isTokenValid } from '@/lib/utils/token-validator'
import { 
  isTokenError, 
  isTokenExpiredResponse, 
  handleTokenExpiration, 
  getTokenErrorMessage 
} from '@/lib/token-handler'

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
    
    try {
      const errorData = await response.json()
      
      // Use the token handler to check and handle token errors
      if (isTokenError(errorData)) {
        const errorMessage = getTokenErrorMessage(errorData)
        handleTokenExpiration(errorData)
        throw new Error(errorMessage)
      } else {
        // Non-token related 401 error
        throw new Error(errorData.error || errorData.message || 'Unauthorized')
      }
    } catch (parseError) {
      // If we can't parse the error response, assume token issue
      console.warn('Could not parse 401 error response:', parseError)
      handleTokenExpiration()
      throw new Error('Authentication expired. Please log in again.')
    }
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
      // Handle 401 specifically for token expiration
      if (response.status === 401) {
        try {
          const errorData = await response.json()
          
          // Use the token handler to check and handle token errors
          if (isTokenError(errorData)) {
            const errorMessage = getTokenErrorMessage(errorData)
            handleTokenExpiration(errorData)
            throw new Error(errorMessage)
          } else {
            // Non-token related 401 error
            throw new Error(errorData.error || errorData.message || 'Unauthorized')
          }
        } catch (parseError) {
          // If we can't parse the error response, assume token issue
          console.warn('Could not parse 401 error response:', parseError)
          handleTokenExpiration()
          throw new Error('Authentication expired. Please log in again.')
        }
      }
      
      // Handle other HTTP errors
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

// Example usage in a component:
// const SecuredComponent = () => {
//   const hasPermission = useAuthStore(state => state.hasPermission)
//   
//   if (!hasPermission('MANAGE_USERS')) {
//     return <div>Access Denied</div>
//   }
//
//   return <div>Protected Content</div>
// }