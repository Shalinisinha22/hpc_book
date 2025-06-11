import { create } from "zustand"
import { persist } from "zustand/middleware"
import { PREDEFINED_ROLES, type Permission } from "@/lib/permissions"
import { isTokenValid } from "./utils/token-validator"

interface AuthState {
  isAuthenticated: boolean
  user: {
    id: string
    email: string
    name: string
    roleId: string
    permissions: Permission[]
    token: string  // Add token field
  } | null
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  // loginWithOtp: (email: string, otp: string) => Promise<{ success: boolean; message?: string }>
  logout: () => void
  hasPermission: (permission: Permission) => boolean
  checkTokenValidity: () => boolean
  handleTokenExpiration: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      login: async (email, password) => {
        try {
          const response = await fetch("http://localhost:8000/api/v1/users/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          })

          const data = await response.json()
          
          if (!data.success) {
            return {
              success: false,
              message: data.message || "Login failed",
            }
          }

          const { name, email: userEmail, role, token } = data.result

          const userRole = PREDEFINED_ROLES.find((r) => r.name.toLowerCase() === role.toLowerCase())
          
          if (!userRole) {
            return {
              success: false,
              message: "Invalid role configuration",
            }
          }

          // Set both auth state and localStorage
          const authState = {
            isAuthenticated: true,
            user: {
              id: data.result._id || '',
              email: userEmail,
              name,
              roleId: role,
              permissions: userRole.permissions,
              token
            },
          }

          set(authState)
          
          // Store token separately in localStorage
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
          window.location.href = '/login'
        }
      },
      hasPermission: (permission: Permission) => {
        const { user } = get()
        if (!user) return false
        return user.permissions.includes(permission)
      },
      checkTokenValidity: () => {
        const { user } = get()
        if (!user || !user.token) return false
        return isTokenValid(user.token)
      },
      handleTokenExpiration: () => {
        console.warn('Token has expired, logging out user')
        get().logout()
      },
    }),
    {
      name: "auth-storage",
      storage: {
        getItem: (name) => {
          try {
            const authState = window.localStorage.getItem('auth-state')
            const token = window.localStorage.getItem('auth-token')

            if (!authState || !token) {
              set({ isAuthenticated: false, user: null })
              return null
            }

            // Check if token is still valid
            if (!isTokenValid(token)) {
              console.warn('Stored token is expired, clearing auth state')
              window.localStorage.removeItem('auth-token')
              window.localStorage.removeItem('auth-state')
              set({ isAuthenticated: false, user: null })
              return null
            }

            const state = JSON.parse(authState)
            return {
              state: {
                ...state,
                isAuthenticated: true
              }
            }
          } catch {
            set({ isAuthenticated: false, user: null })
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
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user
      }),
    }
  )
)
