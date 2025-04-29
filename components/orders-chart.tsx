"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

export function OrdersChart() {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    if (chartRef.current) {
      // Destroy existing chart
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }

      // Create the chart
      const ctx = chartRef.current.getContext("2d")
      chartInstance.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          datasets: [
            {
              label: "Bookings",
              data: [25, 20, 30, 22, 17, 28, 32, 27, 34, 26, 22, 30],
              backgroundColor: "#bf840d",
              borderRadius: 6,
              barThickness: 12,
              maxBarThickness: 12,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
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
                label: (context) => `Bookings: ${context.parsed.y}`,
              },
            },
          },
          scales: {
            x: {
              grid: {
                display: false,
              },
              ticks: {
                color: "#9ca3af",
              },
            },
            y: {
              beginAtZero: true,
              grid: {
                color: "#f3f4f6",
              },
              ticks: {
                color: "#9ca3af",
                stepSize: 10,
              },
            },
          },
        },
      })
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [])

  return (
    <div className="h-[300px] w-full">
      <canvas ref={chartRef} />
    </div>
  )
}
