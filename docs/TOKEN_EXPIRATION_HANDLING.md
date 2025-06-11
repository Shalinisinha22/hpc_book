# Token Expiration Handling

This document explains how the application handles token expiration and automatic logout/redirect functionality.

## Overview

The application now includes comprehensive token expiration handling that:
- Automatically detects when tokens are expired
- Logs out users when tokens become invalid
- Redirects users to the login page
- Provides centralized API call handling
- Handles backend-specific error responses (401 with `{error: "Invalid token"}`)

## Components

### 1. Token Validator (`lib/utils/token-validator.ts`)

Utility function that checks if a JWT token is still valid:

```typescript
export const isTokenValid = (token: string) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 > Date.now()
  } catch {
    return false
  }
}
```

### 2. Enhanced Auth Store (`lib/auth-store.ts`)

The auth store now includes:
- `checkTokenValidity()`: Checks if the current user's token is valid
- `handleTokenExpiration()`: Handles token expiration by logging out and redirecting
- Automatic token validation when loading from localStorage

### 3. API Utils (`lib/api-utils.ts`)

Provides centralized API calling functions:

#### `authenticatedFetch(url, options)`
- Automatically includes authentication headers
- Checks token validity before making requests
- Handles 401/403 responses automatically
- Redirects to login on authentication errors

#### `apiCall<T>(url, options)`
- Higher-level wrapper around `authenticatedFetch`
- Provides better error handling and type safety
- Automatically parses JSON responses

### 4. Auth Guard Hook (`hooks/use-auth-guard.tsx`)

React hook that provides automatic token monitoring:
- Checks token validity every minute
- Monitors page visibility changes
- Automatically logs out users when tokens expire

### 5. Auth Wrapper Component (`components/auth-wrapper.tsx`)

Component that should wrap your app to enable global token monitoring:

```tsx
import { AuthWrapper } from '@/components/auth-wrapper'

export default function RootLayout({ children }) {
  return (
    <AuthWrapper>
      {children}
    </AuthWrapper>
  )
}
```

## Usage

### Making API Calls

**Old way (manual token handling):**
```typescript
const token = localStorage.getItem("auth-token")
const response = await fetch(url, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
```

**New way (automatic token handling):**
```typescript
import { apiCall } from '@/lib/api-utils'

// Simple API call
const data = await apiCall('/api/v1/halls')

// API call with options
const data = await apiCall('/api/v1/halls', {
  method: 'POST',
  body: JSON.stringify(hallData)
})
```

### Error Handling

The new system automatically handles:
- **401 Unauthorized**: Token is invalid/expired → logout + redirect
- **403 Forbidden**: Insufficient permissions → error message
- **Network errors**: Proper error propagation

#### Backend Error Response Format

Your backend returns 401 errors in this format:
```json
{
  "error": "Invalid token"
}
// or
{
  "error": "No token provided"
}
// or
{
  "error": "User not found"
}
// or
{
  "error": "Please authenticate",
  "details": "Additional error details"
}
```

The frontend automatically detects these specific error messages and handles them appropriately.

```typescript
try {
  const data = await apiCall('/api/v1/halls')
  setHalls(data)
} catch (error) {
  // Authentication errors are handled automatically
  // Only handle business logic errors here
  if (error.message.includes('Authentication')) {
    return // User already redirected to login
  }
  
  toast({
    title: "Error",
    description: error.message,
    variant: "destructive",
  })
}
```

### Setting Up Global Token Monitoring

Add the AuthWrapper to your main layout:

```tsx
// app/layout.tsx
import { AuthWrapper } from '@/components/auth-wrapper'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthWrapper>
          {children}
        </AuthWrapper>
      </body>
    </html>
  )
}
```

## Migration Guide

To migrate existing API calls:

1. **Import the new utilities:**
   ```typescript
   import { apiCall } from '@/lib/api-utils'
   ```

2. **Replace manual fetch calls:**
   ```typescript
   // Before
   const token = localStorage.getItem("auth-token")
   const response = await fetch(url, {
     headers: { Authorization: `Bearer ${token}` }
   })
   const data = await response.json()

   // After
   const data = await apiCall(url)
   ```

3. **Update error handling:**
   ```typescript
   try {
     const data = await apiCall(url)
     // Handle success
   } catch (error) {
     // Check if it's an auth error (already handled)
     if (error.message.includes('Authentication')) {
       return
     }
     // Handle other errors
     showError(error.message)
   }
   ```

4. **Add AuthWrapper to your app:**
   ```tsx
   // In your main layout or App component
   <AuthWrapper>
     <YourAppContent />
   </AuthWrapper>
   ```

## Benefits

1. **Automatic Token Validation**: No need to manually check token expiry
2. **Centralized Error Handling**: Consistent behavior across the app
3. **Better User Experience**: Immediate logout and redirect on token expiry
4. **Reduced Boilerplate**: Less code needed for API calls
5. **Type Safety**: Better TypeScript support with generic types
6. **Background Monitoring**: Detects token expiry even when user is idle

## Security Considerations

- Tokens are validated both client-side and server-side
- Expired tokens are immediately removed from localStorage
- Users are redirected to login page on any authentication failure
- Token validity is checked on page visibility changes
- Regular background checks ensure timely logout

## Testing

To test token expiration handling:

1. **Manual Testing**: Modify token in localStorage to be expired
2. **Network Testing**: Mock 401 responses from API
3. **Time-based Testing**: Wait for actual token expiration
4. **Visibility Testing**: Switch browser tabs and return after token expiry

## Troubleshooting

**Issue**: User not redirected on token expiry
- **Solution**: Ensure AuthWrapper is properly set up in your app

**Issue**: API calls still using old fetch method
- **Solution**: Migrate to use `apiCall` function

**Issue**: Multiple redirects happening
- **Solution**: Check that error handling doesn't interfere with automatic redirects

**Issue**: Token validation not working
- **Solution**: Verify token format and ensure it's a valid JWT