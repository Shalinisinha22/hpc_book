"use client"

import { Search, Bell } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MobileNav } from "@/components/mobile-nav"
import { UserMenu } from "@/components/user-menu"

export function PageHeader() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between p-4 bg-gold md:p-6">
      <MobileNav />

      <div className="relative w-full max-w-md mx-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
        <Input
          type="search"
          placeholder="Search"
          className="pl-10 pr-4 py-2 w-full rounded-full border-gold/40 bg-white focus:border-gold/30 focus:ring focus:ring-gold/20"
        />
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="rounded-full bg-green-500 text-white hover:bg-green-600">
          <Bell className="h-5 w-5" />
        </Button>
        <UserMenu />
      </div>
    </header>
  )
}
