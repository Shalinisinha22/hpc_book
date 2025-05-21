"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Edit2, Trash2, Plus } from "lucide-react"
import RichTextEditor from "@/components/rich-text-editor"

// Define the Policy type
interface Policy {
  id: number
  type: string
  updatedAt: string
  content: string
}

export default function PoliciesPage() {
  const { toast } = useToast()
  const [policies, setPolicies] = useState<Policy[]>([
    {
      id: 1,
      type: "Banquet Policy",
      updatedAt: new Date().toISOString(),
      content:
        '<h3><span style="color: #bf8040;"><strong>Service Details:</strong></span></h3><ul><li>Dedicated floor manager will be assigned.</li><li>Buffet dinner in a pre-designated area.</li></ul><h3><span style="color: #bf8040;">DJ Timing:</span></h3><ul><li>As per the directive of the Honourable Supreme Court of India, playing loud music and live or recorded musical performance or recital is not permitted beyond 22:00 hrs at an outdoor venue and 23:30hrs at an indoor venue. All music/musical performances will be shut down at stipulated times by the court\'s directive. If DJ is to be played beyond the stipulated time, the client will bear the responsibility.</li></ul><h3><span style="color: #bf8040;">DJ Charges (Optional):</span></h3><ul><li>The Banquet will provide instrumental background music for your listening pleasure in the lobby. Should you have special requests like a live band, DJ, Orchestra, etc. the same can be arranged at an additional cost.</li><li>DJ charges will be applicable extra.</li><li>PPL / IPRS certificate has to be arranged by the Guest. If the guest fails to submit the same, the client will bear responsibility. Banquet Management will not be responsible for any consequences.</li></ul>',
    },
    {
      id: 2,
      type: "Terms of Service",
      updatedAt: new Date().toISOString(),
      content:
        '<h3><strong><span style="color: #bf8040;">INTRODUCTION</span></strong></h3><p>Welcome to our hotel booking platform. By accessing or using our services, you agree to be bound by these Terms of Service.</p>',
    },
    {
      id: 3,
      type: "Refund Policy",
      updatedAt: new Date().toISOString(),
      content:
        '<h3><span style="color: #bf8040;">Refund and Cancellation Policy</span></h3><p>Cancellations made 48 hours prior to check-in will receive a full refund. Cancellations made within 48 hours of check-in are non-refundable.</p>',
    },
    {
      id: 4,
      type: "Privacy Policy",
      updatedAt: new Date().toISOString(),
      content:
        '<h3><span style="color: #bf8040;">Arrival and Departure</span></h3><p>We collect personal information to process your booking and provide you with the best service possible. Your data is secure and will not be shared with third parties.</p>',
    },
  ])

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentPolicy, setCurrentPolicy] = useState<Policy | null>(null)
  const [newPolicy, setNewPolicy] = useState({
    type: "",
    content: "",
  })

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Truncate content for display
  const truncateContent = (content: string, maxLength = 100) => {
    // Remove HTML tags
    const plainText = content.replace(/<[^>]+>/g, "")
    if (plainText.length <= maxLength) return plainText
    return plainText.substring(0, maxLength) + "..."
  }

  // Handle add policy
  const handleAddPolicy = () => {
    if (!newPolicy.type || !newPolicy.content) {
      toast({
        title: "Error",
        description: "Policy name and content are required.",
        variant: "destructive",
      })
      return
    }

    const newId = policies.length > 0 ? Math.max(...policies.map((policy) => policy.id)) + 1 : 1

    setPolicies([
      ...policies,
      {
        id: newId,
        type: newPolicy.type,
        updatedAt: new Date().toISOString(),
        content: newPolicy.content,
      },
    ])

    setNewPolicy({
      type: "",
      content: "",
    })

    setIsAddDialogOpen(false)

    toast({
      title: "Success",
      description: "Policy added successfully.",
    })
  }

  // Handle edit policy
  const handleEditPolicy = (policy: Policy) => {
    setCurrentPolicy(policy)
    setIsEditDialogOpen(true)
  }

  // Handle update policy
  const handleUpdatePolicy = () => {
    if (!currentPolicy || !currentPolicy.type || !currentPolicy.content) {
      toast({
        title: "Error",
        description: "Policy name and content are required.",
        variant: "destructive",
      })
      return
    }

    setPolicies(
      policies.map((policy) =>
        policy.id === currentPolicy.id
          ? {
              ...currentPolicy,
              updatedAt: new Date().toISOString(),
            }
          : policy,
      ),
    )

    setIsEditDialogOpen(false)
    setCurrentPolicy(null)

    toast({
      title: "Success",
      description: "Policy updated successfully.",
    })
  }

  // Handle delete policy
  const handleDeletePolicy = (id: number) => {
    setPolicies(policies.filter((policy) => policy.id !== id))

    toast({
      title: "Success",
      description: "Policy deleted successfully.",
    })
  }

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        heading="Manage Policies"
        subheading="Manage booking & website terms and conditions. You can manage different types of policies here."
      />

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Policies</h2>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Add Policy
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-sm text-gray-500">#</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-gray-500">POLICY TYPE</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-gray-500">UPDATED AT</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-gray-500">CONTENT</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-gray-500">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {policies.length > 0 ? (
                  policies.map((policy) => (
                    <tr key={policy.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">{policy.id}</td>
                      <td className="py-3 px-4">{policy.type}</td>
                      <td className="py-3 px-4">{formatDate(policy.updatedAt)}</td>
                      <td className="py-3 px-4 max-w-md">
                        <div
                          className="truncate"
                          dangerouslySetInnerHTML={{ __html: truncateContent(policy.content) }}
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditPolicy(policy)}
                            className="h-8 w-8 text-gray-500 hover:text-gray-700"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeletePolicy(policy.id)}
                            className="h-8 w-8 text-gray-500 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-4 px-4 text-center text-gray-500">
                      No policies available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Policy Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Policy</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label htmlFor="policy-name" className="block text-sm font-medium text-gray-700 mb-1">
                Policy Name
              </label>
              <Input
                id="policy-name"
                value={newPolicy.type}
                onChange={(e) => setNewPolicy({ ...newPolicy, type: e.target.value })}
                placeholder="Enter policy name"
              />
            </div>

            <div>
              <label htmlFor="policy-content" className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <RichTextEditor
                id="policy-content"
                value={newPolicy.content}
                onChange={(content) => setNewPolicy({ ...newPolicy, content })}
              />
            </div>

            <div className="flex justify-end">
              <Button onClick={handleAddPolicy} className="bg-amber-500 hover:bg-amber-600 text-white">
                Add Policy
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Policy Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update Policy</DialogTitle>
          </DialogHeader>

          {currentPolicy && (
            <div className="space-y-4 py-4">
              <div>
                <label htmlFor="edit-policy-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Policy Name
                </label>
                <Input
                  id="edit-policy-name"
                  value={currentPolicy.type}
                  onChange={(e) => setCurrentPolicy({ ...currentPolicy, type: e.target.value })}
                  placeholder="Enter policy name"
                />
              </div>

              <div>
                <label htmlFor="edit-policy-content" className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <RichTextEditor
                  id="edit-policy-content"
                  value={currentPolicy.content}
                  onChange={(content) => setCurrentPolicy({ ...currentPolicy, content: content })}
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={handleUpdatePolicy} className="bg-amber-500 hover:bg-amber-600 text-white">
                  Update
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
