"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/auth-store"
import { useState } from "react"
import { ArrowUp, ArrowDown, MoreHorizontal, Filter } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SalesChart } from "@/components/sales-chart"
import { OrdersChart } from "@/components/orders-chart"
import Sidebar from "@/components/sidebar"
import { RecentBookings } from "@/components/recent-bookings"
import { DateRangePicker } from "@/components/date-range-picker"
import { PageHeader } from "@/components/page-header"

export default function Dashboard() {
  const router = useRouter()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const [dateRange, setDateRange] = useState({
    from: new Date(2023, 0, 1),
    to: new Date(2023, 11, 31),
  })

  useEffect(() => {
    // Redirect to dashboard if authenticated, otherwise to login
    if (isAuthenticated === null) {
      return
    }
    if (isAuthenticated) {
      router.push("/dashboard")
    } else {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  // Return null while redirecting
  if (isAuthenticated === null) {
    return null
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - hidden on mobile */}
      <Sidebar className="hidden md:flex" activeItem="Dashboard" />

      {/* Main Content */}
      <div className="flex-1">
        <PageHeader />

        <main className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-500 mt-1">Welcome back, DG Crux</p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <DateRangePicker dateRange={dateRange} setDateRange={setDateRange} />
              <Button variant="outline" size="sm" className="text-gray-500 border-gray-200">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                Export
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatsCard
              title="Total Bookings"
              value="34"
              change="+12.5%"
              trend="up"
              description="vs. previous period"
              icon={<div className="bg-orange-100 p-3 rounded-lg text-orange-500">📅</div>}
            />
            <StatsCard
              title="Available Rooms"
              value="8"
              change="-3"
              trend="down"
              description="from yesterday"
              icon={<div className="bg-blue-100 p-3 rounded-lg text-blue-500">🏠</div>}
            />
            <StatsCard
              title="Total Members"
              value="23"
              change="+5"
              trend="up"
              description="this month"
              icon={<div className="bg-green-100 p-3 rounded-lg text-green-500">👥</div>}
            />
            <StatsCard
              title="Revenue"
              value="₹2,76,500"
              change="+8.2%"
              trend="up"
              description="vs. previous period"
              icon={<div className="bg-purple-100 p-3 rounded-lg text-purple-500">💰</div>}
            />
          </div>

          {/* Charts */}
          <Tabs defaultValue="overview" className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <TabsList className="bg-gray-100">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="bookings">Bookings</TabsTrigger>
                <TabsTrigger value="revenue">Revenue</TabsTrigger>
              </TabsList>
              <Button variant="ghost" size="sm" className="text-gray-500">
                <MoreHorizontal className="h-4 w-4 mr-2" />
                Options
              </Button>
            </div>

            <TabsContent value="overview" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white shadow-sm border-gray-200">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Sales Overview</h3>
                        <p className="text-sm text-gray-500">Monthly revenue performance</p>
                      </div>
                      <Button variant="outline" size="sm" className="text-gray-500 border-gray-200">
                        Monthly
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <SalesChart />
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm border-gray-200">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Booking Trends</h3>
                        <p className="text-sm text-gray-500">Bookings by month</p>
                      </div>
                      <Button variant="outline" size="sm" className="text-gray-500 border-gray-200">
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
              <Card className="bg-white shadow-sm border-gray-200">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
                  <p className="text-sm text-gray-500">Latest hotel reservations</p>
                </div>
                <CardContent className="p-0">
                  <RecentBookings />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="revenue" className="mt-0">
              <Card className="bg-white shadow-sm border-gray-200">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">Revenue Analysis</h3>
                  <p className="text-sm text-gray-500">Detailed revenue breakdown</p>
                </div>
                <CardContent className="p-6">
                  <div className="h-[400px] flex items-center justify-center text-gray-500">
                    Revenue analysis charts will appear here
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Recent Activity */}
          <Card className="bg-white shadow-sm border-gray-200">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                  <p className="text-sm text-gray-500">Latest updates and notifications</p>
                </div>
                <Button variant="link" className="text-orange-500">
                  View All
                </Button>
              </div>
            </div>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                <ActivityItem
                  avatar="/thoughtful-portrait.png"
                  name="Rahul Sharma"
                  action="booked"
                  target="Deluxe Suite"
                  time="2 hours ago"
                />
                <ActivityItem
                  avatar="/diverse-group-chatting.png"
                  name="Priya Patel"
                  action="cancelled"
                  target="Standard Room"
                  time="5 hours ago"
                />
                <ActivityItem
                  avatar="/diverse-group-chatting.png"
                  name="Vikram Singh"
                  action="checked in"
                  target="Executive Suite"
                  time="Yesterday"
                />
                <ActivityItem
                  avatar="/diverse-group-chatting.png"
                  name="Anjali Gupta"
                  action="checked out"
                  target="Family Room"
                  time="Yesterday"
                />
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}

function StatsCard({ title, value, change, trend, description, icon }) {
  return (
    <Card className="bg-white shadow-sm border-gray-200 hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold mt-1 text-gray-900">{value}</h3>
            <div className="flex items-center mt-1">
              <span
                className={`text-xs font-medium flex items-center ${
                  trend === "up" ? "text-green-500" : "text-red-500"
                }`}
              >
                {trend === "up" ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                {change}
              </span>
              <span className="text-xs text-gray-500 ml-1">{description}</span>
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
        <p className="text-sm font-medium text-gray-900">
          <span className="font-semibold">{name}</span>{" "}
          <span
            className={`${
              action === "booked"
                ? "text-green-500"
                : action === "cancelled"
                  ? "text-red-500"
                  : action === "checked in"
                    ? "text-blue-500"
                    : "text-gray-500"
            }`}
          >
            {action}
          </span>{" "}
          <span className="font-medium">{target}</span>
        </p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
      <Button variant="ghost" size="sm" className="text-gray-400">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </div>
  )
}
