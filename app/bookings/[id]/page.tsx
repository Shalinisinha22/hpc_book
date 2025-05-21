"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Printer, Info, User, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"
import Image from "next/image"
import { Sidebar } from "@/components/sidebar"

export default function BookingDetailsPage({ params }) {
  const router = useRouter()
  const { id } = params
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, you would fetch the booking data from an API
    // For now, we'll simulate this with a timeout and mock data
    const timer = setTimeout(() => {
      const mockBooking = bookingsData.find((b) => b.id === id) || defaultBooking
      setBooking(mockBooking)
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
                    <div className="text-gray-700">{booking.guest.name}</div>
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
                    <div className="text-gray-700">{booking.guest.email}</div>
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
                    <div className="text-gray-700">{booking.guest.phone}</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-8 text-gray-400">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-gray-500">:</div>
                  </div>
                  <div className="flex-[2]">
                    <div className="text-gray-700">{booking.guest.address}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stay Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Stay Details</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-32 text-gray-500">Check-in Date</div>
                  <div className="w-4 text-gray-500">:</div>
                  <div className="flex-1 text-gray-700">{booking.stay.checkIn}</div>
                </div>

                <div className="flex items-center">
                  <div className="w-32 text-gray-500">Check-Out Date</div>
                  <div className="w-4 text-gray-500">:</div>
                  <div className="flex-1 text-gray-700">{booking.stay.checkOut}</div>
                </div>

                <div className="flex items-center">
                  <div className="w-32 text-gray-500">Room Type</div>
                  <div className="w-4 text-gray-500">:</div>
                  <div className="flex-1 text-gray-700">{booking.stay.roomType}</div>
                </div>

                <div className="flex items-center">
                  <div className="w-32 text-gray-500">Number of Room(s)</div>
                  <div className="w-4 text-gray-500">:</div>
                  <div className="flex-1 text-gray-700">{booking.stay.numberOfRooms}</div>
                </div>

                <div className="flex items-center">
                  <div className="w-32 text-gray-500">Pax</div>
                  <div className="w-4 text-gray-500">:</div>
                  <div className="flex-1 text-gray-700">
                    Adult: {booking.stay.pax.adult}, Children: {booking.stay.pax.children}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-32 text-gray-500">Booking Date</div>
                  <div className="w-4 text-gray-500">:</div>
                  <div className="flex-1 text-gray-700">{booking.payment.bookingDate}</div>
                </div>

                <div className="flex items-center">
                  <div className="w-32 text-gray-500">Bill Amount</div>
                  <div className="w-4 text-gray-500">:</div>
                  <div className="flex-1 text-gray-700">{booking.payment.billAmount}</div>
                </div>

                <div className="flex items-center">
                  <div className="w-32 text-gray-500">Payment Method</div>
                  <div className="w-4 text-gray-500">:</div>
                  <div className="flex-1 text-gray-700">{booking.payment.method}</div>
                </div>

                <div className="flex items-center">
                  <div className="w-32 text-gray-500">Payment Status</div>
                  <div className="w-4 text-gray-500">:</div>
                  <div className="flex-1 text-gray-700">{booking.payment.status}</div>
                </div>

                <div className="flex items-center">
                  <div className="w-32 text-gray-500">Special Requests</div>
                  <div className="w-4 text-gray-500">:</div>
                  <div className="flex-1 text-gray-700">{booking.payment.specialRequests || "-"}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between mb-8">
              <div className="mb-4 md:mb-0">
                <div className="flex items-center mb-4">
                  <Image
                    src="/generic-indian-emblem.png"
                    alt="The Royal Bihar"
                    width={120}
                    height={60}
                    className="mr-2"
                  />
                </div>
                <div className="text-gray-700 text-sm">
                  <div className="font-semibold mb-2">INVOICE TO:</div>
                  <div className="font-medium">{booking.guest.name}</div>
                  <div>Address: {booking.guest.address}</div>
                  <div>Phone: +91 {booking.guest.phone}</div>
                  <div>Email: {booking.guest.email}</div>
                  <div>
                    Online Payment Status: {booking.payment.status} | {booking.payment.method}
                  </div>
                  <div>Confirm status: {booking.status}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-gold text-xl font-semibold mb-4">
                  Invoice No.:TRB / {booking.invoiceYear} / {booking.id}
                </div>
                <div className="text-sm text-gray-700">
                  <div>Booking Date: {booking.payment.bookingDate}</div>
                  <div>Check-In Date: {booking.stay.checkIn}</div>
                  <div>Check-Out Date: {booking.stay.checkOut}</div>
                  <div>Txn No.: {booking.payment.transactionNumber || "---"}</div>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-3 text-gray-600 text-sm font-medium">S. NO.</th>
                    <th className="p-3 text-gray-600 text-sm font-medium">ROOMS/SERVICES</th>
                    <th className="p-3 text-gray-600 text-sm font-medium">PAX</th>
                    <th className="p-3 text-gray-600 text-sm font-medium">PACKAGE/DESCRIPTION</th>
                    <th className="p-3 text-gray-600 text-sm font-medium">RATE</th>
                    <th className="p-3 text-gray-600 text-sm font-medium">AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 bg-orange-200 font-medium">01</td>
                    <td className="p-3 bg-orange-100">{booking.stay.roomType}</td>
                    <td className="p-3 bg-orange-100">
                      Adult: {booking.stay.pax.adult}, Children: {booking.stay.pax.children}
                    </td>
                    <td className="p-3 bg-gray-100">{booking.stay.package}</td>
                    <td className="p-3 bg-gray-100">₹ {booking.payment.rate} /-</td>
                    <td className="p-3 bg-orange-100">₹ {booking.payment.amount} /-</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-between items-start">
              <div className="text-gray-700 text-xl">Thank you!</div>
              <div className="text-right">
                <div className="flex justify-end mb-2">
                  <div className="w-32 text-gray-600 font-medium">SUBTOTAL</div>
                  <div className="w-32 text-right">₹{booking.payment.subtotal}</div>
                </div>
                <div className="flex justify-end mb-2">
                  <div className="w-32 text-gray-600 font-medium">TAX {booking.payment.taxRate}%</div>
                  <div className="w-32 text-right">₹ {booking.payment.taxAmount}</div>
                </div>
                <div className="flex justify-end pt-2 border-t border-gray-200">
                  <div className="w-32 text-gold font-semibold">GRAND TOTAL</div>
                  <div className="w-32 text-right text-gold font-semibold">₹{booking.payment.grandTotal}/-</div>
                </div>
              </div>
            </div>

            <div className="mt-8 border-l-4 border-gold pl-4 py-2 bg-gray-50">
              <div className="text-blue-600 font-medium mb-2">NOTICE | PAYMENT TERMS</div>
              <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-2">
                <li>
                  Reservation is subject to room availability and will be made on a first-come-first-served basis.
                </li>
                <li>
                  Payments to be made by Credit Card/ Debit Card/Cheque or Demand Draft in the name "THE ROYAL BIHAR."
                  are subject to realization.
                </li>
                <li>It is the Enrollee's responsibility to ensure applicable fees are paid.</li>
                <li>
                  Any payment received through this website will be treated as having been made by the Enrollee's even
                  though the same may have been made by some other person
                </li>
                <li>
                  When the online payment transaction has been successfully completed using credit/debit cards option,
                  funds will be deducted from the credit/debit card mentioned by the applicant and the payments will be
                  credited to "THE ROYAL BIHAR.".
                </li>
              </ol>
            </div>

            <div className="mt-8 text-center text-xs text-gray-500">
              <div className="mb-1">AIIMS Road, Walmi, Patna Pin-801505</div>
              <div className="mb-1">
                Email:reservations@theroyalbihar.com|PAN : AAJCR9703K | GSTIN : 10AAJCR9703K1ZA | SAC CODE : 996311
              </div>
              <div>Invoice was created on a computer and is valid without the signature and seal.</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

// Mock data for a default booking
const defaultBooking = {
  id: "8",
  invoiceYear: "2025-2026",
  status: "Pending",
  guest: {
    name: "Mr. asdf asdf",
    email: "asdf@asdf.dfg",
    phone: "2342342343",
    address: "asdfg",
  },
  stay: {
    checkIn: "22-04-2025",
    checkOut: "23-04-2025",
    roomType: "Premium Suite",
    numberOfRooms: "1",
    pax: {
      adult: "1",
      children: "0",
    },
    package: "Best Flexible Rate with WiFi",
  },
  payment: {
    bookingDate: "22-04-2025",
    billAmount: "21004",
    method: "razorpayPG",
    status: "In Progress",
    specialRequests: "",
    rate: "17,800",
    amount: "17,800",
    subtotal: "17,800.00",
    taxRate: "12",
    taxAmount: "3,204.00",
    grandTotal: "21,004.00",
    transactionNumber: "",
  },
}

// Mock data for bookings
const bookingsData = [
  {
    id: "TRB0081",
    invoiceYear: "2025-2026",
    status: "Pending",
    guest: {
      name: "Mr. asdf asdf",
      email: "asdf@asdf.dfg",
      phone: "2342342343",
      address: "asdfg",
    },
    stay: {
      checkIn: "22-04-2025",
      checkOut: "23-04-2025",
      roomType: "Premium Suite",
      numberOfRooms: "1",
      pax: {
        adult: "1",
        children: "0",
      },
      package: "Best Flexible Rate with WiFi",
    },
    payment: {
      bookingDate: "22-04-2025",
      billAmount: "21004",
      method: "razorpayPG",
      status: "In Progress",
      specialRequests: "",
      rate: "17,800",
      amount: "17,800",
      subtotal: "17,800.00",
      taxRate: "12",
      taxAmount: "3,204.00",
      grandTotal: "21,004.00",
      transactionNumber: "",
    },
  },
  // Add more mock bookings as needed
]
