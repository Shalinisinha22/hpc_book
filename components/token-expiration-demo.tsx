"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { apiCall } from '@/lib/api-utils'
import { useAuthStore } from '@/lib/auth-store'
import { API_ROUTES } from '@/config/api'

/**
 * Demo component to test token expiration handling
 * This component provides buttons to test various scenarios
 */
export const TokenExpirationDemo = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { user, logout, checkTokenValidity } = useAuthStore()

  const handleTestValidToken = async () => {
    setIsLoading(true)
    try {
      const data = await apiCall(API_ROUTES.halls)
      toast({
        title: "Success",
        description: "API call with valid token succeeded",
      })
      console.log('API response:', data)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "API call failed",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTestExpiredToken = () => {
    // Simulate expired token by modifying localStorage
    const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.invalid'
    localStorage.setItem('auth-token', expiredToken)
    
    toast({
      title: "Token Expired",
      description: "Expired token set in localStorage. Try making an API call now.",
      variant: "destructive",
    })
  }

  const handleTestInvalidToken = () => {
    // Set a completely invalid token format
    const invalidToken = 'invalid.token.format'
    localStorage.setItem('auth-token', invalidToken)
    
    toast({
      title: "Invalid Token",
      description: "Invalid token format set. This should trigger 'Invalid token' error from backend.",
      variant: "destructive",
    })
  }

  const handleTestNoToken = () => {
    // Remove token completely
    localStorage.removeItem('auth-token')
    
    toast({
      title: "No Token",
      description: "Token removed. This should trigger 'No token provided' error from backend.",
      variant: "destructive",
    })
  }

  const handleCheckTokenValidity = () => {
    const isValid = checkTokenValidity()
    toast({
      title: "Token Status",
      description: `Token is ${isValid ? 'valid' : 'invalid or expired'}`,
      variant: isValid ? "default" : "destructive",
    })
  }

  const handleManualLogout = () => {
    logout()
    toast({
      title: "Logged Out",
      description: "Manual logout triggered",
    })
  }

  const handleTestBackendErrors = async () => {
    setIsLoading(true)
    try {
      // This will test whatever token is currently in localStorage
      const data = await apiCall(API_ROUTES.halls)
      toast({
        title: "Success",
        description: "API call succeeded - token is valid",
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      
      // Check if it's one of the expected backend errors
      if (errorMessage.includes('Invalid or expired token') || 
          errorMessage.includes('Authentication expired')) {
        toast({
          title: "Expected Error",
          description: `Backend auth error handled correctly: ${errorMessage}`,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Unexpected Error",
          description: errorMessage,
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Token Expiration Demo</CardTitle>
        <CardDescription>
          Test various token expiration scenarios and automatic handling with your backend
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button 
            onClick={handleTestValidToken}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Testing...' : 'Test Valid Token'}
          </Button>
          
          <Button 
            onClick={handleTestExpiredToken}
            variant="destructive"
            className="w-full"
          >
            Set Expired Token
          </Button>
          
          <Button 
            onClick={handleTestInvalidToken}
            variant="destructive"
            className="w-full"
          >
            Set Invalid Token
          </Button>
          
          <Button 
            onClick={handleTestNoToken}
            variant="destructive"
            className="w-full"
          >
            Remove Token
          </Button>
          
          <Button 
            onClick={handleTestBackendErrors}
            disabled={isLoading}
            variant="outline"
            className="w-full"
          >
            {isLoading ? 'Testing...' : 'Test Backend Response'}
          </Button>
          
          <Button 
            onClick={handleCheckTokenValidity}
            variant="outline"
            className="w-full"
          >
            Check Token Validity
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Button 
            onClick={handleManualLogout}
            variant="secondary"
            className="w-full"
          >
            Manual Logout
          </Button>
          
          <Button 
            onClick={() => window.location.reload()}
            variant="ghost"
            className="w-full"
          >
            Reload Page
          </Button>
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2">Current User Info:</h4>
          <pre className="text-sm text-gray-600 overflow-auto">
            {JSON.stringify({
              isAuthenticated: !!user,
              email: user?.email,
              name: user?.name,
              role: user?.roleId,
              tokenExists: !!user?.token,
              tokenLength: user?.token?.length,
              localStorageToken: typeof window !== 'undefined' ? 
                (localStorage.getItem('auth-token') ? 'exists' : 'missing') : 'unknown'
            }, null, 2)}
          </pre>
        </div>
        
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold mb-2">Backend Error Scenarios:</h4>
          <div className="text-sm text-gray-700 space-y-2">
            <div><strong>No token provided:</strong> When Authorization header is missing</div>
            <div><strong>Invalid token:</strong> When JWT verification fails</div>
            <div><strong>User not found:</strong> When token is valid but user doesn't exist</div>
            <div><strong>Please authenticate:</strong> General auth error with details</div>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-green-50 rounded-lg">
          <h4 className="font-semibold mb-2">Test Instructions:</h4>
          <ol className="text-sm text-gray-700 space-y-1">
            <li>1. <strong>Test Valid Token:</strong> Makes API call with current valid token</li>
            <li>2. <strong>Set Expired Token:</strong> Sets an expired JWT token</li>
            <li>3. <strong>Set Invalid Token:</strong> Sets malformed token (triggers JWT verify error)</li>
            <li>4. <strong>Remove Token:</strong> Removes token completely (triggers "No token provided")</li>
            <li>5. <strong>Test Backend Response:</strong> Tests current token against backend</li>
            <li>6. <strong>Check Token Validity:</strong> Client-side token validation only</li>
          </ol>
        </div>
        
        <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
          <h4 className="font-semibold mb-2">Expected Behavior:</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Backend returns 401 with `{`error: "Invalid token"`}` → Auto logout + redirect</li>
            <li>• Backend returns 401 with `{`error: "No token provided"`}` → Auto logout + redirect</li>
            <li>• Backend returns 401 with `{`error: "User not found"`}` → Auto logout + redirect</li>
            <li>• All 401 responses should clear auth state and redirect to /login</li>
            <li>• Error messages should be properly displayed to user</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}