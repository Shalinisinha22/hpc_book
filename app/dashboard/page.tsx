"use client"

import { useState, useEffect } from "react"
import { ArrowUp, ArrowDown, MoreHorizontal } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SalesChart } from "@/components/sales-chart"
import { OrdersChart } from "@/components/orders-chart"
import { RecentBookings } from "@/components/recent-bookings"
import { PageHeader } from "@/components/page-header"
import {  API_ROUTES } from "@/config/api"
// Remove the direct import of useTheme if it's causing issues
// We'll use a more resilient approach

export default function Dashboard() {
  const [dateRange, setDateRange] = useState({
    from: new Date(2023, 0, 1),
    to: new Date(2023, 11, 31),
  })

  // Instead of using useTheme directly, we'll use a more resilient approach
  // that doesn't depend on the theme provider
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [totalBookings, setTotalBookings] = useState(0)
  const [isLoadingBookings, setIsLoadingBookings] = useState(true)
  const [availableRooms, setAvailableRooms] = useState(0)
  const [availableMembers,setAvailableMembers]= useState(0)
  const [isLoadingMembers,setIsLoadingMembers]= useState(0)
  const [isLoadingRooms, setIsLoadingRooms] = useState(true)
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [isLoadingRevenue, setIsLoadingRevenue] = useState(true)

  // Check for dark mode preference on component mount
  useState(() => {
    if (typeof window !== "undefined") {
      const isDark =
        document.documentElement.classList.contains("dark") || window.matchMedia("(prefers-color-scheme: dark)").matches
      setIsDarkMode(isDark)
    }
  })

  // Fetch total bookings count
  useEffect(() => {
    const fetchBookingsCount = async () => {
      try {
        setIsLoadingBookings(true)
        const response = await fetch(`${API_ROUTES.bookings.all}/counter`,{
         
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("auth-token")}`
            }
      
        
        })
        if (response.ok) {
          const data = await response.json()
          setTotalBookings(data.count || 0)
        } else {
          console.error('Failed to fetch bookings count:', response.statusText)
        }
      } catch (error) {
        console.error('Error fetching bookings count:', error)
      } finally {
        setIsLoadingBookings(false)
      }
    }

    fetchBookingsCount()
  }, [])

  // Fetch available rooms count
  useEffect(() => {
    const fetchAvailableRooms = async () => {
      try {
        setIsLoadingRooms(true)
        const response = await fetch(`${API_ROUTES.rooms}/status/available/`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("auth-token")}`
          }
        })
        if (response.ok) {
          const data = await response.json()
          // Assuming the API returns an array of available rooms or an object with count
          if (Array.isArray(data)) {
            setAvailableRooms(data.length)
          } else if (data.count !== undefined) {
            setAvailableRooms(data.count)
          } else {
            setAvailableRooms(0)
          }
        } else {
          console.error('Failed to fetch available rooms:', response.statusText)
        }
      } catch (error) {
        console.error('Error fetching available rooms:', error)
      } finally {
        setIsLoadingRooms(false)
      }
    }

    fetchAvailableRooms()
  }, [])

  //Fetch available membership count

    useEffect(() => {
    const fetchAvailableMembers = async () => {
      try {
        setIsLoadingRooms(true)
        const response = await fetch(`${API_ROUTES.members}/`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("auth-token")}`
          }
        })
        if (response.ok) {
          const data = await response.json()
       
          if (Array.isArray(data)) {
            setAvailableMembers(data.length)
          } else if (data.count !== undefined) {
            setAvailableMembers(data.count)
          } else {
            setAvailableMembers(0)
          }
        } else {
          console.error('Failed to fetch available members:', response.statusText)
        }
      } catch (error) {
        console.error('Error fetching available members:', error)
      } finally {
        setIsLoadingMembers(false)
      }
    }

    fetchAvailableMembers()
  }, [])

  // Fetch total revenue
  useEffect(() => {
    const fetchTotalRevenue = async () => {
      try {
        setIsLoadingRevenue(true)
        const response = await fetch(`${API_ROUTES.bookings.all}/revenue`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("auth-token")}`
          }
        })
        if (response.ok) {
          const data = await response.json()
          setTotalRevenue(data.totalRevenue || 0)
        } else {
          console.error('Failed to fetch total revenue:', response.statusText)
        }
      } catch (error) {
        console.error('Error fetching total revenue:', error)
      } finally {
        setIsLoadingRevenue(false)
      }
    }

    fetchTotalRevenue()
  }, [])

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Main Content */}
      <div className="flex-1">
        <PageHeader />

        <main className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back, DG Crux</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatsCard
              title="Total Bookings"
              value={isLoadingBookings ? "Loading..." : totalBookings.toString()}
              // change="+12.5%"
              // trend="up"
              // description="vs. previous period"
              icon={
                <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-lg text-orange-500 dark:text-orange-300">
                  📅
                </div>
              }
            />
            <StatsCard
              title="Available Rooms"
              value={isLoadingRooms ? "Loading..." : availableRooms.toString()}
              // change="-3"
              // trend="down"
              // description="from yesterday"
              icon={
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg text-blue-500 dark:text-blue-300">
                  🏠
                </div>
              }
            />
            <StatsCard
              title="Total Members"
              value={isLoadingMembers ? "Loading..." : availableMembers.toString()}
              // change="+5"
              // trend="up"
              // description="this month"
              icon={
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg text-green-500 dark:text-green-300">
                  👥
                </div>
              }
            />
            <StatsCard
              title="Revenue"
              value={isLoadingRevenue ? "Loading..." : `₹${totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
              // change="+8.2%"
              // trend="up"
              // description="vs. previous period"
              icon={
                <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg text-purple-500 dark:text-purple-300">
                  💰
                </div>
              }
            />
          </div>

          {/* Charts */}
          <Tabs defaultValue="overview" className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <TabsList className="bg-gray-100 dark:bg-gray-800">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="bookings">Bookings</TabsTrigger>
                {/* <TabsTrigger value="revenue">Revenue</TabsTrigger> */}
              </TabsList>
            </div>

            <TabsContent value="overview" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white dark:bg-gray-800 shadow-sm border-gray-200 dark:border-gray-700">
                  <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Sales Overview</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Monthly revenue performance</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700"
                      >
                        Monthly
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <SalesChart />
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-gray-800 shadow-sm border-gray-200 dark:border-gray-700">
                  <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Booking Trends</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Bookings by month</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700"
                      >
                        This Year
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <OrdersChart />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="bookings" className="mt-0">
              <Card className="bg-white dark:bg-gray-800 shadow-sm border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Bookings</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Latest hotel reservations</p>
                </div>
                <CardContent className="p-0">
                  <RecentBookings />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="revenue" className="mt-0">
              <Card className="bg-white dark:bg-gray-800 shadow-sm border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Revenue Analysis</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Detailed revenue breakdown</p>
                </div>
                <CardContent className="p-6">
                  <div className="h-[400px] flex items-center justify-center text-gray-500 dark:text-gray-400">
                    Revenue analysis charts will appear here
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

function StatsCard({ title, value, change, trend, description, icon }) {
  return (
    <Card className="bg-white dark:bg-gray-800 shadow-sm border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-gray-100">{value}</h3>
            <div className="flex items-center mt-1">
              {/* <span
                className={`text-xs font-medium flex items-center ${
                  trend === "up" ? "text-green-500 dark:text-green-400" : "text-red-500 dark:text-red-400"
                }`}
              >
                {trend === "up" ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                {change}
              </span> */}
              {/* <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">{description}</span> */}
            </div>
          </div>
          {icon}
        </div>
      </CardContent>
    </Card>
  )
}

function ActivityItem({ avatar, name, action, target, time }) {
  return (
    <div className="flex items-center gap-4 p-4">
      <Avatar className="h-10 w-10">
        <AvatarImage src={avatar || "/placeholder.svg"} alt={name} />
        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          <span className="font-semibold">{name}</span>{" "}
          <span
            className={`${
              action === "booked"
                ? "text-green-500 dark:text-green-400"
                : action === "cancelled"
                  ? "text-red-500 dark:text-red-400"
                  : action === "checked in"
                    ? "text-blue-500 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {action}
          </span>{" "}
          <span className="font-medium">{target}</span>
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{time}</p>
      </div>
      <Button variant="ghost" size="sm" className="text-gray-400 dark:text-gray-500">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </div>
  )
}