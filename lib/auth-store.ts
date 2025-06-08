import { create } from "zustand"
import { persist } from "zustand/middleware"
import { PREDEFINED_ROLES, type Permission } from "@/lib/permissions"

// Mock users for demo
const MOCK_USERS = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@royalbihar.com",
    password: "admin123",
    roleId: "1", // Admin role
  },
  {
    id: "2",
    name: "Front Office Staff",
    email: "frontdesk@royalbihar.com",
    password: "password123",
    roleId: "2", // Front Office role
  },
  {
    id: "3",
    name: "HR Manager",
    email: "hr@royalbihar.com",
    password: "password123",
    roleId: "3", // HR role
  },
  {
    id: "4",
    name: "Banquet Service",
    email: "banquet@royalbihar.com",
    password: "password123",
    roleId: "4", // Bqt Service role
  },
  {
    id: "5",
    name: "Accounts Manager",
    email: "accounts@royalbihar.com",
    password: "password123",
    roleId: "5", // Account role
  },
]

// Update AuthState interface to include token
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
              message: data.message || "Login failed. Please check your credentials.",
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

          set({
            isAuthenticated: true,
            user: {
              id: data.result._id || '',
              email: userEmail,
              name,
              roleId: role,
              permissions: userRole.permissions,
              token: token
            },
          })

       
          localStorage.setItem('authToken', token)

          return { success: true }
        } catch (error) {
          console.error('Login error:', error)
          return {
            success: false,
            message: "Network error. Please try again.",
          }
        }
      },
    
      logout: () => {
        localStorage.removeItem('authToken')
        set({ isAuthenticated: false, user: null })
      },
      hasPermission: (permission: Permission) => {
        const { user } = get()
        if (!user) return false

        const hasPermission = user.permissions.includes(permission)
        return hasPermission
      },
    }),
    {
      name: "auth-storage",
    }
  )
)
