"use client"

import { useState, useEffect } from "react"
import { API_ROUTES } from "@/config/api"
import { Info, Pencil, Trash2, Tag, Download } from "lucide-react"
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
import { uploadToCloudinary } from "@/config/cloudinary"
import { json } from "stream/consumers"

interface Offer {
  _id: string;
  offer_name: string;
  offer_rate_code: string;
  short_intro: string;
  desc: string;
  terms: string;
  email_text: string;
  status: string;
  cdate: string;
  image: {
    url: string;
    name: string;
    ext: string;
  };
}

export default function OffersPage() {
  const { toast } = useToast()
  const [offers, setOffers] = useState<Offer[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch offers
  const fetchOffers = async () => {
    try {
      const token = localStorage.getItem("auth-token")
      if (!token) throw new Error("Not authenticated")

      const response = await fetch(API_ROUTES.offers, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to fetch offers")
      }

      const data = await response.json()
      console.log("Fetched offers:", data)

      // if (!Array.isArray(data)) {
      //   throw new Error("Invalid response format")
      // }
      setOffers(data.data)
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to fetch offers",
        variant: "destructive",
      })
      // Set empty array on error
      setOffers([])
    } finally {
      setIsLoading(false)
    }
  }

  // Create new offer function
  const createOffer = async (formData: FormData) => {
    try {
      const token = localStorage.getItem("auth-token");
      if (!token) throw new Error("Not authenticated");

      // Handle image upload if there's a new file
      const imageFile = formData.get("image") as File;
      let imageData = null;

      if (imageFile && imageFile.size > 0) {
        try {
          const cloudinaryResponse = await uploadToCloudinary(imageFile, 'image');
          imageData = {
            url: cloudinaryResponse.secure_url,

            name: cloudinaryResponse.public_id,
            ext: cloudinaryResponse.format
          };
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          throw new Error("Failed to upload image");
        }
      }

      const response = await fetch(API_ROUTES.offers, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          offer_name: formData.get("offer_name") as string,
          offer_rate_code: formData.get("offer_rate_code") as string,
          short_intro: formData.get("short_intro") as string,
          desc: formData.get("desc") as string || '',
          terms: formData.get("terms") as string || '',
          email_text: formData.get("email_text") as string || '',
          status: "active",
          image: imageData
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create offer");
      }

      const data = await response.json();
      setOffers(prev => [...prev, data]);
      setIsAddDialogOpen(false);
      toast({ title: "Success", description: "Offer created successfully" });
      
    } catch (error) {
      console.error("Create offer error:", error);
      throw error;
    }
  };

  // Edit existing offer function
  const updateOffer = async (id: string, formData: FormData) => {
    try {
      const token = localStorage.getItem("auth-token");
      if (!token) throw new Error("Not authenticated");

      // Handle image upload if there's a new file
      const imageFile = formData.get("image") as File;
      let imageData = currentOffer?.image; 

      if (imageFile && imageFile.size > 0) {
        try {
          const cloudinaryResponse = await uploadToCloudinary(imageFile, 'image');
          imageData = {
            url: cloudinaryResponse.secure_url,
            name: cloudinaryResponse.public_id,
            ext: cloudinaryResponse.format
          };
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          throw new Error("Failed to upload image");
        }
      }

      const response = await fetch(`${API_ROUTES.offers}/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          offer_name: formData.get("offer_name") as string,
          offer_rate_code: formData.get("offer_rate_code") as string,
          short_intro: formData.get("short_intro") as string,
          desc: formData.get("desc") as string || '',
          terms: formData.get("terms") as string || '',
          email_text: formData.get("email_text") as string || '',
          status: "active",
          image: imageData
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update offer");
      }

      const data = await response.json();
      setOffers(prev => prev.map(offer => offer._id === id ? data : offer));
      setIsAddDialogOpen(false);
      toast({ title: "Success", description: "Offer updated successfully" });
      
    } catch (error) {
      console.error("Update offer error:", error);
      throw error;
    }
  };

  // Update the handleSaveOffer function to use these new functions
  const handleSaveOffer = async (formData: FormData) => {
    try {
      if (currentOffer) {
        await updateOffer(currentOffer._id, formData);
      } else {
        await createOffer(formData);
      }
      fetchOffers(); // Refresh the list after successful operation
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Operation failed",
        variant: "destructive",
      });
    }
  }

  // Load offers on mount
  useEffect(() => {
    fetchOffers()
  }, [])

  // Add/Edit offer dialog state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [currentOffer, setCurrentOffer] = useState<Offer | null>(null)

  // Delete confirmation dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [offerToDelete, setOfferToDelete] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const totalPages = Array.isArray(offers) ? Math.ceil(offers.length / itemsPerPage) : 0

  // Get current page data
  const getCurrentPageData = () => {
    if (!Array.isArray(offers)) {
      return []
    }
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

  // Handle delete button click
  const handleDelete = (id: string) => {
    setOfferToDelete(id);
    setIsDeleteDialogOpen(true);
  }

  // Confirm delete
  const confirmDelete = async () => {
    if (offerToDelete) {
      try {
        await deleteOffer(offerToDelete.toString());
        setIsDeleteDialogOpen(false);
        setOfferToDelete(null);
        fetchOffers(); // Refresh the list after deletion
      } catch (error) {
        console.error("Confirm delete error:", error);
      }
    }
  };

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
    console.log("Editing offer:", offer); // Add logging
    setCurrentOffer({
      ...offer,
      // Ensure all required fields are present
      offer_name: offer.offer_name || '',
      offer_rate_code: offer.offer_rate_code || '',
      short_intro: offer.short_intro || '',
      desc: offer.desc || '',
      terms: offer.terms || '',
      email_text: offer.email_text || '',
      status: offer.status || 'active',
      image: offer.image || null
    });
    setIsAddDialogOpen(true);
  }

  const deleteOffer = async (id: string) => {
    try {
      const token = localStorage.getItem("auth-token");
      if (!token) throw new Error("Not authenticated");

      const response = await fetch(`${API_ROUTES.offers}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete offer");
      }

      setOffers(prev => prev.filter(offer => offer._id !== id));
      toast({
        title: "Success",
        description: "Offer deleted successfully"
      });
    } catch (error) {
      console.error("Delete offer error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete offer",
        variant: "destructive"
      });
    }
  };

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
              <h1 className="text-xl md:text-2xl font-bold text-white">
                Manage Offers
              </h1>
              <div className="flex items-start mt-2 text-white">
                <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm">
                  You can manage different types of special offers, just click on
                  the &apos;Add offer&apos; button and fill in the form.
                </p>
              </div>
            </div>
            <Button
              className="bg-white text-gold hover:bg-gray-100"
              onClick={handleAddOffer}
            >
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
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                      #
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                      Image
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                      Offer Name
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                      Rate Code
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                      Short Intro
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-64">
                      Description
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-64">
                      Terms
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                      Email Text
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                      Status
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                      Actions
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {getCurrentPageData().map((offer, index) => (
                    <tr key={offer._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="px-4 py-4">
                        <div className="h-16 w-16 relative rounded-lg overflow-hidden">
                          <Image
                            src={offer.image?.url || "/placeholder.svg"}
                            alt={offer.offer_name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {offer.offer_name}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                        {offer.offer_rate_code}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        <div className="max-w-[200px] line-clamp-2">
                          {offer.short_intro}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        <div className="max-w-[250px] line-clamp-3" dangerouslySetInnerHTML={{ __html: offer.desc }} />
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        <div className="max-w-[250px] line-clamp-3" dangerouslySetInnerHTML={{ __html: offer.terms }} />
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        <div className="max-w-[200px] line-clamp-3" dangerouslySetInnerHTML={{ __html: offer.email_text }} />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          offer.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {offer.status}
                        </span>
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
                            onClick={() => handleDelete(offer._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500"
                            onClick={() => handleDownload(offer)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(offer.cdate).toLocaleDateString()}
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
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
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
          <AddOfferForm
            offer={currentOffer}
            onSave={handleSaveOffer}
            onCancel={() => setIsAddDialogOpen(false)}
          />
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
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={confirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Loading Spinner */}
      {isLoading && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      )}
    </div>
  )
}
