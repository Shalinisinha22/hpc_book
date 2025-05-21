"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuthStore } from "@/lib/auth-store"
import { PERMISSIONS } from "@/lib/permissions"
import { Clock, Plus, Calendar, CheckCircle, XCircle, Filter, Download, Users, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function StaffLeavePage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("pending")
  const [leaveRequests, setLeaveRequests] = useState(initialLeaveRequests)
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false)
  const [filterDepartment, setFilterDepartment] = useState("all")
  const [filterLeaveType, setFilterLeaveType] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const { hasPermission } = useAuthStore()
  const canManageLeave = hasPermission(PERMISSIONS.STAFF_LEAVE_MANAGE)

  // Calculate statistics
  const pendingCount = leaveRequests.filter((req) => req.status === "pending").length
  const approvedCount = leaveRequests.filter((req) => req.status === "approved").length
  const rejectedCount = leaveRequests.filter((req) => req.status === "rejected").length

  // Handle status change
  const handleStatusChange = (id, newStatus) => {
    setLeaveRequests((prev) => prev.map((req) => (req.id === id ? { ...req, status: newStatus } : req)))

    toast({
      title: `Request ${newStatus}`,
      description: `Leave request has been ${newStatus} successfully.`,
      variant: newStatus === "approved" ? "default" : "destructive",
    })
  }

  // Handle new leave request submission
  const handleNewLeaveSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)

    const newRequest = {
      id: (leaveRequests.length + 1).toString(),
      employeeName: formData.get("employeeName"),
      department: formData.get("department"),
      leaveType: formData.get("leaveType"),
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate"),
      reason: formData.get("reason"),
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    setLeaveRequests((prev) => [newRequest, ...prev])
    setIsNewRequestOpen(false)

    toast({
      title: "Leave request submitted",
      description: "Your leave request has been submitted successfully.",
    })
  }

  // Filter requests based on active tab, department, leave type, and search query
  const filteredRequests = leaveRequests
    .filter((req) => (activeTab === "all" ? true : req.status === activeTab))
    .filter((req) => (filterDepartment === "all" ? true : req.department === filterDepartment))
    .filter((req) => (filterLeaveType === "all" ? true : req.leaveType === filterLeaveType))
    .filter((req) =>
      searchQuery === ""
        ? true
        : req.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          req.reason.toLowerCase().includes(searchQuery.toLowerCase()),
    )

  return (
    <div className="p-6 space-y-6">
      <PageHeader heading="Staff Leave Management" text="View and manage staff leave requests">
        <Button className="flex items-center gap-2" onClick={() => setIsNewRequestOpen(true)}>
          <Plus size={16} />
          <span>New Request</span>
        </Button>
      </PageHeader>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Requests</CardDescription>
            <CardTitle className="text-2xl">{leaveRequests.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="mr-1 h-4 w-4" />
              <span>All staff leave requests</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending</CardDescription>
            <CardTitle className="text-2xl text-yellow-600">{pendingCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="mr-1 h-4 w-4" />
              <span>Awaiting approval</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Approved</CardDescription>
            <CardTitle className="text-2xl text-green-600">{approvedCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-muted-foreground">
              <CheckCircle className="mr-1 h-4 w-4" />
              <span>Approved requests</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Rejected</CardDescription>
            <CardTitle className="text-2xl text-red-600">{rejectedCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-muted-foreground">
              <XCircle className="mr-1 h-4 w-4" />
              <span>Rejected requests</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex-1">
              <Label htmlFor="search" className="sr-only">
                Search
              </Label>
              <Input
                id="search"
                placeholder="Search by name or reason..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <div className="w-full sm:w-40">
                <Label htmlFor="department-filter" className="sr-only">
                  Department
                </Label>
                <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                  <SelectTrigger id="department-filter">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="Front Office">Front Office</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                    <SelectItem value="Banquet Service">Banquet Service</SelectItem>
                    <SelectItem value="Accounts">Accounts</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full sm:w-40">
                <Label htmlFor="leave-type-filter" className="sr-only">
                  Leave Type
                </Label>
                <Select value={filterLeaveType} onValueChange={setFilterLeaveType}>
                  <SelectTrigger id="leave-type-filter">
                    <SelectValue placeholder="Leave Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                    <SelectItem value="Annual Leave">Annual Leave</SelectItem>
                    <SelectItem value="Personal Leave">Personal Leave</SelectItem>
                    <SelectItem value="Maternity Leave">Maternity Leave</SelectItem>
                    <SelectItem value="Paternity Leave">Paternity Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="outline"
                className="flex items-center gap-1"
                onClick={() => {
                  setFilterDepartment("all")
                  setFilterLeaveType("all")
                  setSearchQuery("")
                }}
              >
                <Filter size={16} />
                <span>Reset</span>
              </Button>

              <Button
                variant="outline"
                className="flex items-center gap-1"
                onClick={() => {
                  toast({
                    title: "Report downloaded",
                    description: "Leave requests report has been downloaded successfully.",
                  })
                }}
              >
                <Download size={16} />
                <span>Export</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs and Leave Requests List */}
      <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="pending">
            Pending
            {pendingCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-800">
                {pendingCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved
            {approvedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs bg-green-100 text-green-800">
                {approvedCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected
            {rejectedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs bg-red-100 text-red-800">{rejectedCount}</span>
            )}
          </TabsTrigger>
          <TabsTrigger value="all">All Requests</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredRequests.length === 0 ? (
            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No leave requests found</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {searchQuery || filterDepartment !== "all" || filterLeaveType !== "all"
                    ? "Try adjusting your filters to see more results."
                    : "There are no leave requests in this category."}
                </p>
                {(searchQuery || filterDepartment !== "all" || filterLeaveType !== "all") && (
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setFilterDepartment("all")
                      setFilterLeaveType("all")
                      setSearchQuery("")
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredRequests.map((request) => (
              <Card key={request.id} className="overflow-hidden">
                <CardHeader className="pb-2 bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{request.employeeName}</CardTitle>
                      <CardDescription>
                        {request.department} • {request.leaveType}
                      </CardDescription>
                    </div>
                    <LeaveStatusBadge status={request.status} />
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <Calendar size={16} />
                        <span>
                          {new Date(request.startDate).toLocaleDateString()} to{" "}
                          {new Date(request.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-sm">{request.reason}</div>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      {request.status === "pending" && canManageLeave && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={() => handleStatusChange(request.id, "rejected")}
                          >
                            <XCircle size={16} />
                            <span>Reject</span>
                          </Button>
                          <Button
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={() => handleStatusChange(request.id, "approved")}
                          >
                            <CheckCircle size={16} />
                            <span>Approve</span>
                          </Button>
                        </>
                      )}
                      {request.status === "approved" && (
                        <span className="text-sm text-green-600 flex items-center">
                          <CheckCircle size={16} className="mr-1" />
                          Approved on {new Date().toLocaleDateString()}
                        </span>
                      )}
                      {request.status === "rejected" && (
                        <span className="text-sm text-red-600 flex items-center">
                          <XCircle size={16} className="mr-1" />
                          Rejected on {new Date().toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 text-xs text-gray-500">
                  Request ID: {request.id} • Created: {new Date(request.createdAt || Date.now()).toLocaleString()}
                </CardFooter>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* New Leave Request Dialog */}
      <Dialog open={isNewRequestOpen} onOpenChange={setIsNewRequestOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>New Leave Request</DialogTitle>
            <DialogDescription>Fill out the form below to submit a new leave request.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleNewLeaveSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="employeeName">Employee Name</Label>
                  <Input id="employeeName" name="employeeName" placeholder="Enter employee name" required />
                </div>

                <div>
                  <Label htmlFor="department">Department</Label>
                  <Select name="department" defaultValue="Front Office" required>
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Front Office">Front Office</SelectItem>
                      <SelectItem value="HR">HR</SelectItem>
                      <SelectItem value="Banquet Service">Banquet Service</SelectItem>
                      <SelectItem value="Accounts">Accounts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="leaveType">Leave Type</Label>
                  <Select name="leaveType" defaultValue="Sick Leave" required>
                    <SelectTrigger id="leaveType">
                      <SelectValue placeholder="Select leave type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                      <SelectItem value="Annual Leave">Annual Leave</SelectItem>
                      <SelectItem value="Personal Leave">Personal Leave</SelectItem>
                      <SelectItem value="Maternity Leave">Maternity Leave</SelectItem>
                      <SelectItem value="Paternity Leave">Paternity Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input id="startDate" name="startDate" type="date" required />
                </div>

                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input id="endDate" name="endDate" type="date" required />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="reason">Reason</Label>
                  <Textarea id="reason" name="reason" placeholder="Enter reason for leave" required />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsNewRequestOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Submit Request</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Sample leave requests data
const initialLeaveRequests = [
  {
    id: "1",
    employeeName: "John Smith",
    department: "Front Office",
    leaveType: "Sick Leave",
    startDate: "2023-05-15",
    endDate: "2023-05-17",
    reason: "Medical appointment and recovery",
    status: "pending",
    createdAt: "2023-05-10T09:30:00Z",
  },
  {
    id: "2",
    employeeName: "Sarah Johnson",
    department: "HR",
    leaveType: "Annual Leave",
    startDate: "2023-06-10",
    endDate: "2023-06-20",
    reason: "Family vacation",
    status: "approved",
    createdAt: "2023-05-20T14:15:00Z",
  },
  {
    id: "3",
    employeeName: "Michael Brown",
    department: "Banquet Service",
    leaveType: "Personal Leave",
    startDate: "2023-05-25",
    endDate: "2023-05-26",
    reason: "Family emergency",
    status: "rejected",
    createdAt: "2023-05-22T11:45:00Z",
  },
  {
    id: "4",
    employeeName: "Emily Davis",
    department: "Accounts",
    leaveType: "Sick Leave",
    startDate: "2023-05-18",
    endDate: "2023-05-19",
    reason: "Not feeling well",
    status: "pending",
    createdAt: "2023-05-17T08:20:00Z",
  },
  {
    id: "5",
    employeeName: "Robert Wilson",
    department: "HR",
    leaveType: "Annual Leave",
    startDate: "2023-07-05",
    endDate: "2023-07-15",
    reason: "Summer vacation",
    status: "pending",
    createdAt: "2023-06-01T10:00:00Z",
  },
  {
    id: "6",
    employeeName: "Jennifer Lee",
    department: "Front Office",
    leaveType: "Maternity Leave",
    startDate: "2023-08-01",
    endDate: "2023-11-01",
    reason: "Maternity leave",
    status: "approved",
    createdAt: "2023-06-15T09:30:00Z",
  },
  {
    id: "7",
    employeeName: "David Martinez",
    department: "Banquet Service",
    leaveType: "Personal Leave",
    startDate: "2023-06-05",
    endDate: "2023-06-07",
    reason: "Wedding attendance",
    status: "approved",
    createdAt: "2023-05-25T16:45:00Z",
  },
  {
    id: "8",
    employeeName: "Lisa Thompson",
    department: "Accounts",
    leaveType: "Sick Leave",
    startDate: "2023-05-30",
    endDate: "2023-06-02",
    reason: "Flu recovery",
    status: "rejected",
    createdAt: "2023-05-29T08:15:00Z",
  },
]

function LeaveStatusBadge({ status }) {
  const getStatusStyles = () => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyles()}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </div>
  )
}
