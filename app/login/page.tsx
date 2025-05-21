"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuthStore } from "@/lib/auth-store"
import { Toaster } from "@/components/toaster"

export default function LoginPage() {
  const router = useRouter()
  const login = useAuthStore((state) => state.login)
  const loginWithOtp = useAuthStore((state) => state.loginWithOtp)

  const [passwordVisible, setPasswordVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Email/Password form state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // OTP form state
  const [otpEmail, setOtpEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)

  const handlePasswordLogin = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const result = await login(email, password)

      if (result.success) {
        router.push("/dashboard")
      } else {
        setError(result.message || "Login failed")
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleSendOtp = async (e) => {
    e.preventDefault()
    setError("")

    if (!otpEmail) {
      setError("Please enter your email")
      return
    }

    setLoading(true)

    // Simulate OTP sending
    setTimeout(() => {
      setOtpSent(true)
      setLoading(false)
    }, 1000)
  }

  const handleOtpLogin = async (e) => {
    e.preventDefault()
    setError("")

    if (!otp) {
      setError("Please enter the OTP")
      return
    }

    setLoading(true)

    try {
      const result = await loginWithOtp(otpEmail, otp)

      if (result.success) {
        router.push("/dashboard")
      } else {
        setError(result.message || "Invalid OTP")
      }
    } catch (err) {
      console.error("OTP login error:", err)
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 bg-gold rounded-xl transform rotate-6"></div>
              <div className="absolute inset-0 bg-gold-light rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                RB
              </div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">The Royal Bihar</h1>
          <p className="text-gray-500 mt-1">Login to access your dashboard</p>
        </div>

        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl text-center">Hotel Management System</CardTitle>
            <CardDescription className="text-center">Enter your credentials to sign in</CardDescription>
          </CardHeader>

          <Tabs defaultValue="password" className="w-full">
            <TabsList className="grid grid-cols-2 mx-6">
              <TabsTrigger value="password">Password</TabsTrigger>
              <TabsTrigger value="otp">OTP</TabsTrigger>
            </TabsList>

            <TabsContent value="password">
              <form onSubmit={handlePasswordLogin}>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="Email"
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type={passwordVisible ? "text" : "password"}
                        placeholder="Password"
                        className="pl-10 pr-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 text-gray-400"
                        onClick={() => setPasswordVisible(!passwordVisible)}
                      >
                        {passwordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="remember" className="rounded border-gray-300 text-orange-500" />
                      <label htmlFor="remember" className="text-sm text-gray-600">
                        Remember me
                      </label>
                    </div>
                    <Link href="#" className="text-sm font-medium text-gold hover:text-gold-dark">
                      Forgot password?
                    </Link>
                  </div>

                  {error && (
                    <Alert variant="destructive" className="text-sm py-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                </CardContent>

                <CardFooter className="flex flex-col gap-4">
                  <Button type="submit" className="w-full bg-gold hover:bg-gold-dark" disabled={loading}>
                    {loading ? "Signing in..." : "Sign in"}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>

            <TabsContent value="otp">
              <form onSubmit={otpSent ? handleOtpLogin : handleSendOtp}>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="Email"
                        className="pl-10"
                        value={otpEmail}
                        onChange={(e) => setOtpEmail(e.target.value)}
                        disabled={otpSent}
                        required
                      />
                    </div>
                  </div>

                  {otpSent && (
                    <div className="space-y-2">
                      <div className="relative">
                        <Input
                          type="text"
                          placeholder="Enter 6-digit OTP"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          maxLength={6}
                          pattern="\d{6}"
                          required
                        />
                      </div>
                      <div className="text-xs text-gray-500">OTP sent to {otpEmail}. Please check your inbox.</div>
                    </div>
                  )}

                  {error && (
                    <Alert variant="destructive" className="text-sm py-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                </CardContent>

                <CardFooter className="flex flex-col gap-4">
                  <Button type="submit" className="w-full bg-gold hover:bg-gold-dark" disabled={loading}>
                    {loading ? (otpSent ? "Verifying..." : "Sending OTP...") : otpSent ? "Verify OTP" : "Send OTP"}
                  </Button>

                  {otpSent && (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setOtpSent(false)
                        setOtp("")
                        setError("")
                      }}
                    >
                      Change Email
                    </Button>
                  )}
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        <div className="mt-6 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Demo Credentials</h3>
          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Admin:</span>
              <span className="font-mono">admin@royalbihar.com / admin123</span>
            </div>
            <div className="flex justify-between">
              <span>Front Office:</span>
              <span className="font-mono">frontdesk@royalbihar.com / password123</span>
            </div>
            <div className="flex justify-between">
              <span>HR:</span>
              <span className="font-mono">hr@royalbihar.com / password123</span>
            </div>
            <div className="flex justify-between">
              <span>Banquet:</span>
              <span className="font-mono">banquet@royalbihar.com / password123</span>
            </div>
            <div className="flex justify-between">
              <span>Accounts:</span>
              <span className="font-mono">accounts@royalbihar.com / password123</span>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  )
}
