"use client"

import React,{ useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Printer, Info, User, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"
import Image from "next/image"
import { Sidebar } from "@/components/sidebar"
import { API_ROUTES } from "@/config/api"
import { toast } from "@/components/ui/use-toast"

// Define the booking interface based on the API response
interface Booking {
  confirmation?: string;
  bookingId: string;
  fullName?: string;
  name?: string;
  email: string;
  phone?: string;
  contact?: string;
  bookingDate?: string;
  createdAt?: string;
  checkInDate?: string;
  checkOutDate?: string;
  noOfRooms?: number;
  noOfGuests?: { adults: number; children: number };
  paymentStatus: string;
  status: string;
  totalPrice?: number;
  specialRequest?: string;
}

export default function BookingDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { id } = params;
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch booking details from API
  const fetchBookingDetails = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("auth-token")
      if (!token) {
        throw new Error("Not authenticated")
      }

      const response = await fetch(`${API_ROUTES.bookings.bookingDetails}/${id}`, {
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
        status: "unknown",
        checkInDate: undefined,
        checkOutDate: undefined,
        noOfRooms: 0,
        noOfGuests: { adults: 0, children: 0 },
        totalPrice: 0,
        specialRequest: "",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookingDetails()
  }, [id])

  // Print handler for receipt
  const handlePrintReceipt = () => {
    const style = document.createElement("style")
    style.innerHTML = `
      @media print {
        body * { visibility: hidden !important; }
        .print-receipt, .print-receipt * { visibility: visible !important; }
        .print-receipt { position: absolute; left: 0; top: 0; width: 100vw; background: #fff; padding: 32px 24px; min-height: 100vh; }
        .no-print { display: none !important; }
        @page { size: A4; margin: 18mm 12mm; }
        .receipt-header { border-bottom: 2px solid #e5e7eb; margin-bottom: 24px; padding-bottom: 16px; }
        .receipt-logo { margin-bottom: 8px; }
        .receipt-title { font-size: 1.5rem; font-weight: 700; margin-bottom: 4px; }
        .receipt-address { font-size: 0.95rem; color: #555; margin-bottom: 2px; }
        .receipt-table { width: 100%; border-collapse: collapse; margin: 24px 0; }
        .receipt-table th, .receipt-table td { border: 1px solid #e5e7eb; padding: 8px 12px; font-size: 1rem; }
        .receipt-table th { background: #f3f4f6; font-weight: 600; }
        .receipt-footer { margin-top: 32px; font-size: 0.95rem; color: #888; text-align: center; }
      }
    `
    document.head.appendChild(style)
    const receiptSection = document.querySelector('.print-receipt')
    if (receiptSection) receiptSection.classList.add('print-receipt')
    window.print()
    setTimeout(() => {
      document.head.removeChild(style)
      if (receiptSection) receiptSection.classList.remove('print-receipt')
    }, 1000)
  }

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
        <PageHeader heading="Booking Details" />

        <main className="p-4 md:p-6 booking-details-content">
          {/* Show loading or error if booking is not loaded */}
          {!booking ? (
            <div className="flex flex-col items-center justify-center h-96">
              <div className="text-gray-500 text-lg mb-2">Booking not found or failed to load.</div>
              <div className="text-gray-400 text-sm">Please check the booking ID or try again later.</div>
            </div>
          ) : (
            <>
              {/* Professional Print Receipt Section */}
              <div className="receipt-section bg-white rounded-lg shadow-md p-8 mb-8 border border-gray-200 relative">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                  <div className="flex items-center mb-4 md:mb-0">
                    <Image
                      src="/hotel-patliputra-logo.png"
                      alt="Hotel Patliputra Continental Logo"
                      width={120}
                      height={60}
                      className="mr-4"
                    />
                    <div className="ml-2">
                      <div className="font-bold text-lg text-gray-900">Hotel Patliputra Continental</div>
                      <div className="text-gray-600 text-sm">AIIMS Road, Walmi, Patna Pin-801505</div>
                      <div className="text-gray-600 text-xs">Email: reservations@hpcpatna.com | PAN: AAJCR9703K | GSTIN: 10AAJCR9703K1ZA | SAC CODE: 996311</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-gold text-xl font-semibold">Booking Receipt</div>
                    <div className="text-xs text-gray-500">Date: {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : '-'}</div>
                    <div className="text-xs text-gray-500">Booking ID: {booking.bookingId || '-'}</div>
                  </div>
                </div>
                <hr className="my-4 border-gray-200" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <div className="font-semibold text-gray-800 mb-2">Guest Information</div>
                    <table className="w-full text-sm">
                      <tbody>
                        <tr>
                          <td className="py-1 pr-2 text-gray-600">Name</td>
                          <td className="py-1 font-medium text-gray-900">{booking.fullName || '-'}</td>
                        </tr>
                        <tr>
                          <td className="py-1 pr-2 text-gray-600">Phone</td>
                          <td className="py-1">{booking.phone || '-'}</td>
                        </tr>
                        <tr>
                          <td className="py-1 pr-2 text-gray-600">Email</td>
                          <td className="py-1">{booking.email || '-'}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 mb-2">Booking Information</div>
                    <table className="w-full text-sm">
                      <tbody>
                        <tr>
                          <td className="py-1 pr-2 text-gray-600">Check-in</td>
                          <td className="py-1">{booking.checkInDate ? new Date(booking.checkInDate).toLocaleDateString() : 'N/A'}</td>
                        </tr>
                        <tr>
                          <td className="py-1 pr-2 text-gray-600">Check-out</td>
                          <td className="py-1">{booking.checkOutDate ? new Date(booking.checkOutDate).toLocaleDateString() : 'N/A'}</td>
                        </tr>
                        <tr>
                          <td className="py-1 pr-2 text-gray-600">Rooms</td>
                          <td className="py-1">{booking.noOfRooms ?? '-'}</td>
                        </tr>
                        <tr>
                          <td className="py-1 pr-2 text-gray-600">Guests</td>
                          <td className="py-1">Adults: {booking.noOfGuests?.adults ?? 0}, Children: {booking.noOfGuests?.children ?? 0}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="font-semibold text-gray-800 mb-2">Payment Summary</div>
                  <table className="w-full text-sm">
                    <tbody>
                      <tr>
                        <td className="py-1 pr-2 text-gray-600">Total Price</td>
                        <td className="py-1 font-medium text-gray-900">₹{booking.totalPrice?.toLocaleString() ?? 0}</td>
                      </tr>
                      <tr>
                        <td className="py-1 pr-2 text-gray-600">Payment Status</td>
                        <td className="py-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            booking.paymentStatus === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : booking.paymentStatus === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {booking.paymentStatus || '-'}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1 pr-2 text-gray-600">Status</td>
                        <td className="py-1">
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
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {booking.specialRequest && (
                  <div className="mb-2">
                    <div className="font-semibold text-gray-800">Special Request</div>
                    <div className="text-gray-700 text-sm">{booking.specialRequest}</div>
                  </div>
                )}
                <div className="mt-6 text-xs text-gray-500 text-center">
                  This is a computer-generated receipt. For queries, contact reservations@hpcpatna.com
                </div>
                <Button
                  className="absolute top-4 right-4 print:hidden bg-gold hover:bg-gold-dark"
                  onClick={() => {
                    // Print only the receipt section
                    const style = document.createElement("style")
                    style.innerHTML = `
                      @media print {
                        body * { visibility: hidden !important; }
                        .receipt-section, .receipt-section * { visibility: visible !important; }
                        .receipt-section { position: absolute; left: 0; top: 0; width: 100vw; background: #fff; box-shadow: none; border: none; }
                        .print\\:hidden, .print\:hidden { display: none !important; }
                      }
                    `
                    document.head.appendChild(style)
                    window.print()
                    setTimeout(() => { document.head.removeChild(style) }, 1000)
                  }}
                >
                  <Printer className="mr-2 h-4 w-4" />
                  Print Receipt
                </Button>
              </div>

              {/* Booking Details & Guest Details (screen only, not in print) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 print:hidden">
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
                      <div className="flex-1 text-gray-700">{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : "-"}</div>
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

              {/* Booking Summary Section (screen only, not in print) */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6 print:hidden">
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
                      <div>Booking Date: {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : "-"}</div>
                      <div>Check-in: {booking.checkInDate ? new Date(booking.checkInDate).toLocaleDateString() : 'N/A'}</div>
                      <div>Check-out: {booking.checkOutDate ? new Date(booking.checkOutDate).toLocaleDateString() : 'N/A'}</div>
                      <div>Rooms: {booking.noOfRooms} | Guests: {booking.noOfGuests?.adults || 0} Adults, {booking.noOfGuests?.children || 0} Children</div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 text-center text-xs text-gray-500">
                  <div className="mb-1">AIIMS Road, Walmi, Patna Pin-801505</div>
                  <div className="mb-1">
                    Email:reservations@hpcpatna.com|PAN : AAJCR9703K | GSTIN : 10AAJCR9703K1ZA | SAC CODE : 996311
                  </div>
                  <div>This booking confirmation was generated automatically.</div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
