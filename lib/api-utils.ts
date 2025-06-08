import { useAuthStore } from '@/lib/auth-store'

export const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('authToken')
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (response.status === 401) {
    // Token expired or invalid
    useAuthStore.getState().logout()
    throw new Error('Authentication expired')
  }

  return response
}

// Example usage in a component
const SecuredComponent = () => {
  const hasPermission = useAuthStore(state => state.hasPermission)
  
  if (!hasPermission('MANAGE_USERS')) {
    return <div>Access Denied</div>
  }

  return <div>Protected Content</div>
}