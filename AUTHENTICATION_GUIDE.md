# Authentication System Guide

This guide explains how the authentication system works in the HPC Booking UI application, specifically focusing on maintaining user sessions across page refreshes.

## Overview

The authentication system has been designed to ensure that when a user is logged in with a valid (non-expired) token, they will remain on their current page after a browser refresh, rather than being redirected to the login page.

## Key Components

### 1. Auth Store (`lib/auth-store.ts`)
- Uses Zustand with persistence to manage authentication state
- Includes `isInitialized` flag to track when auth state has been properly loaded
- Handles token expiration checking and automatic logout
- Stores authentication data in localStorage with proper token validation

### 2. Auth Provider (`components/AuthProvider.tsx`)
- Wraps the entire application to initialize authentication state
- Shows loading screen while authentication is being initialized
- Ensures auth state is properly restored from localStorage before any redirects occur

### 3. Root Layout (`app/layout.tsx`)
- Wraps all pages with the AuthProvider
- Ensures authentication initialization happens at the app level

### 4. withAuth HOC (`components/withAuth.tsx`)
- Higher-order component for protecting individual pages
- Waits for auth initialization before checking authentication status
- Redirects to login only after confirming user is not authenticated

### 5. Middleware (`middleware.ts`)
- Handles route-level protection
- Allows client-side auth logic to take precedence for better UX

## How It Works

### Page Refresh Flow

1. **User refreshes page while logged in**
2. **AuthProvider initializes** - Checks localStorage for valid token
3. **If token is valid and not expired**:
   - Auth state is restored
   - User stays on current page
   - Token expiration monitoring is set up
4. **If token is invalid or expired**:
   - Auth state is cleared
   - User is redirected to login page

### Login Flow with Redirect

1. **User tries to access protected page without authentication**
2. **Current page URL is stored** in localStorage as `redirect-after-login`
3. **User is redirected to login page**
4. **After successful login**:
   - Check for stored redirect URL
   - Redirect to original page or default to dashboard
   - Clear stored redirect URL

### Token Expiration Handling

1. **Token expiration is monitored** using setTimeout
2. **When token expires**:
   - Current page URL is stored for redirect after re-login
   - User is logged out and redirected to login page
3. **User can log back in** and return to their original page

## Usage Examples

### Protecting a Page with withAuth

```tsx
import { withAuth } from '@/components/withAuth'

function MyProtectedPage() {
  return (
    <div>
      <h1>This page requires authentication</h1>
      {/* Your page content */}
    </div>
  )
}

export default withAuth(MyProtectedPage)
```

### Using Auth State in Components

```tsx
import { useAuthStore } from '@/lib/auth-store'

function MyComponent() {
  const { isAuthenticated, isInitialized, user } = useAuthStore()

  if (!isInitialized) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return <div>Please log in</div>
  }

  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
    </div>
  )
}
```

## Key Features

### ✅ Session Persistence
- Users stay logged in across browser refreshes
- Valid tokens are automatically restored from localStorage

### ✅ Smart Redirects
- Users return to their intended page after login
- Current page is preserved when token expires

### ✅ Loading States
- Proper loading indicators while auth state initializes
- No flash of login page for authenticated users

### ✅ Token Management
- Automatic token expiration monitoring
- Graceful handling of expired tokens

### ✅ Security
- Tokens are validated before use
- Expired tokens are automatically cleared
- Secure logout clears all auth data

## Implementation Notes

### Why This Approach?

1. **User Experience**: Users don't lose their place when refreshing pages
2. **Security**: Tokens are properly validated and expired tokens are handled
3. **Performance**: Auth state is initialized once at app level
4. **Reliability**: Proper loading states prevent race conditions

### Important Considerations

1. **Always wait for `isInitialized`** before making auth-based decisions
2. **Use `withAuth` HOC** for page-level protection
3. **Handle loading states** appropriately in components
4. **Token expiration** is monitored automatically

## Testing the Implementation

To test that the authentication system works correctly:

1. **Login to the application**
2. **Navigate to any protected page** (e.g., /halls, /dashboard, /bookings)
3. **Refresh the browser**
4. **Verify you stay on the same page** (no redirect to login)
5. **Test with expired token** by manually expiring it in localStorage
6. **Verify proper redirect to login** and back to original page after re-login

## Troubleshooting

### User Gets Redirected to Login on Refresh
- Check if token is properly stored in localStorage
- Verify token is not expired
- Ensure AuthProvider is wrapping the app

### Loading State Never Ends
- Check for errors in browser console
- Verify auth store initialization is completing
- Check localStorage for corrupted auth data

### Redirects Not Working
- Verify `redirect-after-login` is being stored
- Check login page redirect logic
- Ensure middleware is not interfering