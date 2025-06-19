"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Printer, Info, User, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"
import Image from "next/image"
import { Sidebar } from "@/components/sidebar"
import { API_ROUTES } from "@/config/api"
import { toast } from "@/components/ui/use-toast"

export default function BookingDetailsPage({ params }) {
  const router = useRouter()
  const { id } = params
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch booking details from API
  const fetchBookingDetails = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("auth-token")
      if (!token) {
        throw new Error("Not authenticated")
      }

      const response = await fetch(`${API_ROUTES.bookings}/${id}`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      })


      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch booking details")
      }

      const data = await response.json()
      console.log("Fetched booking details:", data)

      // Check if response has the expected structure
      if (data.status === "success" && data.data) {
        setBooking(data.data)
      } else if (data.bookingId) {
        // Handle direct booking object response
        setBooking(data)
      } else {
        throw new Error("Invalid response format")
      }
    } catch (error) {
      console.error("Fetch booking details error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch booking details",
        variant: "destructive",
      })
      // Set a basic booking structure for display
      setBooking({
        bookingId: id,
        fullName: "N/A",
        email: "N/A",
        phone: "N/A",
        createdAt: new Date().toISOString(),
        paymentStatus: "unknown",
        checkInDate: null,
        checkOutDate: null,
        noOfRooms: 0,
        noOfGuests: { adults: 0, children: 0 },
        totalPrice: 0,
        specialRequest: ""
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookingDetails()
  }, [id])

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar className="hidden md:flex" activeItem="Bookings" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading booking details...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - hidden on mobile */}
      <Sidebar className="hidden md:flex" activeItem="Bookings" />

      {/* Main Content */}
      <div className="flex-1">
        <PageHeader />

        <main className="p-4 md:p-6 booking-details-content">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">Booking Details</h1>
              <Info className="h-5 w-5 text-orange-500" />
            </div>
            <Button
              className="mt-2 sm:mt-0 bg-gold hover:bg-gold-dark"
              onClick={() => {
                // Create a print-specific stylesheet
                const style = document.createElement("style")
                style.innerHTML = `
                  @media print {
                    body * {
                      visibility: hidden;
                    }
                    .invoice-section, .invoice-section * {
                      visibility: visible;
                    }
                    .invoice-section {
                      position: absolute;
                      left: 0;
                      top: 0;
                      width: 100%;
                      padding: 20px;
                      background-color: white;
                    }
                    @page {
                      size: auto;
                      margin: 10mm;
                    }
                    .no-print {
                      display: none !important;
                    }
                    /* Invoice-specific print styles */
                    .invoice-section table {
                      width: 100%;
                      border-collapse: collapse;
                    }
                    .invoice-section th, .invoice-section td {
                      padding: 8px;
                      text-align: left;
                    }
                    .invoice-section .bg-orange-100, .invoice-section .bg-orange-200, .invoice-section .bg-gray-100 {
                      background-color: white !important;
                      border: 1px solid #ddd;
                    }
                    .invoice-section .text-gold {
                      color: #000 !important;
                      font-weight: bold;
                    }
                  }
                `
                document.head.appendChild(style)

                // Add print class to the invoice section
                const invoiceSection = document.querySelector(".bg-white.rounded-lg.shadow-sm.p-6.mb-6")
                if (invoiceSection) {
                  invoiceSection.classList.add("invoice-section")
                }

                // Add no-print class to buttons and other elements
                const noPrintElements = document.querySelectorAll(
                  ".sidebar, .page-header, button, .grid.grid-cols-1.md\\:grid-cols-3",
                )
                noPrintElements.forEach((el) => {
                  el.classList.add("no-print")
                })

                // Print and then clean up
                window.print()

                // Remove the style and classes after printing
                setTimeout(() => {
                  document.head.removeChild(style)
                  if (invoiceSection) {
                    invoiceSection.classList.remove("invoice-section")
                  }
                  noPrintElements.forEach((el) => {
                    el.classList.remove("no-print")
                  })
                }, 1000)
              }}
            >
              <Printer className="mr-2 h-4 w-4" />
              PRINT
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Guest Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Guest Details</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-8 text-gray-400">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-gray-500">:</div>
                  </div>
                  <div className="flex-[2]">
                    <div className="text-gray-700">{booking.fullName}</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-8 text-gray-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-gray-500">:</div>
                  </div>
                  <div className="flex-[2]">
                    <div className="text-gray-700">{booking.email}</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-8 text-gray-400">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-gray-500">:</div>
                  </div>
                  <div className="flex-[2]">
                    <div className="text-gray-700">{booking.phone}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Details</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-32 text-gray-500">Booking ID</div>
                  <div className="w-4 text-gray-500">:</div>
                  <div className="flex-1 text-gray-700">{booking.bookingId}</div>
                </div>

                <div className="flex items-center">
                  <div className="w-32 text-gray-500">Check-in Date</div>
                  <div className="w-4 text-gray-500">:</div>
                  <div className="flex-1 text-gray-700">
                    {booking.checkInDate ? new Date(booking.checkInDate).toLocaleDateString() : 'N/A'}
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-32 text-gray-500">Check-out Date</div>
                  <div className="w-4 text-gray-500">:</div>
                  <div className="flex-1 text-gray-700">
                    {booking.checkOutDate ? new Date(booking.checkOutDate).toLocaleDateString() : 'N/A'}
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-32 text-gray-500">Booking Date</div>
                  <div className="w-4 text-gray-500">:</div>
                  <div className="flex-1 text-gray-700">{new Date(booking.createdAt).toLocaleDateString()}</div>
                </div>

                <div className="flex items-center">
                  <div className="w-32 text-gray-500">No. of Rooms</div>
                  <div className="w-4 text-gray-500">:</div>
                  <div className="flex-1 text-gray-700">{booking.noOfRooms}</div>
                </div>

                <div className="flex items-center">
                  <div className="w-32 text-gray-500">Guests</div>
                  <div className="w-4 text-gray-500">:</div>
                  <div className="flex-1 text-gray-700">
                    Adults: {booking.noOfGuests?.adults || 0}, Children: {booking.noOfGuests?.children || 0}
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-32 text-gray-500">Total Price</div>
                  <div className="w-4 text-gray-500">:</div>
                  <div className="flex-1 text-gray-700">₹{booking.totalPrice?.toLocaleString() || 0}</div>
                </div>

                <div className="flex items-center">
                  <div className="w-32 text-gray-500">Payment Status</div>
                  <div className="w-4 text-gray-500">:</div>
                  <div className="flex-1 text-gray-700">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      booking.paymentStatus === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : booking.paymentStatus === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {booking.paymentStatus}
                    </span>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-32 text-gray-500">Status</div>
                  <div className="w-4 text-gray-500">:</div>
                  <div className="flex-1 text-gray-700">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : booking.status === 'completed'
                        ? 'bg-blue-100 text-blue-800'
                        : booking.status === 'canceled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.status || 'pending'}
                    </span>
                  </div>
                </div>

                {booking.specialRequest && (
                  <div className="flex items-start">
                    <div className="w-32 text-gray-500">Special Request</div>
                    <div className="w-4 text-gray-500">:</div>
                    <div className="flex-1 text-gray-700">{booking.specialRequest}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Booking Summary Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between mb-8">
              <div className="mb-4 md:mb-0">
                <div className="flex items-center mb-4">
                  <Image
                          src="/hotel-patliputra-logo.png"
                          alt="Hotel Patliputra Continental Logo"
                    width={120}
                    height={60}
                    className="mr-2"
                  />
                </div>
                <div className="text-gray-700 text-sm">
                  <div className="font-semibold mb-2">BOOKING DETAILS:</div>
                  <div className="font-medium">{booking.fullName}</div>
                  <div>Phone: {booking.phone}</div>
                  <div>Email: {booking.email}</div>
                  <div>Payment Status: {booking.paymentStatus}</div>
                  <div>Status: {booking.status || 'pending'}</div>
                  <div>Total Price: ₹{booking.totalPrice?.toLocaleString() || 0}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-gold text-xl font-semibold mb-4">
                  Booking ID: {booking.bookingId}
                </div>
                <div className="text-sm text-gray-700">
                  <div>Booking Date: {new Date(booking.createdAt).toLocaleDateString()}</div>
                  <div>Check-in: {booking.checkInDate ? new Date(booking.checkInDate).toLocaleDateString() : 'N/A'}</div>
                  <div>Check-out: {booking.checkOutDate ? new Date(booking.checkOutDate).toLocaleDateString() : 'N/A'}</div>
                  <div>Rooms: {booking.noOfRooms} | Guests: {booking.noOfGuests?.adults || 0} Adults, {booking.noOfGuests?.children || 0} Children</div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center text-xs text-gray-500">
              <div className="mb-1">AIIMS Road, Walmi, Patna Pin-801505</div>
              <div className="mb-1">
                Email:reservations@theroyalbihar.com|PAN : AAJCR9703K | GSTIN : 10AAJCR9703K1ZA | SAC CODE : 996311
              </div>
              <div>This booking confirmation was generated automatically.</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
