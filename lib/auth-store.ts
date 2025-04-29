import { create } from "zustand"
import { persist } from "zustand/middleware"

interface AuthState {
  isAuthenticated: boolean
  user: { email: string; name: string } | null
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  loginWithOtp: (email: string, otp: string) => Promise<{ success: boolean; message?: string }>
  logout: () => void
}

// Dummy credentials
const VALID_CREDENTIALS = {
  email: "admin@royalbihar.com",
  password: "admin123",
  name: "DG Crux",
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: async (email, password) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Check if credentials match
        if (email === VALID_CREDENTIALS.email && password === VALID_CREDENTIALS.password) {
          set({
            isAuthenticated: true,
            user: {
              email: VALID_CREDENTIALS.email,
              name: VALID_CREDENTIALS.name,
            },
          })
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

        // For demo purposes, any 6-digit OTP works for the valid email
        if (email === VALID_CREDENTIALS.email && /^\d{6}$/.test(otp)) {
          set({
            isAuthenticated: true,
            user: {
              email: VALID_CREDENTIALS.email,
              name: VALID_CREDENTIALS.name,
            },
          })
          return { success: true }
        }

        return {
          success: false,
          message: email !== VALID_CREDENTIALS.email ? "Email not found" : "Invalid OTP. Please enter a 6-digit code",
        }
      },
      logout: () => {
        set({ isAuthenticated: false, user: null })
      },
    }),
    {
      name: "auth-storage",
    },
  ),
)
