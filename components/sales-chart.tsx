"use client"

import { useEffect, useRef, useState } from "react"
import { Chart, registerables } from "chart.js"
import { API_ROUTES } from "@/config/api"

Chart.register(...registerables)

function getCalendarYearLabels() {
  return [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ]
}

function getCalendarYearKeys() {
  const now = new Date()
  const year = now.getFullYear()
  return Array.from({ length: 12 }, (_, i) => `${year}-${String(i + 1).padStart(2, "0")}`)
}

export function SalesChart() {
  const chartRef = useRef<HTMLCanvasElement | null>(null)
  const chartInstance = useRef<Chart | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [monthlyData, setMonthlyData] = useState<number[]>([])

  useEffect(() => {
    const fetchRevenue = async () => {
      setLoading(true)
      setError(null)
      try {
        const token = localStorage.getItem("auth-token")
        const response = await fetch(API_ROUTES.bookings.monthlyRevenue, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        })
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || "Failed to fetch revenue data")
        }
        const data = await response.json()
        // data.data: [{ month: "YYYY-MM", totalRevenue: number }, ...]
        const monthsKeys = getCalendarYearKeys()
        const revenueMap = new Map<string, number>()
        if (Array.isArray(data.data)) {
          for (const entry of data.data) {
            if (entry.month && typeof entry.totalRevenue === "number") {
              revenueMap.set(entry.month, entry.totalRevenue)
            }
          }
        }
        const monthlyArr = monthsKeys.map((key) => revenueMap.get(key) || 0)
        setMonthlyData(monthlyArr)
      } catch (err: any) {
        setError(err.message || "Failed to fetch revenue data")
        setMonthlyData(Array(12).fill(0))
      } finally {
        setLoading(false)
      }
    }
    fetchRevenue()
  }, [])

  useEffect(() => {
    if (chartRef.current && monthlyData.length === 12) {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
      const ctx = chartRef.current.getContext("2d")
      if (!ctx) return
      const gradient = ctx.createLinearGradient(0, 0, 0, 400)
      gradient.addColorStop(0, "rgba(191, 132, 13, 0.4)")
      gradient.addColorStop(1, "rgba(191, 132, 13, 0.0)")
      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: getCalendarYearLabels(),
          datasets: [
            {
              label: "Revenue",
              data: monthlyData,
              borderColor: "#bf840d",
              backgroundColor: gradient,
              borderWidth: 2,
              tension: 0.4,
              fill: true,
              pointBackgroundColor: "#fff",
              pointBorderColor: "#bf840d",
              pointBorderWidth: 2,
              pointRadius: 4,
              pointHoverRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              mode: "index",
              intersect: false,
              backgroundColor: "#fff",
              titleColor: "#111827",
              bodyColor: "#4b5563",
              borderColor: "#e5e7eb",
              borderWidth: 1,
              padding: 12,
              boxPadding: 6,
              usePointStyle: true,
              callbacks: {
                label: (context: any) => `Revenue: ₹${context.parsed.y.toLocaleString("en-IN")}`,
              },
            },
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: "#9ca3af" },
            },
            y: {
              beginAtZero: true,
              grid: { color: "#f3f4f6" },
              ticks: {
                color: "#9ca3af",
                callback: (value: string | number) => "₹" + Number(value).toLocaleString("en-IN"),
              },
            },
          },
          interaction: { mode: "index", intersect: false },
        },
      })
    }
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [monthlyData])

  return (
    <div className="h-[300px] w-full">
      {loading ? (
        <div className="flex items-center justify-center h-full text-gray-500">Loading sales chart...</div>
      ) : error ? (
        <div className="flex items-center justify-center h-full text-red-500">{error}</div>
      ) : (
        <canvas ref={chartRef} />
      )}
    </div>
  )
}
