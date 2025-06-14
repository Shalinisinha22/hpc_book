# Token Expiration Handling

This document explains how your backend's token expiration response is handled in the frontend application.

## Backend Response Format

Your backend returns the following JSON when a token expires:

```json
{
    "error": "Token expired",
    "code": "TOKEN_EXPIRED",
    "expiredAt": "2025-06-12T11:53:46.000Z"
}
```

## How It's Handled

### 1. **Detection**
The application now specifically detects this response format in multiple ways:
- Checks for `code === 'TOKEN_EXPIRED'`
- Checks for `error === 'Token expired'`
- Also handles other common token error messages

### 2. **User Experience**
When token expiration is detected:
- ✅ User sees a friendly message: "Your session has expired. Please log in again."
- ✅ Current page URL is stored for redirect after re-login
- ✅ User is automatically logged out and redirected to login page
- ✅ After successful login, user returns to their original page

### 3. **Implementation Details**

#### Files Modified:
- `lib/token-handler.ts` - Central token error handling logic
- `lib/api-utils.ts` - Updated API utilities to use token handler
- `hooks/useTokenErrorHandler.ts` - React hook for error handling in components
- `components/TokenExpirationTest.tsx` - Testing component

#### Key Functions:
```typescript
// Detects your backend's specific token expiration format
isTokenExpiredResponse(errorData) // Returns true for TOKEN_EXPIRED code
isTokenError(errorData) // Returns true for any token-related error
handleTokenExpiration(errorData) // Handles logout and redirect
getTokenErrorMessage(errorData) // Returns user-friendly message
```

### 4. **Usage in Components**

#### Option 1: Using the API utilities (Automatic)
```typescript
import { apiCall } from '@/lib/api-utils'

// Token expiration is automatically handled
try {
  const data = await apiCall('/api/endpoint')
} catch (error) {
  // Token expiration already handled if applicable
  console.error('API call failed:', error)
}
```

#### Option 2: Using the error handler hook
```typescript
import { useTokenErrorHandler } from '@/hooks/useTokenErrorHandler'

function MyComponent() {
  const { handleApiError } = useTokenErrorHandler()
  
  const fetchData = async () => {
    try {
      const response = await fetch('/api/endpoint')
      // ... handle response
    } catch (error) {
      handleApiError(error, 'Failed to fetch data')
    }
  }
}
```

### 5. **Testing**

Visit `/token-test` in your application to test:
- Normal API calls
- Token expiration simulation
- Backend response format handling
- Current token status

### 6. **Error Flow**

```
1. API call made with token
2. Backend responds with 401 + TOKEN_EXPIRED
3. Frontend detects token expiration
4. Current page URL stored in localStorage
5. User logged out and redirected to /login
6. User logs in successfully
7. User redirected back to original page
```

### 7. **Supported Error Formats**

The system handles these token-related errors:
- `{ "code": "TOKEN_EXPIRED", "error": "Token expired" }` (Your format)
- `{ "error": "Invalid token" }`
- `{ "error": "No token provided" }`
- `{ "error": "User not found" }`
- `{ "error": "Please authenticate" }`
- Any error message containing "token expired"

### 8. **Benefits**

✅ **Seamless UX**: Users don't lose their place when tokens expire
✅ **Automatic Handling**: No manual token checking needed in components
✅ **Consistent Messages**: User-friendly error messages throughout the app
✅ **Flexible**: Works with various token error formats
✅ **Testable**: Comprehensive testing tools included

## Quick Test

1. Login to your application
2. Navigate to any page (e.g., `/halls`)
3. Wait for your token to expire naturally, OR
4. Go to `/token-test` and use "Test Token Expiration" button
5. Verify you're redirected to login and then back to the original page

The token expiration from your backend is now fully handled! 🎉