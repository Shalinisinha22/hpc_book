"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/auth-store"

export default function LogoutPage() {
  const router = useRouter()
  const logout = useAuthStore((state) => state.logout)

  useEffect(() => {
    // Clear authentication state
    logout()

    // Redirect to login page
    setTimeout(() => {
      router.push("/login")
    }, 500)
  }, [logout, router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Logging out...</h1>
        <p className="text-gray-500">You will be redirected to the login page.</p>
      </div>
    </div>
  )
}
