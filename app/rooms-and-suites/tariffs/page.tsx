"use client"

import { useState, useEffect, useRef } from "react"
import { Info, AlertCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  monthlyRates: {
    [year: string]: {
      [month: string]: {
        [day: string]: number
      }
    }
  }
  lowestPrice: {
    enabled: boolean
    price: number
    autoCalculate: boolean
  }
  differentDayRates: boolean
  differentMemberRates: boolean
  differentMonthlyRates: boolean
}

export default function TariffsPage() {
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => (currentYear + i).toString())

  // Initialize monthly rates for all rooms with current year and next 4 years
  const initializeMonthlyRates = (baseRate: number) => {
    const rates: any = {}
    years.forEach((year) => {
      rates[year] = {
        january: Object.fromEntries([...Array(31)].map((_, i) => [`day${i + 1}`, baseRate])),
        february: Object.fromEntries([...Array(29)].map((_, i) => [`day${i + 1}`, baseRate])),
        march: Object.fromEntries([...Array(31)].map((_, i) => [`day${i + 1}`, baseRate])),
        april: Object.fromEntries([...Array(30)].map((_, i) => [`day${i + 1}`, baseRate])),
        may: Object.fromEntries([...Array(31)].map((_, i) => [`day${i + 1}`, baseRate])),
        june: Object.fromEntries([...Array(30)].map((_, i) => [`day${i + 1}`, baseRate])),
        july: Object.fromEntries([...Array(31)].map((_, i) => [`day${i + 1}`, baseRate])),
        august: Object.fromEntries([...Array(31)].map((_, i) => [`day${i + 1}`, baseRate])),
        september: Object.fromEntries([...Array(30)].map((_, i) => [`day${i + 1}`, baseRate])),
        october: Object.fromEntries([...Array(31)].map((_, i) => [`day${i + 1}`, baseRate])),
        november: Object.fromEntries([...Array(30)].map((_, i) => [`day${i + 1}`, baseRate])),
        december: Object.fromEntries([...Array(31)].map((_, i) => [`day${i + 1}`, baseRate])),
      }
    })
    return rates
  }

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
      monthlyRates: initializeMonthlyRates(6300),
      lowestPrice: {
        enabled: false,
        price: 6000,
        autoCalculate: true,
      },
      differentDayRates: true,
      differentMemberRates: true,
      differentMonthlyRates: false,
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
      monthlyRates: initializeMonthlyRates(5300),
      lowestPrice: {
        enabled: false,
        price: 5000,
        autoCalculate: true,
      },
      differentDayRates: false,
      differentMemberRates: false,
      differentMonthlyRates: false,
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
        thursday: 4400,
        sunday: 4400,
      },
      monthlyRates: initializeMonthlyRates(4300),
      lowestPrice: {
        enabled: false,
        price: 4000,
        autoCalculate: true,
      },
      differentDayRates: false,
      differentMemberRates: false,
      differentMonthlyRates: false,
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
      monthlyRates: initializeMonthlyRates(7300),
      lowestPrice: {
        enabled: false,
        price: 7000,
        autoCalculate: true,
      },
      differentDayRates: false,
      differentMemberRates: false,
      differentMonthlyRates: false,
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
      monthlyRates: initializeMonthlyRates(11500),
      lowestPrice: {
        enabled: false,
        price: 11000,
        autoCalculate: true,
      },
      differentDayRates: false,
      differentMemberRates: false,
      differentMonthlyRates: false,
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
      monthlyRates: initializeMonthlyRates(3300),
      lowestPrice: {
        enabled: false,
        price: 3000,
        autoCalculate: true,
      },
      differentDayRates: false,
      differentMemberRates: false,
      differentMonthlyRates: false,
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
      monthlyRates: initializeMonthlyRates(8100),
      lowestPrice: {
        enabled: false,
        price: 8000,
        autoCalculate: true,
      },
      differentDayRates: false,
      differentMemberRates: false,
      differentMonthlyRates: false,
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
      monthlyRates: initializeMonthlyRates(2800),
      lowestPrice: {
        enabled: false,
        price: 2700,
        autoCalculate: true,
      },
      differentDayRates: false,
      differentMemberRates: false,
      differentMonthlyRates: false,
    },
  ])

  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null)
  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState(false)
  const [activeTab, setActiveTab] = useState("standard")
  const [selectedMonth, setSelectedMonth] = useState<string>("january")
  const [selectedYear, setSelectedYear] = useState<string>(currentYear.toString())

  // Use refs to track changes that should trigger recalculation
  const previousRoomIdRef = useRef<number | null>(null)
  const shouldCalculateLowestPrice = useRef(false)

  // Update selected room when room ID changes
  useEffect(() => {
    if (selectedRoomId !== previousRoomIdRef.current) {
      if (selectedRoomId) {
        const room = roomTypes.find((room) => room.id === selectedRoomId)
        setSelectedRoom(room || null)
        previousRoomIdRef.current = selectedRoomId
        shouldCalculateLowestPrice.current = true
      } else {
        setSelectedRoom(null)
        previousRoomIdRef.current = null
      }
    }
  }, [selectedRoomId, roomTypes])

  // Calculate lowest price only when needed
  useEffect(() => {
    if (selectedRoom && shouldCalculateLowestPrice.current && selectedRoom.lowestPrice.autoCalculate) {
      // Get all rates from standard and member rates
      const allRates = [...Object.values(selectedRoom.standardRates), ...Object.values(selectedRoom.memberRates)]

      // Find the minimum rate
      const minRate = Math.min(...allRates)

      // Apply a 10% discount to the minimum rate
      const lowestPrice = Math.floor(minRate * 0.9)

      // Only update if the price has changed
      if (lowestPrice !== selectedRoom.lowestPrice.price) {
        const updatedRoom = {
          ...selectedRoom,
          lowestPrice: {
            ...selectedRoom.lowestPrice,
            price: lowestPrice,
          },
        }

        setSelectedRoom(updatedRoom)
      }

      // Reset the flag
      shouldCalculateLowestPrice.current = false
    }
  }, [selectedRoom])

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

    // Flag that we should recalculate lowest price
    shouldCalculateLowestPrice.current = true
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

    // Flag that we should recalculate lowest price
    shouldCalculateLowestPrice.current = true
  }

  // Handle monthly rate toggle
  const handleMonthlyRateToggle = (checked: boolean) => {
    if (!selectedRoom) return

    setSelectedRoom({
      ...selectedRoom,
      differentMonthlyRates: checked,
    })
  }

  // Handle monthly rate change
  const handleMonthlyRateChange = (day: string, value: string) => {
    if (!selectedRoom) return

    const numValue = value === "" ? 0 : Number(value)

    setSelectedRoom({
      ...selectedRoom,
      monthlyRates: {
        ...selectedRoom.monthlyRates,
        [selectedYear]: {
          ...selectedRoom.monthlyRates[selectedYear],
          [selectedMonth]: {
            ...selectedRoom.monthlyRates[selectedYear][selectedMonth],
            [day]: numValue,
          },
        },
      },
    })
  }

  // Handle lowest price toggle
  const handleLowestPriceToggle = (checked: boolean) => {
    if (!selectedRoom) return

    setSelectedRoom({
      ...selectedRoom,
      lowestPrice: {
        ...selectedRoom.lowestPrice,
        enabled: checked,
      },
    })
  }

  // Handle lowest price change
  const handleLowestPriceChange = (value: string) => {
    if (!selectedRoom) return

    const numValue = value === "" ? 0 : Number(value)

    setSelectedRoom({
      ...selectedRoom,
      lowestPrice: {
        ...selectedRoom.lowestPrice,
        price: numValue,
        autoCalculate: false,
      },
    })
  }

  // Handle auto-calculate toggle
  const handleAutoCalculateToggle = (checked: boolean) => {
    if (!selectedRoom) return

    const updatedRoom = {
      ...selectedRoom,
      lowestPrice: {
        ...selectedRoom.lowestPrice,
        autoCalculate: checked,
      },
    }

    setSelectedRoom(updatedRoom)

    // Flag that we should recalculate lowest price if auto-calculate is enabled
    if (checked) {
      shouldCalculateLowestPrice.current = true
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

    // Flag that we should recalculate lowest price
    shouldCalculateLowestPrice.current = true
  }

  // Function to set all monthly days to the same price
  const setAllMonthlyDaysToSamePrice = (price: number) => {
    if (!selectedRoom) return

    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear)
    const updatedMonthRates = { ...selectedRoom.monthlyRates[selectedYear][selectedMonth] }

    for (let i = 1; i <= daysInMonth; i++) {
      updatedMonthRates[`day${i}`] = price
    }

    setSelectedRoom({
      ...selectedRoom,
      monthlyRates: {
        ...selectedRoom.monthlyRates,
        [selectedYear]: {
          ...selectedRoom.monthlyRates[selectedYear],
          [selectedMonth]: updatedMonthRates,
        },
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

  // Helper function to get days in a month, accounting for leap years
  const getDaysInMonth = (month: string, year: string): number => {
    const yearNum = Number.parseInt(year)
    const isLeapYear = (yearNum % 4 === 0 && yearNum % 100 !== 0) || yearNum % 400 === 0

    switch (month.toLowerCase()) {
      case "february":
        return isLeapYear ? 29 : 28
      case "april":
      case "june":
      case "september":
      case "november":
        return 30
      default:
        return 31
    }
  }

  // Helper function to get the first day of the month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (month: string, year: string): number => {
    const monthIndex = [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
    ].indexOf(month.toLowerCase())

    return new Date(Number.parseInt(year), monthIndex, 1).getDay()
  }

  // Helper function to calculate the lowest price (without setting state)
  const getCalculatedLowestPrice = () => {
    if (!selectedRoom) return 0

    // Get all rates from standard and member rates
    const allRates = [...Object.values(selectedRoom.standardRates), ...Object.values(selectedRoom.memberRates)]

    // Find the minimum rate
    const minRate = Math.min(...allRates)

    // Apply a 10% discount to the minimum rate
    return Math.floor(minRate * 0.9)
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
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="standard">Standard Rate</TabsTrigger>
                  <TabsTrigger value="member">Special Price for Members</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly Rate</TabsTrigger>
                  <TabsTrigger value="lowest">Lowest Price</TabsTrigger>
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

                <TabsContent value="monthly" className="space-y-6">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="different-monthly-rates" className="text-base font-medium">
                      Set different price for each day of the month:
                    </Label>
                    <Switch
                      id="different-monthly-rates"
                      checked={selectedRoom?.differentMonthlyRates || false}
                      onCheckedChange={handleMonthlyRateToggle}
                    />
                  </div>

                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-4">
                        <div>
                          <Label className="text-base font-medium mb-1 block">Select Year:</Label>
                          <Select value={selectedYear} onValueChange={setSelectedYear}>
                            <SelectTrigger className="w-[120px]">
                              <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                            <SelectContent>
                              {years.map((year) => (
                                <SelectItem key={year} value={year}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="text-base font-medium mb-1 block">Select Month:</Label>
                          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                            <SelectTrigger className="w-[150px]">
                              <SelectValue placeholder="Select month" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="january">January</SelectItem>
                              <SelectItem value="february">February</SelectItem>
                              <SelectItem value="march">March</SelectItem>
                              <SelectItem value="april">April</SelectItem>
                              <SelectItem value="may">May</SelectItem>
                              <SelectItem value="june">June</SelectItem>
                              <SelectItem value="july">July</SelectItem>
                              <SelectItem value="august">August</SelectItem>
                              <SelectItem value="september">September</SelectItem>
                              <SelectItem value="october">October</SelectItem>
                              <SelectItem value="november">November</SelectItem>
                              <SelectItem value="december">December</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {selectedRoom.differentMonthlyRates && (
                        <div className="flex items-center gap-2">
                          <Label htmlFor="monthly-all-days" className="text-sm font-medium whitespace-nowrap">
                            Set all days to:
                          </Label>
                          <div className="relative w-32">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                            <Input
                              id="monthly-all-days"
                              type="number"
                              placeholder="Price"
                              className="pl-8"
                              onChange={(e) => {
                                if (e.target.value) {
                                  setAllMonthlyDaysToSamePrice(Number(e.target.value))
                                }
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="border rounded-lg overflow-hidden">
                      <div className="grid grid-cols-7 bg-gray-100 dark:bg-gray-800 font-medium text-center py-2">
                        <div>Sun</div>
                        <div>Mon</div>
                        <div>Tue</div>
                        <div>Wed</div>
                        <div>Thu</div>
                        <div>Fri</div>
                        <div>Sat</div>
                      </div>

                      <div className="grid grid-cols-7 gap-1 p-2">
                        {/* Empty cells for days before the 1st of the month */}
                        {Array.from({ length: getFirstDayOfMonth(selectedMonth, selectedYear) }).map((_, index) => (
                          <div key={`empty-${index}`} className="p-1 min-h-[90px]"></div>
                        ))}

                        {/* Calendar days */}
                        {selectedRoom &&
                          selectedRoom.monthlyRates[selectedYear] &&
                          selectedRoom.monthlyRates[selectedYear][selectedMonth] &&
                          Array.from({ length: getDaysInMonth(selectedMonth, selectedYear) }).map((_, index) => {
                            const day = `day${index + 1}`
                            const rate = selectedRoom.monthlyRates[selectedYear][selectedMonth][day]
                            const dayOfWeek = (getFirstDayOfMonth(selectedMonth, selectedYear) + index) % 7
                            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

                            return (
                              <div
                                key={day}
                                className={`p-1 border rounded min-h-[90px] relative ${
                                  isWeekend ? "bg-gray-50 dark:bg-gray-900" : ""
                                }`}
                              >
                                <div className="absolute top-1 left-1 font-bold text-sm">{index + 1}</div>
                                <div className="mt-5">
                                  <div className="relative">
                                    <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
                                      ₹
                                    </span>
                                    <Input
                                      type="number"
                                      value={rate}
                                      onChange={(e) => handleMonthlyRateChange(day, e.target.value)}
                                      className="pl-5 h-8 text-sm"
                                      disabled={!selectedRoom.differentMonthlyRates}
                                    />
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="lowest" className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-blue-800 mb-6">
                    <p className="flex items-start">
                      <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                      <span>
                        The lowest price feature allows you to set a minimum price that will be used when all other
                        rates are higher. This is useful for last-minute bookings or special promotions.
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mb-6">
                    <Label htmlFor="enable-lowest-price" className="text-base font-medium">
                      Enable Lowest Price:
                    </Label>
                    <Switch
                      id="enable-lowest-price"
                      checked={selectedRoom.lowestPrice.enabled}
                      onCheckedChange={handleLowestPriceToggle}
                    />
                  </div>

                  {selectedRoom.lowestPrice.enabled && (
                    <>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                          <Label htmlFor="auto-calculate" className="text-base font-medium">
                            Auto-calculate (10% off lowest rate):
                          </Label>
                          <Switch
                            id="auto-calculate"
                            checked={selectedRoom.lowestPrice.autoCalculate}
                            onCheckedChange={handleAutoCalculateToggle}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="lowest-price" className="text-base font-medium">
                            Lowest Price:
                          </Label>
                          <div className="relative w-full max-w-xs">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                            <Input
                              id="lowest-price"
                              type="number"
                              value={
                                selectedRoom.lowestPrice.autoCalculate
                                  ? getCalculatedLowestPrice()
                                  : selectedRoom.lowestPrice.price
                              }
                              onChange={(e) => handleLowestPriceChange(e.target.value)}
                              className="pl-8"
                              disabled={selectedRoom.lowestPrice.autoCalculate}
                            />
                          </div>
                        </div>

                        <div className="mt-4 p-4 bg-gray-50 border rounded-md">
                          <h3 className="font-medium mb-2">Current Rates Summary:</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-600">
                                Standard Rate (lowest): ₹{Math.min(...Object.values(selectedRoom.standardRates))}
                              </p>
                              <p className="text-sm text-gray-600">
                                Member Rate (lowest): ₹{Math.min(...Object.values(selectedRoom.memberRates))}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">
                                Standard Rate (highest): ₹{Math.max(...Object.values(selectedRoom.standardRates))}
                              </p>
                              <p className="text-sm text-gray-600">
                                Member Rate (highest): ₹{Math.max(...Object.values(selectedRoom.memberRates))}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 pt-2 border-t">
                            <p className="font-medium">
                              Your Lowest Price: ₹
                              {selectedRoom.lowestPrice.autoCalculate
                                ? getCalculatedLowestPrice()
                                : selectedRoom.lowestPrice.price}
                            </p>
                            {selectedRoom.lowestPrice.autoCalculate && (
                              <p className="text-sm text-gray-600 mt-1">(Auto-calculated as 10% off the lowest rate)</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </TabsContent>
              </Tabs>
            )}

            {!selectedRoom && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-blue-800">
                <p className="flex items-center">
                  <Info className="h-5 w-5 mr-2" />
                  Please select a room to set prices.
                </p>
              </div>
            )}

            {selectedRoom && (
              <div className="mt-8 flex flex-col space-y-4">
                <Button className="bg-gold hover:bg-gold-dark w-fit" onClick={handleUpdate}>
                  Update
                </Button>

                {saveSuccess && (
                  <div className="bg-green-50 border border-green-200 rounded-md p-4">
                    <p className="text-green-800">Prices updated successfully!</p>
                  </div>
                )}

                {saveError && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <p className="flex items-center text-red-800">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      Failed to update prices. Please try again.
                    </p>
                  </div>
                )}
              </div>
            )}
          </Card>
        </main>
      </div>
    </div>
  )
}
