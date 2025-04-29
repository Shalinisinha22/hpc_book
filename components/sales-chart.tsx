"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

export function SalesChart() {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    if (chartRef.current) {
      // Destroy existing chart
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }

      const ctx = chartRef.current.getContext("2d")

      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, 400)
      gradient.addColorStop(0, "rgba(191, 132, 13, 0.4)")
      gradient.addColorStop(1, "rgba(191, 132, 13, 0.0)")

      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          datasets: [
            {
              label: "Revenue",
              data: [90000, 142500, 112500, 187500, 165000, 225000, 210000, 187500, 225000, 262500, 210000, 270000],
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
                label: (context) => `Revenue: ₹${context.parsed.y.toLocaleString("en-IN")}`,
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
                callback: (value) => "₹" + value.toLocaleString("en-IN"),
              },
            },
          },
          interaction: {
            mode: "index",
            intersect: false,
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
