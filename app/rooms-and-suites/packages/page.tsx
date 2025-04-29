"use client"

import { useState } from "react"
import { Info, Pencil, Trash2, Plus } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { Pagination } from "@/components/pagination"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Package {
  id: number
  name: string
  rate: number
  description: string
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([
    {
      id: 1,
      name: "Best Flexible Rate with WiFi",
      rate: 0,
      description: "<strong>Rate Description</strong>",
    },
    {
      id: 2,
      name: "Weekend Getaway Package",
      rate: 2000,
      description: "<strong>Includes breakfast and dinner</strong>",
    },
    {
      id: 3,
      name: "Honeymoon Special",
      rate: 5000,
      description: "<strong>Includes spa treatment and candlelight dinner</strong>",
    },
    {
      id: 4,
      name: "Business Traveler",
      rate: 1500,
      description: "<strong>Includes workspace and high-speed internet</strong>",
    },
    {
      id: 5,
      name: "Family Package",
      rate: 3000,
      description: "<strong>Includes activities for children</strong>",
    },
  ])

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentPackage, setCurrentPackage] = useState<Package | null>(null)
  const [newPackage, setNewPackage] = useState<Partial<Package>>({
    name: "",
    rate: 0,
    description: "",
  })

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const totalPages = Math.ceil(packages.length / itemsPerPage)

  // Get current page data
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return packages.slice(startIndex, endIndex)
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleAddPackage = () => {
    if (!newPackage.name) {
      alert("Package name is required")
      return
    }

    const packageToAdd = {
      ...newPackage,
      id: packages.length > 0 ? Math.max(...packages.map((pkg) => pkg.id)) + 1 : 1,
    } as Package

    setPackages([...packages, packageToAdd])
    setNewPackage({
      name: "",
      rate: 0,
      description: "",
    })
    setIsAddDialogOpen(false)
  }

  const handleEditPackage = () => {
    if (!currentPackage || !currentPackage.name) {
      alert("Package name is required")
      return
    }

    const updatedPackages = packages.map((pkg) => (pkg.id === currentPackage.id ? currentPackage : pkg))

    setPackages(updatedPackages)
    setIsEditDialogOpen(false)
    setCurrentPackage(null)
  }

  const handleDeletePackage = () => {
    if (!currentPackage) return

    const updatedPackages = packages.filter((pkg) => pkg.id !== currentPackage.id)
    setPackages(updatedPackages)
    setIsDeleteDialogOpen(false)
    setCurrentPackage(null)
  }

  const openEditDialog = (pkg: Package) => {
    setCurrentPackage({ ...pkg })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (pkg: Package) => {
    setCurrentPackage({ ...pkg })
    setIsDeleteDialogOpen(true)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - hidden on mobile */}
      <Sidebar className="hidden md:flex" activeItem="Packages" />

      {/* Main Content */}
      <div className="flex-1">
        <PageHeader />

        <main className="p-4 md:p-6">
          <div className="bg-gold p-4 md:p-6 rounded-t-lg">
            <h1 className="text-xl md:text-2xl font-bold text-white">Manage Packages</h1>
            <div className="flex items-start mt-2 text-white">
              <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm">
                You can manage different packages and set custom prices for them. Just click on the 'Add package' button
                and fill in the form.
              </p>
            </div>
          </div>

          <Card className="border-t-0 rounded-t-none">
            <div className="p-4 md:p-6 flex justify-between items-center border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Packages</h2>
              <Button className="bg-gold hover:bg-gold-dark" onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Package
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Package Name
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {getCurrentPageData().map((pkg, index) => (
                    <tr key={pkg.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pkg.name}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                        {pkg.rate > 0 ? `₹${pkg.rate.toLocaleString("en-IN")}` : "0"}
                      </td>
                      <td
                        className="px-4 py-4 text-sm text-gray-700 max-w-xs truncate"
                        dangerouslySetInnerHTML={{ __html: pkg.description }}
                      />
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500"
                            onClick={() => openEditDialog(pkg)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500"
                            onClick={() => openDeleteDialog(pkg)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {getCurrentPageData().length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                        No packages found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Add pagination component */}
            {packages.length > 0 && (
              <div className="p-4 border-t border-gray-200">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
              </div>
            )}
          </Card>
        </main>
      </div>

      {/* Add Package Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Package</DialogTitle>
            <DialogDescription>Enter the details for the new package. Click save when you're done.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Package Name</Label>
              <Input
                id="name"
                value={newPackage.name}
                onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
                placeholder="Enter package name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="rate">Rate (₹)</Label>
              <Input
                id="rate"
                type="number"
                value={newPackage.rate}
                onChange={(e) => setNewPackage({ ...newPackage, rate: Number(e.target.value) })}
                placeholder="Enter rate"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newPackage.description}
                onChange={(e) => setNewPackage({ ...newPackage, description: e.target.value })}
                placeholder="Enter package description"
                className="min-h-[100px]"
              />
              <p className="text-xs text-gray-500">You can use HTML tags like &lt;strong&gt; for formatting.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-gold hover:bg-gold-dark" onClick={handleAddPackage}>
              Save Package
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Package Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Package</DialogTitle>
            <DialogDescription>Update the details for this package. Click save when you're done.</DialogDescription>
          </DialogHeader>
          {currentPackage && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Package Name</Label>
                <Input
                  id="edit-name"
                  value={currentPackage.name}
                  onChange={(e) => setCurrentPackage({ ...currentPackage, name: e.target.value })}
                  placeholder="Enter package name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-rate">Rate (₹)</Label>
                <Input
                  id="edit-rate"
                  type="number"
                  value={currentPackage.rate}
                  onChange={(e) => setCurrentPackage({ ...currentPackage, rate: Number(e.target.value) })}
                  placeholder="Enter rate"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={currentPackage.description}
                  onChange={(e) => setCurrentPackage({ ...currentPackage, description: e.target.value })}
                  placeholder="Enter package description"
                  className="min-h-[100px]"
                />
                <p className="text-xs text-gray-500">You can use HTML tags like &lt;strong&gt; for formatting.</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-gold hover:bg-gold-dark" onClick={handleEditPackage}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the package
              {currentPackage && <span className="font-medium"> "{currentPackage.name}"</span>}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDeletePackage}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
