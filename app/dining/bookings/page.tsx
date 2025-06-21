"use client";

import { useEffect, useState } from "react";
import { API_ROUTES } from "@/config/api";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/pagination";
import { ImagePlus } from "lucide-react";

interface Dining {
  _id: string;
  name: string;
}

interface DiningBooking {
  _id: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  dining: Dining;
  cdate: string;
}

export default function DiningBookingsPage() {
  const [bookings, setBookings] = useState<DiningBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setLoading(true);
    fetch(API_ROUTES.diningBookings,{
        headers:{
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("auth-token") || ""}`
        }
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch dining bookings");
        const data = await res.json();
        setBookings(data || []);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setBookings([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = bookings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(bookings.length / itemsPerPage);

  return (
    <div className="flex-1">
      <div className="flex flex-col gap-4 p-4 md:p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dining Bookings</h1>
          <p className="text-sm text-gray-500 mt-1">View and manage all dining booking requests.</p>
        </div>
      </div>
      <main className="p-4 md:p-6">
        <div className="rounded-lg border bg-white shadow-sm">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading...</div>
            ) : error ? (
              <div className="p-8 text-center text-red-500">{error}</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Time</th>
                    <th className="px-4 py-3">Guests</th>
                    <th className="px-4 py-3">Dining</th>
                    <th className="px-4 py-3">Requested At</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {currentItems.length > 0 ? (
                    currentItems.map((booking, index) => (
                      <tr key={booking._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">{indexOfFirstItem + index + 1}</td>
                        <td className="px-4 py-3 font-medium">{booking.name}</td>
                        <td className="px-4 py-3">{booking.phone}</td>
                        <td className="px-4 py-3">{booking.date ? new Date(booking.date).toLocaleDateString() : "-"}</td>
                        <td className="px-4 py-3">{booking.time}</td>
                        <td className="px-4 py-3">{booking.guests}</td>
                        <td className="px-4 py-3">{booking.dining?.name || "-"}</td>
                        <td className="px-4 py-3">{booking.cdate ? new Date(booking.cdate).toLocaleString() : "-"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-4 py-16 text-center text-gray-400">
                        <div className="flex flex-col items-center gap-2">
                          <ImagePlus className="w-10 h-10 mb-2 text-gray-300" />
                          <span className="text-lg font-semibold">No dining bookings found</span>
                          <span className="text-sm">No one has booked a dining yet.</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
          {bookings.length > itemsPerPage && (
            <div className="border-t bg-white p-4">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
