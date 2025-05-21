"use client"

import { useState } from "react"
import { Info, Pencil, Trash2, Tag } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { Pagination } from "@/components/pagination"
import Image from "next/image"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
import { AddOfferForm } from "@/components/add-offer-form"

interface Offer {
  id: number
  name: string
  rateCode: string
  shortIntro: string
  description: string
  terms: string
  emailText: string
  imageUrl: string
}

export default function OffersPage() {
  const { toast } = useToast()

  // Offers state
  const [offers, setOffers] = useState<Offer[]>([
    {
      id: 1,
      name: "Weekend Offer",
      rateCode: "WO",
      shortIntro: "Now avail 30% off on weekend stays!",
      description:
        '<p><span style="font-family: Arial, sans-serif;">Enjoy a relaxing weekend getaway with our special weekend offer. Book now and save 30% on your stay.</span></p>',
      terms:
        '<p><span style="font-family: Arial, sans-serif;">Valid for Friday, Saturday, and Sunday nights. Subject to availability.</span></p>',
      emailText: "<p>Thank you for booking our Weekend Special Offer! We look forward to welcoming you.</p>",
      imageUrl: "/weekend-offer.png",
    },
    {
      id: 2,
      name: "Early Bird Offer",
      rateCode: "EBO",
      shortIntro: "The early bird gets the discount!",
      description:
        '<p><span style="font-family: Arial, sans-serif;">Book at least 30 days in advance and enjoy 25% off on your stay.</span></p>',
      terms:
        '<p><span style="font-family: Arial, sans-serif;">Must be booked at least 30 days in advance. Non-refundable.</span></p>',
      emailText: "<p>Thank you for booking our Early Bird Offer! We look forward to welcoming you.</p>",
      imageUrl: "/early-bird-offer.png",
    },
    {
      id: 3,
      name: "Midweek Offer",
      rateCode: "MO",
      shortIntro: "Beat the midweek blues with our special rates!",
      description:
        '<p><span style="font-family: Arial, sans-serif;">Enjoy special rates on Monday through Thursday stays.</span></p>',
      terms:
        '<p><span style="font-family: Arial, sans-serif;">Valid for Monday through Thursday nights. Subject to availability.</span></p>',
      emailText: "<p>Thank you for booking our Midweek Special Offer! We look forward to welcoming you.</p>",
      imageUrl: "/midweek-offer.png",
    },
    {
      id: 4,
      name: "Family Package",
      rateCode: "FP",
      shortIntro: "Perfect for family vacations!",
      description:
        '<p><span style="font-family: Arial, sans-serif;">Includes breakfast for the whole family and special activities for children.</span></p>',
      terms:
        '<p><span style="font-family: Arial, sans-serif;">Valid for families with children under 12. Subject to availability.</span></p>',
      emailText: "<p>Thank you for booking our Family Package! We look forward to welcoming your family.</p>",
      imageUrl: "/family-package.png",
    },
    {
      id: 5,
      name: "Honeymoon Package",
      rateCode: "HP",
      shortIntro: "Start your journey together with us!",
      description:
        '<p><span style="font-family: Arial, sans-serif;">Includes champagne, romantic dinner, and spa treatment for couples.</span></p>',
      terms:
        '<p><span style="font-family: Arial, sans-serif;">Valid for newly married couples within 6 months of marriage. ID proof required.</span></p>',
      emailText: "<p>Thank you for booking our Honeymoon Package! We look forward to making your stay special.</p>",
      imageUrl: "/honeymoon-package.png",
    },
    {
      id: 6,
      name: "Business Traveler",
      rateCode: "BT",
      shortIntro: "For the busy professional on the go!",
      description:
        '<p><span style="font-family: Arial, sans-serif;">Includes high-speed internet, breakfast, and late checkout.</span></p>',
      terms:
        '<p><span style="font-family: Arial, sans-serif;">Valid for business travelers. Corporate ID may be required.</span></p>',
      emailText: "<p>Thank you for booking our Business Traveler Package! We look forward to serving you.</p>",
      imageUrl: "/business-traveler.png",
    },
  ])

  // Add/Edit offer dialog state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [currentOffer, setCurrentOffer] = useState<Offer | null>(null)

  // Delete confirmation dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [offerToDelete, setOfferToDelete] = useState<number | null>(null)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const totalPages = Math.ceil(offers.length / itemsPerPage)

  // Get current page data
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return offers.slice(startIndex, endIndex)
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Handle add new offer
  const handleAddOffer = () => {
    setCurrentOffer(null)
    setIsAddDialogOpen(true)
  }

  // Handle save offer
  const handleSaveOffer = (offer: Omit<Offer, "id">) => {
    if (currentOffer) {
      // Update existing offer
      const updatedOffers = offers.map((o) => (o.id === currentOffer.id ? { ...offer, id: currentOffer.id } : o))
      setOffers(updatedOffers)
      toast({
        title: "Offer updated",
        description: `${offer.name} has been updated successfully.`,
      })
    } else {
      // Add new offer
      const newOffer = {
        ...offer,
        id: offers.length > 0 ? Math.max(...offers.map((o) => o.id)) + 1 : 1,
      }
      setOffers([...offers, newOffer])
      toast({
        title: "Offer added",
        description: `${offer.name} has been added successfully.`,
      })
    }
    setIsAddDialogOpen(false)
  }

  // Handle delete button click
  const handleDelete = (id: number) => {
    setOfferToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  // Confirm delete
  const confirmDelete = () => {
    if (offerToDelete !== null) {
      const updatedOffers = offers.filter((offer) => offer.id !== offerToDelete)
      setOffers(updatedOffers)

      toast({
        title: "Offer deleted",
        description: "The offer has been deleted successfully.",
      })
    }
    setIsDeleteDialogOpen(false)
    setOfferToDelete(null)
  }

  // Handle download
  const handleDownload = (offer: Offer) => {
    // In a real app, this would generate a PDF or other document
    toast({
      title: "Download started",
      description: `Downloading ${offer.name} details.`,
    })
  }

  // Handle edit
  const handleEdit = (offer: Offer) => {
    setCurrentOffer(offer)
    setIsAddDialogOpen(true)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - hidden on mobile */}
      <Sidebar className="hidden md:flex" activeItem="Special Offers" />

      {/* Main Content */}
      <div className="flex-1">
        <PageHeader />

        <main className="p-4 md:p-6">
          <div className="bg-gold p-4 md:p-6 rounded-t-lg flex justify-between items-center">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">Manage Offers</h1>
              <div className="flex items-start mt-2 text-white">
                <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm">
                  You can manage different types of special offers, just click on the 'Add offer' button and fill in the
                  form.
                </p>
              </div>
            </div>
            <Button className="bg-white text-gold hover:bg-gray-100" onClick={handleAddOffer}>
              <Tag className="h-4 w-4 mr-2" />
              Add Offer
            </Button>
          </div>

          <Card className="border-t-0 rounded-t-none">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Offers</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Offer Name</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Offer Rate Code
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Short Intro
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Terms</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {getCurrentPageData().map((offer, index) => (
                    <tr key={offer.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="px-4 py-4">
                        <div className="h-16 w-16 relative rounded-full overflow-hidden">
                          <Image
                            src={offer.imageUrl || "/placeholder.svg"}
                            alt={offer.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{offer.name}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{offer.rateCode}</td>
                      <td className="px-4 py-4 text-sm text-gray-700 max-w-[200px] truncate">{offer.shortIntro}</td>
                      <td className="px-4 py-4 text-sm text-gray-700 max-w-[200px] truncate">
                        <span dangerouslySetInnerHTML={{ __html: offer.description }} />
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700 max-w-[200px] truncate">
                        <span dangerouslySetInnerHTML={{ __html: offer.terms }} />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-blue-500"
                            onClick={() => handleEdit(offer)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500"
                            onClick={() => handleDelete(offer.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {getCurrentPageData().length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                        No offers found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {offers.length > 0 && (
              <div className="p-4 border-t border-gray-200">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
              </div>
            )}
          </Card>
        </main>
      </div>

      {/* Add/Edit Offer Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{currentOffer ? "Edit Offer" : "Add Offer"}</DialogTitle>
          </DialogHeader>
          <AddOfferForm offer={currentOffer} onSave={handleSaveOffer} onCancel={() => setIsAddDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the offer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
