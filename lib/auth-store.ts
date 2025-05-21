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

interface AuthState {
  isAuthenticated: boolean
  user: {
    id: string
    email: string
    name: string
    roleId: string
    permissions: Permission[]
  } | null
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  loginWithOtp: (email: string, otp: string) => Promise<{ success: boolean; message?: string }>
  logout: () => void
  hasPermission: (permission: Permission) => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      login: async (email, password) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Find user with matching credentials
        const user = MOCK_USERS.find((u) => u.email === email && u.password === password)

        if (user) {
          // Find user's role
          const role = PREDEFINED_ROLES.find((r) => r.id === user.roleId)

          if (!role) {
            return {
              success: false,
              message: "User role not found",
            }
          }

          // Set user with permissions
          set({
            isAuthenticated: true,
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              roleId: role.name,
              permissions: role.permissions,
            },
          })

          console.log("Login successful. User permissions:", role.permissions)
          return { success: true }
        }

        return {
          success: false,
          message: "Invalid email or password",
        }
      },
      loginWithOtp: async (email, otp) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Find user with matching email
        const user = MOCK_USERS.find((u) => u.email === email)

        // For demo purposes, any 6-digit OTP works for valid emails
        if (user && /^\d{6}$/.test(otp)) {
          // Find user's role
          const role = PREDEFINED_ROLES.find((r) => r.id === user.roleId)

          if (!role) {
            return {
              success: false,
              message: "User role not found",
            }
          }

          // Set user with permissions
          set({
            isAuthenticated: true,
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              roleId: role.name,
              permissions: role.permissions,
            },
          })

          console.log("OTP login successful. User permissions:", role.permissions)
          return { success: true }
        }

        return {
          success: false,
          message: email !== MOCK_USERS[0].email ? "Email not found" : "Invalid OTP. Please enter a 6-digit code",
        }
      },
      logout: () => {
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
    },
  ),
)
