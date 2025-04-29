"use client"

import { useState } from "react"
import Link from "next/link"
import {
  LayoutDashboard,
  CalendarCheck,
  CalendarX,
  Users,
  Home,
  Tag,
  Building,
  Utensils,
  Sparkles,
  CalendarClock,
  Calendar,
  MapPin,
  Star,
  HelpCircle,
  Package,
  FileText,
  ChevronDown,
  Settings,
  LogOut,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Sidebar({ className = "", activeItem = "Dashboard" }) {
  return (
    <aside
      className={`w-64 bg-white flex-shrink-0 flex flex-col h-screen overflow-y-auto border-r border-gray-200 sticky top-0 ${className}`}
    >
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="bg-gold text-white p-2 rounded-lg">
            <Building className="h-5 w-5" />
          </div>
          <div className="font-bold text-xl text-gray-900">The Royal</div>
        </div>
      </div>

      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-gold/20">
            <AvatarImage src="/diverse-group-city.png" alt="User" />
            <AvatarFallback>DG</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-sm text-gray-900">DG Crux</div>
            <div className="text-xs text-gray-500">Hotel Manager</div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Main</div>
        <nav className="space-y-1">
          <NavItem
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
            href="/"
            active={activeItem === "Dashboard"}
          />
          <NavItem
            icon={<CalendarCheck size={18} />}
            label="Bookings"
            href="/bookings"
            active={activeItem === "Bookings"}
          />
          <NavItem
            icon={<CalendarX size={18} />}
            label="Cancel Bookings"
            href="/cancel-bookings"
            active={activeItem === "Cancel Bookings"}
          />
          <NavItem icon={<Users size={18} />} label="Members" href="/members" active={activeItem === "Members"} />
        </nav>
      </div>

      <div className="p-4">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Hotel Management</div>
        <nav className="space-y-1">
          <CollapsibleNavItem
            icon={<Home size={18} />}
            label="Rooms & Suites"
            active={activeItem === "Rooms & Suites" || activeItem === "Special Tariffs" || activeItem === "Gallery"}
            activeItem={activeItem}
          />
          <CollapsibleNavItem
            icon={<Tag size={18} />}
            label="Discounts"
            active={activeItem === "Discounts"}
            activeItem={activeItem}
          />
          <CollapsibleNavItem
            icon={<Building size={18} />}
            label="Halls"
            active={activeItem === "Halls"}
            activeItem={activeItem}
          />
          <CollapsibleNavItem
            icon={<Utensils size={18} />}
            label="Dining"
            active={activeItem === "Dining"}
            activeItem={activeItem}
          />
          <CollapsibleNavItem
            icon={<Sparkles size={18} />}
            label="Wellness"
            active={activeItem === "Wellness"}
            activeItem={activeItem}
          />
        </nav>
      </div>

      <div className="p-4">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Events</div>
        <nav className="space-y-1">
          <CollapsibleNavItem
            icon={<CalendarClock size={18} />}
            label="Meetings & Events"
            active={activeItem === "Meetings & Events"}
            activeItem={activeItem}
          />
          <NavItem icon={<Calendar size={18} />} label="Events Calendar" active={activeItem === "Events Calendar"} />
        </nav>
      </div>

      <div className="p-4">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Other</div>
        <nav className="space-y-1">
          <NavItem
            icon={<MapPin size={18} />}
            label="Popular Destinations"
            active={activeItem === "Popular Destinations"}
          />
          <NavItem icon={<Star size={18} />} label="User Ratings" active={activeItem === "User Ratings"} />
          <NavItem icon={<HelpCircle size={18} />} label="Help Center" active={activeItem === "Help Center"} />
          <NavItem icon={<Package size={18} />} label="Extras" active={activeItem === "Extras"} />
          <NavItem icon={<FileText size={18} />} label="Policies" active={activeItem === "Policies"} />
        </nav>
      </div>

      <div className="mt-auto p-4 border-t border-gray-100">
        <nav className="space-y-1">
          <NavItem icon={<Settings size={18} />} label="Settings" active={activeItem === "Settings"} />
          <NavItem icon={<LogOut size={18} />} label="Logout" active={activeItem === "Logout"} />
        </nav>
      </div>
    </aside>
  )
}

function NavItem({ icon, label, active = false, href = "#" }) {
  // Check if this is one of the items that should have linking functionality
  const shouldLink = ["Dashboard", "Bookings", "Cancel Bookings", "Members"].includes(label)

  const content = (
    <>
      <div className={active ? "text-gold" : "text-gray-500"}>{icon}</div>
      <span className="flex-1">{label}</span>
    </>
  )

  const className = `flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
    active ? "bg-gold/10 text-gold font-medium" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
  }`

  if (shouldLink) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    )
  }

  return <div className={className}>{content}</div>
}

function CollapsibleNavItem({ icon, label, active = false, activeItem = "" }) {
  const [isOpen, setIsOpen] = useState(
    active ||
      (label === "Rooms & Suites" &&
        (activeItem === "Rooms & Suites" ||
          activeItem === "Packages" ||
          activeItem === "Unavailable" ||
          activeItem === "Tariffs" ||
          activeItem === "Special Tariffs" ||
          activeItem === "Gallery")),
  )

  // Determine menu items based on the label
  const getMenuItems = () => {
    if (label === "Rooms & Suites") {
      return [
        { name: "Rooms & Suites", href: "/rooms-and-suites" },
        { name: "Unavailable", href: "/rooms-and-suites/unavailable" },
        { name: "Packages", href: "/rooms-and-suites/packages" },
        { name: "Tariffs", href: "/rooms-and-suites/tariffs" },
        { name: "Special Tariffs", href: "/rooms-and-suites/special-tariffs" },
        { name: "Gallery", href: "/rooms-and-suites/gallery" },
      ]
    } else if (label === "Discounts") {
      return [
        { name: "Special Offers", href: "#" },
        { name: "Promo Code", href: "#" },
      ]
    } else if (label === "Halls") {
      return [
        { name: "Booking Requests", href: "#" },
        { name: "Halls", href: "#" },
        { name: "Gallery", href: "#" },
      ]
    } else if (label === "Dining") {
      return [
        { name: "Dinings", href: "#" },
        { name: "Food Festivals", href: "#" },
        { name: "Gallery", href: "#" },
      ]
    } else if (label === "Wellness") {
      return [
        { name: "Wellness", href: "#" },
        { name: "Wellness Logos", href: "#" },
        { name: "Spa Services", href: "#" },
      ]
    } else if (label === "Meetings & Events") {
      return [
        { name: "Meetings & Events", href: "#" },
        { name: "Events", href: "#" },
        { name: "Events Booking", href: "#" },
      ]
    }

    return [
      { name: "Option 1", href: "#" },
      { name: "Option 2", href: "#" },
      { name: "Option 3", href: "#" },
    ]
  }

  const menuItems = getMenuItems()

  return (
    <div className="w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm ${
          active ? "bg-gold/10 text-gold font-medium" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={active ? "text-gold" : "text-gray-500"}>{icon}</div>
          <span>{label}</span>
        </div>
        <ChevronDown
          size={16}
          className={`${active ? "text-gold" : "text-gray-500"} transition-transform duration-200 ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="pl-9 pr-3 py-1">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-gray-50 ${
                  (item.name === "Packages" && activeItem === "Packages") ||
                  (item.name === "Unavailable" && activeItem === "Unavailable") ||
                  (item.name === "Tariffs" && activeItem === "Tariffs") ||
                  (item.name === "Special Tariffs" && activeItem === "Special Tariffs") ||
                  (item.name === "Gallery" && activeItem === "Gallery") ||
                  (
                    item.name === "Rooms & Suites" &&
                      item.href === "/rooms-and-suites" &&
                      activeItem === "Rooms & Suites"
                  )
                    ? "bg-gold/10 text-gold font-medium"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
