import { create } from "zustand"
import { persist } from "zustand/middleware"
import { type Permission } from "@/lib/permissions"
import { isTokenExpired, parseJwt } from './auth-utils'
import { API_ROUTES } from "@/config/api"


interface AuthState {
  isAuthenticated: boolean
  isInitialized: boolean
  user: {
    id: string
    email: string
    name: string
    roleId: string
    permissions: Permission[]
    token: string
  } | null
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  logout: () => void
  hasPermission: (permission: Permission) => boolean
  handleTokenExpiration: () => void
  setupTokenExpirationCheck: () => void
  initializeAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isInitialized: false,
      user: null,
      login: async (email, password) => {
        try {
          const response = await fetch(API_ROUTES.users.login, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          })

          const data = await response.json()
              console.log(data)
          if (!data.success) {
            return {
              success: false,
              message: data.message || "Login failed",
            }
          }

          const { name, email: userEmail, role, token,permission } = data.result
      

          // const userRole = PREDEFINED_ROLES.find((r) => r.name.toLowerCase() === role.toLowerCase())
          
          // if (!userRole) {
          //   return {
          //     success: false,
          //     message: "Invalid role configuration",
          //   }
          // }

          // Use permissions from API response (roleData.permissions)
          const permissions = data.result.roleData?.permissions || [];

          const authState = {
            isAuthenticated: true,
            user: {
              id: data.result._id || '',
              email: userEmail,
              name,
              roleId: role,
              permissions,
              token
            },
          }

          set(authState)
          
          // Store in localStorage
          window.localStorage.setItem('auth-token', token)
          window.localStorage.setItem('auth-state', JSON.stringify(authState))

          return { success: true }
        } catch (error) {
          console.error('Login error:', error)
          return {
            success: false,
            message: "Network error",
          }
        }
      },

      logout: () => {
        window.localStorage.removeItem('auth-token')
        window.localStorage.removeItem('auth-state')
        set({ isAuthenticated: false, user: null })
        // Redirect to login page if we're in the browser
        if (typeof window !== 'undefined') {
          // Store the current page to redirect back after login
          const currentPath = window.location.pathname
          if (currentPath !== '/login' && currentPath !== '/') {
            window.localStorage.setItem('redirect-after-login', currentPath)
          }
          window.location.href = '/login'
        }
      },
      hasPermission: (permission: Permission) => {
        const { user } = get()
        if (!user) return false
        return user.permissions.includes(permission)
      },

      setupTokenExpirationCheck: () => {
        const { user, handleTokenExpiration } = get()
        
        // Check localStorage first
        const storedToken = window.localStorage.getItem('auth-token')
        const token = user?.token || storedToken
        
        if (!token) return
        
        if (isTokenExpired(token)) {
          handleTokenExpiration()
          return
        }

        const decoded = parseJwt(token)
        if (!decoded?.exp) return
        
        const timeUntilExpiry = (decoded.exp * 1000) - Date.now()
        
        if (typeof window !== 'undefined') {
          if (window.__tokenExpirationTimeout) {
            clearTimeout(window.__tokenExpirationTimeout)
          }
          window.__tokenExpirationTimeout = setTimeout(handleTokenExpiration, timeUntilExpiry)
        }
      },

      handleTokenExpiration: () => {
        console.warn('Token has expired')
        const { logout } = get()
        logout()
      },

      initializeAuth: () => {
        try {
          const token = window.localStorage.getItem('auth-token')
          const authState = window.localStorage.getItem('auth-state')

          if (token && authState && !isTokenExpired(token)) {
            const state = JSON.parse(authState)
            if (state?.user) {
              state.user.token = token
              set({ 
                ...state, 
                isInitialized: true 
              })
              // Set up token expiration checking
              const { setupTokenExpirationCheck } = get()
              setupTokenExpirationCheck()
              return
            }
          }
          
          // If no valid auth data, just mark as initialized
          set({ isInitialized: true })
        } catch (error) {
          console.error('Error initializing auth:', error)
          set({ isInitialized: true })
        }
      }
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        // Don't persist isInitialized - it should always start as false
      }),
      storage: {
        getItem: (name) => {
          try {
            const token = window.localStorage.getItem('auth-token')
            const authState = window.localStorage.getItem('auth-state')

            if (!token || !authState) {
              return null
            }

            if (isTokenExpired(token)) {
              window.localStorage.removeItem('auth-token')
              window.localStorage.removeItem('auth-state')
              return null
            }

            const state = JSON.parse(authState)
            if (state?.user) {
              state.user.token = token
            }
            // Always start with isInitialized: false
            state.isInitialized = false
            return { state }
          } catch {
            return null
          }
        },
        setItem: (name, value) => {
          window.localStorage.setItem(name, JSON.stringify(value))
        },
        removeItem: (name) => {
          window.localStorage.removeItem(name)
          window.localStorage.removeItem('auth-token')
          window.localStorage.removeItem('auth-state')
        },
      },
    }
  )
)