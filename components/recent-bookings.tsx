import { useEffect, useState } from "react"
import { API_ROUTES } from "@/config/api"

export function RecentBookings() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true)
      setError(null)
      try {
        const token = localStorage.getItem("auth-token")
        const response = await fetch(API_ROUTES.bookings.all, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        })
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || "Failed to fetch bookings")
        }
        const data = await response.json()
        console.log(data)
        // Support both {status, data} and array response
        let bookingsArr = Array.isArray(data) ? data : data.data || []
        setBookings(bookingsArr.slice(0, 5))
      } catch (err: any) {
        setError(err.message || "Failed to fetch bookings")
        setBookings([])
      } finally {
        setLoading(false)
      }
    }
    fetchBookings()
  }, [])

  return (
    <div className="overflow-x-auto">
      {loading ? (
        <div className="p-4 text-center text-gray-500">Loading recent bookings...</div>
      ) : error ? (
        <div className="p-4 text-center text-red-500">{error}</div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr key={booking.bookingId || booking.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.bookingId || booking.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.fullName || booking.guest || booking.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.roomName || booking.room || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.checkInDate ? new Date(booking.checkInDate).toLocaleDateString() : booking.checkIn || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.checkOutDate ? new Date(booking.checkOutDate).toLocaleDateString() : booking.checkOut || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      booking.status === "Confirmed" || booking.status === "confirmed"
                        ? "bg-green-100 text-green-800"
                        : booking.status === "Cancelled" || booking.status === "canceled"
                        ? "bg-red-100 text-red-800"
                        : booking.status === "Checked In" || booking.status === "checked-in"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {booking.status || "Pending"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.totalPrice ? `₹${booking.totalPrice.toLocaleString()}` : booking.amount || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
