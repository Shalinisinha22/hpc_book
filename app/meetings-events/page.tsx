"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Sample initial data
const initialMeetingsEvents = [
  {
    id: 1,
    header: "Meetings & Events",
    paragraph:
      "Welcome to our prestigious The Royal Bihar hotel, where business meetings are elevated to new heights of sophistication and productivity. Our hotel offers a range of impeccably designed meeting spaces and state-of-the-art facilities to cater to your every need.",
    meetingRooms: 5,
    banquetHalls: 3,
  },
]

export default function MeetingsEventsPage() {
  const [meetingsEvents, setMeetingsEvents] = useState(initialMeetingsEvents)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentItem, setCurrentItem] = useState(null)
  const { toast } = useToast()

  const handleEdit = (item) => {
    setCurrentItem(item)
    setIsEditDialogOpen(true)
  }

  const handleUpdate = (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)
    const updatedItem = {
      ...currentItem,
      header: formData.get("header"),
      paragraph: formData.get("paragraph"),
      meetingRooms: Number.parseInt(formData.get("meetingRooms")),
      banquetHalls: Number.parseInt(formData.get("banquetHalls")),
    }

    setMeetingsEvents(meetingsEvents.map((item) => (item.id === updatedItem.id ? updatedItem : item)))

    setIsEditDialogOpen(false)
    toast({
      title: "Updated successfully",
      description: "Meetings & Events information has been updated.",
    })
  }

  return (
    <div className="p-6">
      <PageHeader heading="Meetings & Events Title" text="Add meeting & events goto Halls" />

      <div className="bg-white rounded-lg shadow mt-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="py-3 px-4 text-left">#</th>
                <th className="py-3 px-4 text-left">HEADER</th>
                <th className="py-3 px-4 text-left">PARAGRAPH</th>
                <th className="py-3 px-4 text-left">MEETING ROOM</th>
                <th className="py-3 px-4 text-left">BANQUET HALL</th>
                <th className="py-3 px-4 text-center">CHANGE</th>
              </tr>
            </thead>
            <tbody>
              {meetingsEvents.map((item, index) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4">{item.header}</td>
                  <td className="py-3 px-4 max-w-[300px] truncate">{item.paragraph}</td>
                  <td className="py-3 px-4">{item.meetingRooms}</td>
                  <td className="py-3 px-4">{item.banquetHalls}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center">
                      <button onClick={() => handleEdit(item)} className="p-1 hover:bg-gray-100 rounded-full">
                        <User size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Meetings & Events</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <Label htmlFor="header">
                Update Meetings & Events Header Text
                <span className="text-xs text-gray-500 ml-1">Max length 42</span>
              </Label>
              <Input id="header" name="header" defaultValue={currentItem?.header} maxLength={42} className="mt-1" />
            </div>

            <div>
              <Label htmlFor="paragraph">
                Update Meetings & Events Paragraph Text
                <span className="text-xs text-gray-500 ml-1">Max length 300</span>
              </Label>
              <Textarea
                id="paragraph"
                name="paragraph"
                defaultValue={currentItem?.paragraph}
                maxLength={300}
                className="mt-1 min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="meetingRooms">No Of Meeting Rooms</Label>
                <Select name="meetingRooms" defaultValue={currentItem?.meetingRooms?.toString()}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="banquetHalls">No Of Banquet Halls</Label>
                <Select name="banquetHalls" defaultValue={currentItem?.banquetHalls?.toString()}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="bg-amber-500 hover:bg-amber-600">
              Update
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
