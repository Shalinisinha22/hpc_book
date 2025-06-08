"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Eye, EyeOff, Mail, Lock, AlertCircle, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuthStore } from "@/lib/auth-store"
import { Toaster } from "@/components/toaster"

export default function LoginPage() {
  const router = useRouter()
  const login = useAuthStore((state) => state.login)

  const [passwordVisible, setPasswordVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Hotel highlights to display
  const hotelHighlights = [
    {
      title: "Luxurious Accommodations",
      description: "Experience unparalleled comfort in our elegantly designed rooms and suites with modern amenities",
      image: "/royal-bihar-facade.png",
    },
    {
      title: "Fine Dining Experience",
      description: "Savor exquisite cuisine at our signature restaurants offering both local and international flavors",
      image: "/royal-bihar-dining.png",
    },
    {
      title: "World-Class Facilities",
      description: "Enjoy our swimming pool, spa, fitness center, and business facilities during your stay",
      image: "/royal-bihar-interior.png",
    },
  ]

  // Auto-rotate images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % hotelHighlights.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [hotelHighlights.length])

  // Email/Password form state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

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

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Hotel imagery */}
      <div className="hidden md:block md:w-1/2 relative overflow-hidden">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#ac760a]/90 via-[#8a5e08]/80 to-[#c48c0c]/90 z-10"></div>

        {/* Islamic pattern overlay */}
        <div className="absolute inset-0 opacity-10 z-0">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="islamic-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M10,0 L20,10 L10,20 L0,10 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="10" cy="10" r="3" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="0" cy="0" r="1" fill="currentColor" />
              <circle cx="20" cy="0" r="1" fill="currentColor" />
              <circle cx="0" cy="20" r="1" fill="currentColor" />
              <circle cx="20" cy="20" r="1" fill="currentColor" />
            </pattern>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#islamic-pattern)" />
          </svg>
        </div>

        {/* Main hotel image with fade transition */}
        <div className="absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out">
          {hotelHighlights.map((highlight, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={highlight.image || "/placeholder.svg?height=800&width=600&query=luxury hotel architecture"}
                alt={highlight.title}
                layout="fill"
                objectFit="cover"
                priority={index === 0}
              />
            </div>
          ))}
        </div>

        {/* Content overlay */}
        <div className="relative z-20 flex flex-col justify-between h-full w-full p-12 text-white">
          <div>
            {/* Logo and hotel name */}
            <div className="flex items-center mb-8">
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-white/20 blur-sm"></div>
                <div className="relative">
                  <Image
                    src="/hotel-patliputra-logo.png"
                    alt="Hotel Patliputra Continental Logo"
                    width={100}
                    height={100}
                    className="rounded-full border-2 border-white/30"
                  />
                </div>
              </div>
              <div className="ml-4">
                <h1 className="text-3xl font-bold">Hotel Patliputra Continental</h1>
                <div className="flex items-center mt-1">
                  <span className="text-white/80">Tradition & Hospitality</span>
                  <div className="flex ml-2">
                    <span className="text-yellow-400">★</span>
                    <span className="text-yellow-400">★</span>
                    <span className="text-yellow-400">★</span>
                    <span className="text-yellow-400">★</span>
                    <span className="text-yellow-400">★</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hotel highlight information */}
            <div className="mt-8 max-w-md">
              <div className="bg-black/30 backdrop-blur-sm p-6 rounded-lg border border-white/10">
                <h2 className="text-2xl font-semibold mb-2">Welcome to Hotel Patliputra Continental</h2>

                <div className="mt-6 space-y-4">
                  {hotelHighlights.map((highlight, index) => (
                    <div
                      key={index}
                      className={`transition-all duration-500 ${
                        index === currentImageIndex ? "opacity-100 translate-x-0" : "opacity-40 translate-x-2"
                      }`}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-2 h-2 rounded-full ${index === currentImageIndex ? "bg-white" : "bg-white/50"}`}
                        ></div>
                        <h3
                          className={`ml-3 font-medium ${index === currentImageIndex ? "text-white" : "text-white/70"}`}
                        >
                          {highlight.title}
                        </h3>
                      </div>
                      {index === currentImageIndex && (
                        <p className="text-white/80 text-sm ml-5 mt-1 animate-fadeIn">{highlight.description}</p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-between items-center">
                  <span className="text-sm text-white/70">Luxury and comfort in the heart of Patna</span>
                  <div className="flex space-x-1">
                    {hotelHighlights.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentImageIndex ? "bg-white scale-125" : "bg-white/50"
                        }`}
                        aria-label={`View ${hotelHighlights[index].title}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto">
            {/* Testimonial */}
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/10 mb-6">
              <div className="flex items-start">
                <span className="text-4xl text-yellow-300 leading-none mr-2">"</span>
                <p className="text-white/90 italic text-sm">
                  Hotel Patliputra Continental offers the perfect blend of traditional hospitality and modern luxury,
                  creating a welcoming and elegant atmosphere for all our distinguished guests.
                </p>
              </div>
              <div className="flex justify-end">
                <p className="text-yellow-200 text-xs font-medium mt-2">- Hospitality Today</p>
              </div>
            </div>

            {/* Indian flag colors strip */}
            <div className="flex mt-4">
              <div className="h-5 w-full bg-orange-500 rounded-l-md"></div>
              <div className="h-5 w-full bg-white relative">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-5 h-5 rounded-full">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 text-blue-600">
                      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M12 2 L12 22 M2 12 L22 12" stroke="currentColor" strokeWidth="0.5" />
                      <path
                        d="M12 2 L12 22 M2 12 L22 12"
                        stroke="currentColor"
                        strokeWidth="0.5"
                        transform="rotate(45 12 12)"
                      />
                      <path
                        d="M12 2 L12 22 M2 12 L22 12"
                        stroke="currentColor"
                        strokeWidth="0.5"
                        transform="rotate(90 12 12)"
                      />
                      <path
                        d="M12 2 L12 22 M2 12 L22 12"
                        stroke="currentColor"
                        strokeWidth="0.5"
                        transform="rotate(135 12 12)"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="h-5 w-full bg-green-600 rounded-r-md"></div>
            </div>

            <p className="text-sm mt-4 text-white/70">
              © {new Date().getFullYear()} Hotel Patliputra Continental. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile logo - only visible on mobile */}
          <div className="flex flex-col items-center mb-8 md:hidden">
            <div className="flex items-center mb-4">
              <Image src="/hotel-patliputra-logo.png" alt="Hotel Patliputra Continental Logo" width={90} height={90} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Hotel Patliputra Continental</h1>
            <p className="text-gray-500 mt-1">Tradition & Hospitality</p>

            {/* Indian flag colors strip for mobile */}
            <div className="flex w-full mt-4 mb-6">
              <div className="h-4 w-full bg-orange-500 rounded-l-md"></div>
              <div className="h-4 w-full bg-white relative">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-3 h-3 rounded-full border border-blue-600"></div>
                </div>
              </div>
              <div className="h-4 w-full bg-green-600 rounded-r-md"></div>
            </div>
          </div>

          <Card className="border-gray-200 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-[#ac760a] to-[#c48c0c] h-2"></div>
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl font-bold text-center">Hotel Management System</CardTitle>
              <CardDescription className="text-center">Enter your credentials to access your dashboard</CardDescription>
            </CardHeader>

            <form onSubmit={handlePasswordLogin}>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="Email"
                      className="pl-10 h-12"
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
                      className="pl-10 pr-10 h-12"
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

                {/* <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="remember" className="rounded border-gray-300 text-[#ac760a]" />
                    <label htmlFor="remember" className="text-sm text-gray-600">
                      Remember me
                    </label>
                  </div>
                  <Link href="#" className="text-sm font-medium text-[#ac760a] hover:text-[#8a5e08]">
                    Forgot password?
                  </Link>
                </div> */}

                {error && (
                  <Alert variant="destructive" className="text-sm py-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </CardContent>

              <CardFooter className="flex flex-col gap-4">
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-[#ac760a] to-[#c48c0c] hover:from-[#8a5e08] hover:to-[#ac760a] text-white"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign in"}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </form>
          </Card>

          <div className="mt-6 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Demo Credentials</h3>
            <div className="space-y-1 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Admin:</span>
                <span className="font-mono">admin@patliputra.com / admin123</span>
              </div>
              <div className="flex justify-between">
                <span>Front Office:</span>
                <span className="font-mono">frontdesk@patliputra.com / password123</span>
              </div>
              <div className="flex justify-between">
                <span>HR:</span>
                <span className="font-mono">hr@patliputra.com / password123</span>
              </div>
              <div className="flex justify-between">
                <span>Banquet:</span>
                <span className="font-mono">banquet@patliputra.com / password123</span>
              </div>
              <div className="flex justify-between">
                <span>Accounts:</span>
                <span className="font-mono">accounts@patliputra.com / password123</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  )
}
