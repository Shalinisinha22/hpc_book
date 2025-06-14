'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { apiCall } from '@/lib/api-utils'
import { useTokenErrorHandler } from '@/hooks/useTokenErrorHandler'
import { API_ROUTES } from '@/config/api'

export function TokenExpirationTest() {
  const [isLoading, setIsLoading] = useState(false)
  const [testResults, setTestResults] = useState<string[]>([])
  const { toast } = useToast()
  const { handleApiError } = useTokenErrorHandler()

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const clearResults = () => {
    setTestResults([])
  }

  // Test 1: Make a normal API call
  const testNormalApiCall = async () => {
    setIsLoading(true)
    try {
      addResult('Testing normal API call...')
      const response = await apiCall(API_ROUTES.halls)
      addResult('✅ Normal API call successful')
    } catch (error) {
      addResult('❌ Normal API call failed: ' + (error as Error).message)
      handleApiError(error, 'Failed to test normal API call')
    } finally {
      setIsLoading(false)
    }
  }

  // Test 2: Simulate token expiration by corrupting the token
  const testTokenExpiration = async () => {
    setIsLoading(true)
    try {
      addResult('Testing token expiration...')
      
      // Save current token
      const originalToken = localStorage.getItem('auth-token')
      
      // Set an expired/invalid token
      localStorage.setItem('auth-token', 'expired.token.here')
      
      try {
        await apiCall(API_ROUTES.halls)
        addResult('❌ Token expiration test failed - should have thrown error')
      } catch (error) {
        addResult('✅ Token expiration detected: ' + (error as Error).message)
        
        // Restore original token if it exists
        if (originalToken) {
          localStorage.setItem('auth-token', originalToken)
          addResult('🔄 Original token restored')
        }
      }
    } catch (error) {
      addResult('❌ Token expiration test error: ' + (error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  // Test 3: Simulate backend token expired response
  const testBackendTokenExpiredResponse = () => {
    addResult('Testing backend token expired response format...')
    
    // Simulate the exact response format from your backend
    const mockTokenExpiredError = {
      error: "Token expired",
      code: "TOKEN_EXPIRED",
      expiredAt: "2025-06-12T11:53:46.000Z"
    }

    try {
      handleApiError(mockTokenExpiredError, 'Test token expiration')
      addResult('✅ Backend token expired response handled correctly')
    } catch (error) {
      addResult('❌ Backend token expired response test failed: ' + (error as Error).message)
    }
  }

  // Test 4: Check current token status
  const checkTokenStatus = () => {
    const token = localStorage.getItem('auth-token')
    const authState = localStorage.getItem('auth-state')
    
    addResult('=== Current Token Status ===')
    addResult(`Token exists: ${token ? 'Yes' : 'No'}`)
    addResult(`Auth state exists: ${authState ? 'Yes' : 'No'}`)
    
    if (token) {
      try {
        // Decode JWT payload
        const payload = JSON.parse(atob(token.split('.')[1]))
        const expirationDate = new Date(payload.exp * 1000)
        const isExpired = Date.now() > payload.exp * 1000
        
        addResult(`Token expires: ${expirationDate.toLocaleString()}`)
        addResult(`Token expired: ${isExpired ? 'Yes' : 'No'}`)
        
        if (!isExpired) {
          const timeLeft = Math.floor((payload.exp * 1000 - Date.now()) / 1000 / 60)
          addResult(`Time left: ${timeLeft} minutes`)
        }
      } catch (error) {
        addResult('❌ Failed to decode token: ' + (error as Error).message)
      }
    }
    addResult('=== End Token Status ===')
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Token Expiration Test Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <Button 
            onClick={testNormalApiCall} 
            disabled={isLoading}
            variant="outline"
          >
            Test Normal API Call
          </Button>
          
          <Button 
            onClick={testTokenExpiration} 
            disabled={isLoading}
            variant="outline"
          >
            Test Token Expiration
          </Button>
          
          <Button 
            onClick={testBackendTokenExpiredResponse} 
            disabled={isLoading}
            variant="outline"
          >
            Test Backend Response
          </Button>
          
          <Button 
            onClick={checkTokenStatus} 
            disabled={isLoading}
            variant="outline"
          >
            Check Token Status
          </Button>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={clearResults} 
            variant="secondary" 
            size="sm"
            className="flex-1"
          >
            Clear Results
          </Button>
        </div>

        {testResults.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Test Results:</h3>
            <div className="bg-gray-100 p-3 rounded-md max-h-64 overflow-y-auto">
              <pre className="text-xs whitespace-pre-wrap">
                {testResults.join('\n')}
              </pre>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 mt-4 p-3 bg-blue-50 rounded-md">
          <p><strong>Test Instructions:</strong></p>
          <ol className="list-decimal list-inside space-y-1 mt-2">
            <li><strong>Normal API Call:</strong> Tests if regular API calls work</li>
            <li><strong>Token Expiration:</strong> Simulates expired token scenario</li>
            <li><strong>Backend Response:</strong> Tests your backend's specific error format</li>
            <li><strong>Token Status:</strong> Shows current token information</li>
          </ol>
          <p className="mt-2"><strong>Expected Behavior:</strong> When token expires, you should be redirected to login page and then back to this page after re-login.</p>
        </div>
      </CardContent>
    </Card>
  )
}