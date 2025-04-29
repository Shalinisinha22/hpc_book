export function RecentBookings() {
  const bookings = [
    {
      id: "B-1234",
      guest: "Rahul Sharma",
      room: "Deluxe Suite",
      checkIn: "2023-04-15",
      checkOut: "2023-04-18",
      status: "Confirmed",
      amount: "₹33,750",
    },
    {
      id: "B-1235",
      guest: "Priya Patel",
      room: "Standard Room",
      checkIn: "2023-04-16",
      checkOut: "2023-04-19",
      status: "Cancelled",
      amount: "₹21,000",
    },
    {
      id: "B-1236",
      guest: "Vikram Singh",
      room: "Executive Suite",
      checkIn: "2023-04-17",
      checkOut: "2023-04-20",
      status: "Checked In",
      amount: "₹48,750",
    },
    {
      id: "B-1237",
      guest: "Anjali Gupta",
      room: "Family Room",
      checkIn: "2023-04-18",
      checkOut: "2023-04-22",
      status: "Confirmed",
      amount: "₹39,000",
    },
    {
      id: "B-1238",
      guest: "Arjun Malhotra",
      room: "Penthouse Suite",
      checkIn: "2023-04-20",
      checkOut: "2023-04-25",
      status: "Pending",
      amount: "₹90,000",
    },
  ]

  return (
    <div className="overflow-x-auto">
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
            <tr key={booking.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.guest}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.room}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.checkIn}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.checkOut}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    booking.status === "Confirmed"
                      ? "bg-green-100 text-green-800"
                      : booking.status === "Cancelled"
                        ? "bg-red-100 text-red-800"
                        : booking.status === "Checked In"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {booking.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
