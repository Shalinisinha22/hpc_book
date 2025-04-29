"use client"

import { useState } from "react"
import { Eye, Printer, FileSpreadsheet, FileText, Info } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { Pagination } from "@/components/pagination"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function MembersPage() {
  // Search state
  const [searchQuery, setSearchQuery] = useState("")

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Filter members based on search query
  const filteredMembers = membersData.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.phone.includes(searchQuery),
  )

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage)

  // Get current page data
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredMembers.slice(startIndex, endIndex)
  }

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - hidden on mobile */}
      <Sidebar className="hidden md:flex" activeItem="Members" />

      {/* Main Content */}
      <div className="flex-1">
        <PageHeader />

        <main className="p-4 md:p-6">
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">Members List</h1>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-5 w-5 text-orange-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-80">
                      Below is a list of the people who have signed up as a member in the system to make the bookings.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Below is a list of the people who have signed up as a member in the system to make the bookings. You can
              search for the members and can print the below list also.
            </p>
          </div>

          <Card className="bg-white shadow-sm border-gray-200 overflow-hidden">
            <div className="p-4 flex flex-wrap justify-between items-center border-b border-gray-200">
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="text-gray-700">
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button variant="outline" size="sm" className="text-gray-700">
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Excel
                </Button>
                <Button variant="outline" size="sm" className="text-gray-700">
                  <FileText className="h-4 w-4 mr-2" />
                  PDF
                </Button>
              </div>
              <div className="mt-2 sm:mt-0">
                <div className="flex items-center">
                  <span className="mr-2 text-sm text-gray-500">Search:</span>
                  <Input
                    type="search"
                    placeholder="Search members..."
                    className="w-48 md:w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-4 py-3 w-10">
                      <Checkbox />
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {getCurrentPageData().map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <Checkbox />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="mr-2">{member.id}</span>
                          <Eye className="h-4 w-4 text-gray-400" />
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{member.name}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{member.email}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{member.phone}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{member.points}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{member.joinDate}</td>
                    </tr>
                  ))}

                  {getCurrentPageData().length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                        No members found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-4 py-3 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between">
              <div className="text-sm text-gray-700 mb-2 sm:mb-0">
                Showing {filteredMembers.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredMembers.length)} of {filteredMembers.length} entries
              </div>

              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>
          </Card>
        </main>
      </div>
    </div>
  )
}

const membersData = [
  {
    id: "23",
    name: "Mr. Rohit",
    email: "rkrao073@gmail.com",
    phone: "7758399390",
    points: "0",
    joinDate: "17-04-2025",
  },
  {
    id: "22",
    name: "Prof. R. Shilpa",
    email: "shilpamangla@gmail.com",
    phone: "9949461015",
    points: "0",
    joinDate: "15-02-2025",
  },
  {
    id: "21",
    name: "Mr. Santhosh Kumar",
    email: "joysontaac@gmail.com",
    phone: "9994583713",
    points: "0",
    joinDate: "03-12-2024",
  },
  {
    id: "20",
    name: "Mr. Manju",
    email: "manjujy@yahoo.com",
    phone: "7899302201",
    points: "0",
    joinDate: "30-11-2024",
  },
  {
    id: "19",
    name: "Dr. Molezitze lusto cons",
    email: "rykaassimo@mailinator.com",
    phone: "9797979797",
    points: "0",
    joinDate: "26-11-2024",
  },
  {
    id: "18",
    name: "Mr. Prashant",
    email: "pk1093524@gmail.com",
    phone: "6204709038",
    points: "0",
    joinDate: "25-11-2024",
  },
  {
    id: "17",
    name: "Mr. Uttam",
    email: "uttam931554@gmail.com",
    phone: "7002793497",
    points: "0",
    joinDate: "24-11-2024",
  },
  {
    id: "16",
    name: "Dr. Sunil",
    email: "drsunilbidawat@gmail.com",
    phone: "9892941554",
    points: "0",
    joinDate: "24-11-2024",
  },
  {
    id: "15",
    name: "Mr. Amit",
    email: "amit032016@outlook.com",
    phone: "9810208101",
    points: "0",
    joinDate: "13-11-2024",
  },
  {
    id: "14",
    name: "Mr. Suresh",
    email: "sureshir09@gmail.com",
    phone: "9844068925",
    points: "0",
    joinDate: "08-11-2024",
  },
  {
    id: "13",
    name: "Mrs. Priya Sharma",
    email: "priya.sharma@gmail.com",
    phone: "9876543210",
    points: "0",
    joinDate: "05-11-2024",
  },
  {
    id: "12",
    name: "Mr. Rajesh Kumar",
    email: "rajesh.kumar@hotmail.com",
    phone: "8765432109",
    points: "0",
    joinDate: "01-11-2024",
  },
  {
    id: "11",
    name: "Dr. Ananya Patel",
    email: "ananya.patel@doctor.com",
    phone: "7654321098",
    points: "0",
    joinDate: "28-10-2024",
  },
  {
    id: "10",
    name: "Mr. Vikram Singh",
    email: "vikram.singh@yahoo.com",
    phone: "6543210987",
    points: "0",
    joinDate: "25-10-2024",
  },
  {
    id: "9",
    name: "Mrs. Neha Gupta",
    email: "neha.gupta@gmail.com",
    phone: "9876123450",
    points: "0",
    joinDate: "20-10-2024",
  },
  {
    id: "8",
    name: "Mr. Arun Joshi",
    email: "arun.joshi@outlook.com",
    phone: "8765123490",
    points: "0",
    joinDate: "15-10-2024",
  },
  {
    id: "7",
    name: "Prof. Meera Desai",
    email: "meera.desai@university.edu",
    phone: "7654123980",
    points: "0",
    joinDate: "10-10-2024",
  },
  {
    id: "6",
    name: "Mr. Karthik Reddy",
    email: "karthik.reddy@gmail.com",
    phone: "6543129870",
    points: "0",
    joinDate: "05-10-2024",
  },
  {
    id: "5",
    name: "Dr. Sanjay Mehta",
    email: "sanjay.mehta@hospital.org",
    phone: "9876543211",
    points: "0",
    joinDate: "01-10-2024",
  },
  {
    id: "4",
    name: "Mrs. Anjali Verma",
    email: "anjali.verma@yahoo.com",
    phone: "8765432112",
    points: "0",
    joinDate: "25-09-2024",
  },
  {
    id: "3",
    name: "Mr. Deepak Sharma",
    email: "deepak.sharma@gmail.com",
    phone: "7654321123",
    points: "0",
    joinDate: "20-09-2024",
  },
  {
    id: "2",
    name: "Prof. Sunita Rao",
    email: "sunita.rao@college.edu",
    phone: "6543211234",
    points: "0",
    joinDate: "15-09-2024",
  },
  {
    id: "1",
    name: "Mr. Harish Patel",
    email: "harish.patel@outlook.com",
    phone: "9876543212",
    points: "0",
    joinDate: "10-09-2024",
  },
]
