'use client'

import { useAuthStore } from '@/lib/auth-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function AuthTest() {
  const { 
    isAuthenticated, 
    isInitialized, 
    user, 
    logout 
  } = useAuthStore()

  const testTokenExpiration = () => {
    // Simulate token expiration for testing
    const { handleTokenExpiration } = useAuthStore.getState()
    handleTokenExpiration()
  }

  const checkLocalStorage = () => {
    const token = localStorage.getItem('auth-token')
    const authState = localStorage.getItem('auth-state')
    console.log('Auth Token:', token)
    console.log('Auth State:', authState)
    alert(`Token: ${token ? 'Present' : 'Missing'}\nAuth State: ${authState ? 'Present' : 'Missing'}`)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Authentication Test Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Initialized:</span>
            <span className={isInitialized ? 'text-green-600' : 'text-red-600'}>
              {isInitialized ? '✓' : '✗'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Authenticated:</span>
            <span className={isAuthenticated ? 'text-green-600' : 'text-red-600'}>
              {isAuthenticated ? '✓' : '✗'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>User:</span>
            <span className="text-sm truncate max-w-32">
              {user?.name || 'None'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Current Page:</span>
            <span className="text-sm truncate max-w-32">
              {typeof window !== 'undefined' ? window.location.pathname : 'N/A'}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Button 
            onClick={checkLocalStorage} 
            variant="outline" 
            size="sm" 
            className="w-full"
          >
            Check LocalStorage
          </Button>
          
          <Button 
            onClick={testTokenExpiration} 
            variant="outline" 
            size="sm" 
            className="w-full"
            disabled={!isAuthenticated}
          >
            Test Token Expiration
          </Button>
          
          <Button 
            onClick={logout} 
            variant="destructive" 
            size="sm" 
            className="w-full"
            disabled={!isAuthenticated}
          >
            Logout
          </Button>
        </div>

        <div className="text-xs text-gray-500 mt-4">
          <p><strong>Test Instructions:</strong></p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Login to the app</li>
            <li>Navigate to any page</li>
            <li>Refresh the browser</li>
            <li>Verify you stay on the same page</li>
            <li>Use "Test Token Expiration" to simulate logout</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}