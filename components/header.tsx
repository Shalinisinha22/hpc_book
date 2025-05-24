"use client"

import { useState, useEffect } from "react"
import { Search, Bell, Menu, X, ChevronDown, Globe } from "lucide-react"
import { useAuthStore } from "@/lib/auth-store"
import { motion, AnimatePresence } from "framer-motion"

export function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user } = useAuthStore()

  // Instead of using useTheme, detect dark mode from the DOM
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // Check for dark mode
    const checkDarkMode = () => {
      if (typeof window !== "undefined") {
        const isDark =
          document.documentElement.classList.contains("dark") ||
          window.matchMedia("(prefers-color-scheme: dark)").matches
        setIsDarkMode(isDark)
      }
    }

    checkDarkMode()

    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          checkDarkMode()
        }
      })
    })

    if (typeof document !== "undefined") {
      observer.observe(document.documentElement, { attributes: true })
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuOpen && !(event.target as Element).closest(".user-menu-container")) {
        setUserMenuOpen(false)
      }
      if (notificationsOpen && !(event.target as Element).closest(".notifications-container")) {
        setNotificationsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [userMenuOpen, notificationsOpen])

  const notifications = [
    { id: 1, text: "New booking confirmed", time: "5 min ago" },
    { id: 2, text: "Payment received", time: "1 hour ago" },
    { id: 3, text: "New review submitted", time: "3 hours ago" },
  ]

  // Use the isDarkMode state instead of theme
  const theme = isDarkMode ? "dark" : "light"

  return (
    <header
      className={`bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 ${
        scrolled ? "shadow-lg" : ""
      } h-16 flex items-center justify-between px-6 sticky top-0 z-50 transition-all duration-300`}
    >
      <div className="flex items-center gap-4">
        <button
          className="md:hidden text-white p-1 rounded-md hover:bg-white/10 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="hidden md:flex items-center">
          <img
            src="/hotel-patliputra-logo.png"
            alt="Hotel Patliputra Continental Logo"
            className="h-9 w-auto mr-3 drop-shadow-md"
          />
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-white/20 rounded-full blur-md group-hover:bg-white/30 transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
          <div className="relative">
            <Search
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === "light" ? "text-amber-900/70 group-hover:text-amber-900" : "text-gray-400 group-hover:text-gray-300"} h-4 w-4 transition-colors duration-200`}
            />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 pr-4 py-2 rounded-full ${theme === "light" ? "bg-white/90 focus:ring-amber-300" : "bg-gray-800/90 text-white focus:ring-gray-600"} text-sm w-56 md:w-64 focus:outline-none focus:ring-2 focus:bg-white dark:focus:bg-gray-800 shadow-sm transition-all duration-200 backdrop-blur-sm`}
            />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`absolute top-16 left-0 right-0 ${theme === "light" ? "bg-gradient-to-b from-amber-600 to-amber-700" : "bg-gradient-to-b from-gray-800 to-gray-900"} shadow-lg p-4 md:hidden z-40`}
          >
            <div className="flex flex-col space-y-3">
              <a href="/dashboard" className="text-white hover:bg-white/10 p-2 rounded-md transition-colors">
                Dashboard
              </a>
              <a href="/bookings" className="text-white hover:bg-white/10 p-2 rounded-md transition-colors">
                Bookings
              </a>
              <a href="/rooms-and-suites" className="text-white hover:bg-white/10 p-2 rounded-md transition-colors">
                Rooms & Suites
              </a>
              <a href="/members" className="text-white hover:bg-white/10 p-2 rounded-md transition-colors">
                Members
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3">
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`${
              theme === "light"
                ? "bg-gradient-to-br from-blue-400 to-blue-600"
                : "bg-gradient-to-br from-blue-500 to-blue-700"
            } 
              rounded-full p-2 text-white hover:shadow-md transition-all duration-200 shadow-sm`}
            onClick={() => window.open("https://hotelpatliputra.com/", "_blank")}
          >
            <Globe className="h-5 w-5 drop-shadow-sm" />
          </motion.button>

          <motion.div className="relative notifications-container">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`${
                theme === "light"
                  ? "bg-gradient-to-br from-yellow-400 to-yellow-600"
                  : "bg-gradient-to-br from-amber-500 to-amber-700"
              } 
                rounded-full p-2 text-white hover:shadow-md transition-all duration-200 shadow-sm relative`}
              onClick={() => setNotificationsOpen(!notificationsOpen)}
            >
              <Bell className="h-5 w-5 drop-shadow-sm" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-sm border border-white/30">
                3
              </span>
            </motion.button>

            <AnimatePresence>
              {notificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className={`absolute right-0 mt-2 w-72 ${theme === "light" ? "bg-white" : "bg-gray-800"} rounded-lg shadow-lg overflow-hidden z-50`}
                >
                  <div
                    className={`p-3 ${
                      theme === "light"
                        ? "bg-gradient-to-r from-amber-500 to-orange-500"
                        : "bg-gradient-to-r from-gray-700 to-gray-800"
                    } text-white font-medium flex justify-between items-center`}
                  >
                    <span>Notifications</span>
                    <span className="text-xs bg-white/20 px-2 py-1 rounded-full">3 new</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 border-b ${
                          theme === "light" ? "border-gray-100 hover:bg-gray-50" : "border-gray-700 hover:bg-gray-700"
                        } transition-colors`}
                      >
                        <div className={`text-sm font-medium ${theme === "light" ? "text-gray-800" : "text-gray-200"}`}>
                          {notification.text}
                        </div>
                        <div className={`text-xs ${theme === "light" ? "text-gray-500" : "text-gray-400"} mt-1`}>
                          {notification.time}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className={`p-2 ${theme === "light" ? "bg-gray-50" : "bg-gray-700"} text-center`}>
                    <button
                      className={`text-sm ${
                        theme === "light"
                          ? "text-amber-600 hover:text-amber-700"
                          : "text-amber-400 hover:text-amber-300"
                      } font-medium`}
                    >
                      View all notifications
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        <div className="flex items-center ml-3 relative group user-menu-container">
          <div
            className="hidden md:flex items-center cursor-pointer hover:bg-white/10 rounded-full pl-3 pr-2 py-1 transition-colors"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
          >
            <div className="text-white font-medium mr-1">{user?.name || "DG Crux"}</div>
            <ChevronDown
              size={16}
              className={`text-white/70 transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`}
            />
          </div>
          <div
            className={`h-9 w-9 rounded-full ${
              theme === "light"
                ? "bg-gradient-to-br from-amber-300 to-amber-100 text-amber-800"
                : "bg-gradient-to-br from-amber-500 to-amber-700 text-white"
            } flex items-center justify-center font-semibold border-2 border-white/30 shadow-sm cursor-pointer`}
            onClick={() => setUserMenuOpen(!userMenuOpen)}
          >
            {(user?.name?.[0] || "D").toUpperCase()}
          </div>

          <AnimatePresence>
            {userMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className={`absolute right-0 top-full mt-2 w-48 ${
                  theme === "light" ? "bg-white" : "bg-gray-800"
                } rounded-lg shadow-lg overflow-hidden z-50`}
              >
                <div className={`p-3 border-b ${theme === "light" ? "border-gray-100" : "border-gray-700"}`}>
                  <div className={`text-sm font-medium ${theme === "light" ? "text-gray-800" : "text-gray-200"}`}>
                    {user?.name || "DG Crux"}
                  </div>
                  <div className={`text-xs ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}>
                    {user?.email || "admin@patliputra.com"}
                  </div>
                </div>
                <div className="py-1">
                  <a
                    href="/settings"
                    className={`block px-4 py-2 text-sm ${
                      theme === "light" ? "text-gray-700 hover:bg-gray-100" : "text-gray-200 hover:bg-gray-700"
                    } transition-colors`}
                  >
                    Settings
                  </a>
                  <a
                    href="/logout"
                    className={`block px-4 py-2 text-sm ${
                      theme === "light" ? "text-red-600 hover:bg-gray-100" : "text-red-400 hover:bg-gray-700"
                    } transition-colors`}
                  >
                    Logout
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
