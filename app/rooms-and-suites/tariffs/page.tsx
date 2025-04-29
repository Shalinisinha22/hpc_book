"use client"

import { useState, useEffect } from "react"
import { Info, AlertCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface RoomType {
  id: number
  name: string
  standardRates: {
    monday: number
    tuesday: number
    wednesday: number
    thursday: number
    friday: number
    saturday: number
    sunday: number
  }
  memberRates: {
    monday: number
    tuesday: number
    wednesday: number
    thursday: number
    friday: number
    saturday: number
    sunday: number
  }
  differentDayRates: boolean
  differentMemberRates: boolean
}

export default function TariffsPage() {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([
    {
      id: 1,
      name: "Premium Suite",
      standardRates: {
        monday: 6500,
        tuesday: 6500,
        wednesday: 6500,
        thursday: 6500,
        friday: 6500,
        saturday: 6500,
        sunday: 6500,
      },
      memberRates: {
        monday: 6400,
        tuesday: 6400,
        wednesday: 6400,
        thursday: 6400,
        friday: 6400,
        saturday: 6400,
        sunday: 6400,
      },
      differentDayRates: true,
      differentMemberRates: true,
    },
    {
      id: 2,
      name: "Premium Room",
      standardRates: {
        monday: 5500,
        tuesday: 5500,
        wednesday: 5500,
        thursday: 5500,
        friday: 5500,
        saturday: 5500,
        sunday: 5500,
      },
      memberRates: {
        monday: 5400,
        tuesday: 5400,
        wednesday: 5400,
        thursday: 5400,
        friday: 5400,
        saturday: 5400,
        sunday: 5400,
      },
      differentDayRates: false,
      differentMemberRates: false,
    },
    {
      id: 3,
      name: "Deluxe Room",
      standardRates: {
        monday: 4500,
        tuesday: 4500,
        wednesday: 4500,
        thursday: 4500,
        friday: 4500,
        saturday: 4500,
        sunday: 4500,
      },
      memberRates: {
        monday: 4400,
        tuesday: 4400,
        wednesday: 4400,
        thursday: 4400,
        friday: 4400,
        saturday: 4400,
        sunday: 4400,
      },
      differentDayRates: false,
      differentMemberRates: false,
    },
    {
      id: 4,
      name: "Deluxe Suite",
      standardRates: {
        monday: 7500,
        tuesday: 7500,
        wednesday: 7500,
        thursday: 7500,
        friday: 7500,
        saturday: 7500,
        sunday: 7500,
      },
      memberRates: {
        monday: 7400,
        tuesday: 7400,
        wednesday: 7400,
        thursday: 7400,
        friday: 7400,
        saturday: 7400,
        sunday: 7400,
      },
      differentDayRates: false,
      differentMemberRates: false,
    },
    {
      id: 5,
      name: "The Royal Pent House",
      standardRates: {
        monday: 12500,
        tuesday: 12500,
        wednesday: 12500,
        thursday: 12500,
        friday: 12500,
        saturday: 12500,
        sunday: 12500,
      },
      memberRates: {
        monday: 12000,
        tuesday: 12000,
        wednesday: 12000,
        thursday: 12000,
        friday: 12000,
        saturday: 12000,
        sunday: 12000,
      },
      differentDayRates: false,
      differentMemberRates: false,
    },
    {
      id: 6,
      name: "Studio Flat",
      standardRates: {
        monday: 3500,
        tuesday: 3500,
        wednesday: 3500,
        thursday: 3500,
        friday: 3500,
        saturday: 3500,
        sunday: 3500,
      },
      memberRates: {
        monday: 3400,
        tuesday: 3400,
        wednesday: 3400,
        thursday: 3400,
        friday: 3400,
        saturday: 3400,
        sunday: 3400,
      },
      differentDayRates: false,
      differentMemberRates: false,
    },
    {
      id: 7,
      name: "Big Family Rooms",
      standardRates: {
        monday: 8500,
        tuesday: 8500,
        wednesday: 8500,
        thursday: 8500,
        friday: 8500,
        saturday: 8500,
        sunday: 8500,
      },
      memberRates: {
        monday: 8300,
        tuesday: 8300,
        wednesday: 8300,
        thursday: 8300,
        friday: 8300,
        saturday: 8300,
        sunday: 8300,
      },
      differentDayRates: false,
      differentMemberRates: false,
    },
    {
      id: 8,
      name: "Standard Room",
      standardRates: {
        monday: 3000,
        tuesday: 3000,
        wednesday: 3000,
        thursday: 3000,
        friday: 3000,
        saturday: 3000,
        sunday: 3000,
      },
      memberRates: {
        monday: 2900,
        tuesday: 2900,
        wednesday: 2900,
        thursday: 2900,
        friday: 2900,
        saturday: 2900,
        sunday: 2900,
      },
      differentDayRates: false,
      differentMemberRates: false,
    },
  ])

  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null)
  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState(false)
  const [activeTab, setActiveTab] = useState("standard")

  // Update selected room when room ID changes
  useEffect(() => {
    if (selectedRoomId) {
      const room = roomTypes.find((room) => room.id === selectedRoomId)
      setSelectedRoom(room || null)
    } else {
      setSelectedRoom(null)
    }
  }, [selectedRoomId, roomTypes])

  // Handle room selection
  const handleRoomSelect = (value: string) => {
    setSelectedRoomId(Number(value))
    setSaveSuccess(false)
    setSaveError(false)
  }

  // Handle standard rate toggle
  const handleStandardRateToggle = (checked: boolean) => {
    if (!selectedRoom) return

    setSelectedRoom({
      ...selectedRoom,
      differentDayRates: checked,
    })
  }

  // Handle member rate toggle
  const handleMemberRateToggle = (checked: boolean) => {
    if (!selectedRoom) return

    setSelectedRoom({
      ...selectedRoom,
      differentMemberRates: checked,
    })
  }

  // Handle standard rate change
  const handleStandardRateChange = (day: string, value: string) => {
    if (!selectedRoom) return

    const numValue = value === "" ? 0 : Number(value)

    setSelectedRoom({
      ...selectedRoom,
      standardRates: {
        ...selectedRoom.standardRates,
        [day]: numValue,
      },
    })
  }

  // Handle member rate change
  const handleMemberRateChange = (day: string, value: string) => {
    if (!selectedRoom) return

    const numValue = value === "" ? 0 : Number(value)

    setSelectedRoom({
      ...selectedRoom,
      memberRates: {
        ...selectedRoom.memberRates,
        [day]: numValue,
      },
    })
  }

  // Handle update button click
  const handleUpdate = () => {
    if (!selectedRoom) return

    try {
      // Update the room type in the roomTypes array
      const updatedRoomTypes = roomTypes.map((room) => (room.id === selectedRoom.id ? selectedRoom : room))
      setRoomTypes(updatedRoomTypes)
      setSaveSuccess(true)
      setSaveError(false)

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false)
      }, 3000)
    } catch (error) {
      setSaveError(true)
      setSaveSuccess(false)
    }
  }

  // Function to set all days to the same price
  const setAllDaysToSamePrice = (type: "standard" | "member", price: number) => {
    if (!selectedRoom) return

    if (type === "standard") {
      setSelectedRoom({
        ...selectedRoom,
        standardRates: {
          monday: price,
          tuesday: price,
          wednesday: price,
          thursday: price,
          friday: price,
          saturday: price,
          sunday: price,
        },
      })
    } else {
      setSelectedRoom({
        ...selectedRoom,
        memberRates: {
          monday: price,
          tuesday: price,
          wednesday: price,
          thursday: price,
          friday: price,
          saturday: price,
          sunday: price,
        },
      })
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - hidden on mobile */}
      <Sidebar className="hidden md:flex" activeItem="Tariffs" />

      {/* Main Content */}
      <div className="flex-1">
        <PageHeader />

        <main className="p-4 md:p-6">
          <div className="bg-gold p-4 md:p-6 rounded-t-lg">
            <h1 className="text-xl md:text-2xl font-bold text-white">Set Prices</h1>
            <div className="flex items-start mt-2 text-white">
              <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm">
                Set a default price for each day/night of the week. Click on "Add Seasonal Prices" to define different
                seasonal prices for specific periods of the year.
              </p>
            </div>
          </div>

          <Card className="border-t-0 rounded-t-none p-6">
            <div className="mb-6">
              <Label htmlFor="room-select" className="text-base font-medium mb-2 block">
                Select a Room
              </Label>
              <Select onValueChange={handleRoomSelect} value={selectedRoomId?.toString() || ""}>
                <SelectTrigger id="room-select" className="w-full md:w-80">
                  <SelectValue placeholder="Choose a Room" />
                </SelectTrigger>
                <SelectContent>
                  {roomTypes.map((room) => (
                    <SelectItem key={room.id} value={room.id.toString()}>
                      {room.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedRoom && (
              <>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="standard">Standard Rate</TabsTrigger>
                    <TabsTrigger value="member">Special Price for Members</TabsTrigger>
                  </TabsList>

                  <TabsContent value="standard" className="space-y-6">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="different-day-rates" className="text-base font-medium">
                        Set different price for each day of the week:
                      </Label>
                      <Switch
                        id="different-day-rates"
                        checked={selectedRoom.differentDayRates}
                        onCheckedChange={handleStandardRateToggle}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                      {Object.entries(selectedRoom.standardRates).map(([day, rate]) => (
                        <div key={day} className="space-y-2">
                          <Label htmlFor={`standard-${day}`} className="text-sm font-medium uppercase">
                            {day}
                          </Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                            <Input
                              id={`standard-${day}`}
                              type="number"
                              value={rate}
                              onChange={(e) => handleStandardRateChange(day, e.target.value)}
                              className="pl-8"
                              disabled={!selectedRoom.differentDayRates}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {selectedRoom.differentDayRates && (
                      <div className="flex items-center gap-2">
                        <Label htmlFor="standard-all-days" className="text-sm font-medium">
                          Set all days to:
                        </Label>
                        <div className="relative w-32">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                          <Input
                            id="standard-all-days"
                            type="number"
                            placeholder="Price"
                            className="pl-8"
                            onChange={(e) => {
                              if (e.target.value) {
                                setAllDaysToSamePrice("standard", Number(e.target.value))
                              }
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="member" className="space-y-6">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="different-member-rates" className="text-base font-medium">
                        Set different price for each day of the week:
                      </Label>
                      <Switch
                        id="different-member-rates"
                        checked={selectedRoom.differentMemberRates}
                        onCheckedChange={handleMemberRateToggle}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                      {Object.entries(selectedRoom.memberRates).map(([day, rate]) => (
                        <div key={day} className="space-y-2">
                          <Label htmlFor={`member-${day}`} className="text-sm font-medium uppercase">
                            {day}
                          </Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                            <Input
                              id={`member-${day}`}
                              type="number"
                              value={rate}
                              onChange={(e) => handleMemberRateChange(day, e.target.value)}
                              className="pl-8"
                              disabled={!selectedRoom.differentMemberRates}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {selectedRoom.differentMemberRates && (
                      <div className="flex items-center gap-2">
                        <Label htmlFor="member-all-days" className="text-sm font-medium">
                          Set all days to:
                        </Label>
                        <div className="relative w-32">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                          <Input
                            id="member-all-days"
                            type="number"
                            placeholder="Price"
                            className="pl-8"
                            onChange={(e) => {
                              if (e.target.value) {
                                setAllDaysToSamePrice("member", Number(e.target.value))
                              }
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>

                <div className="mt-8 flex flex-col space-y-4">
                  <Button className="bg-gold hover:bg-gold-dark w-fit" onClick={handleUpdate}>
                    Update
                  </Button>

                  {saveSuccess && (
                    <Alert className="bg-green-50 border-green-200">
                      <AlertDescription className="text-green-800">Prices updated successfully!</AlertDescription>
                    </Alert>
                  )}

                  {saveError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>Failed to update prices. Please try again.</AlertDescription>
                    </Alert>
                  )}
                </div>
              </>
            )}

            {!selectedRoom && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-blue-800">
                <p className="flex items-center">
                  <Info className="h-5 w-5 mr-2" />
                  Please select a room to set prices.
                </p>
              </div>
            )}
          </Card>
        </main>
      </div>
    </div>
  )
}
