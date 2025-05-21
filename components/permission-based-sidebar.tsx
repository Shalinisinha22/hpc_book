"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, LogOut, ChevronLeft, ChevronRight, Menu } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuthStore } from "@/lib/auth-store"
import { Building } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { mainNavItems, hotelManagementItems, eventsItems, otherItems, type SidebarItem } from "@/config/sidebar-config"

const sidebarTransition = "transition-all duration-300 ease-in-out"

export function PermissionBasedSidebar({ className = "", onCollapsedChange = (collapsed) => {} }) {
  const pathname = usePathname()
  const { user, hasPermission } = useAuthStore()
  const [activeItem, setActiveItem] = useState("")
  const [collapsed, setCollapsed] = useState(false)

  // Call onCollapsedChange when collapsed state changes
  useEffect(() => {
    onCollapsedChange(collapsed)
  }, [collapsed, onCollapsedChange])

  // Update active item based on pathname
  useEffect(() => {
    // Find the active item based on the current pathname
    const findActiveItem = (items: SidebarItem[]) => {
      for (const item of items) {
        if (item.path && pathname === item.path) {
          return item.label
        }
        if (item.path && pathname.startsWith(item.path)) {
          return item.label
        }
        if (item.children) {
          for (const child of item.children) {
            if (child.path && pathname === child.path) {
              return child.label
            }
            if (child.path && pathname.startsWith(child.path)) {
              return child.label
            }
          }
        }
      }
      return ""
    }

    const active =
      findActiveItem(mainNavItems) ||
      findActiveItem(hotelManagementItems) ||
      findActiveItem(eventsItems) ||
      findActiveItem(otherItems)

    setActiveItem(active)
  }, [pathname])

  // If no user or permissions, show nothing
  if (!user || !user.permissions) {
    return null
  }

  // Filter items based on user permissions
  const filterItemsByPermission = (items: SidebarItem[]) => {
    return items.filter((item) => hasPermission(item.permission))
  }

  const filteredMainNavItems = filterItemsByPermission(mainNavItems)
  const filteredHotelManagementItems = filterItemsByPermission(hotelManagementItems)
  const filteredEventsItems = filterItemsByPermission(eventsItems)
  const filteredOtherItems = filterItemsByPermission(otherItems)

  return (
    <aside
      className={`${collapsed ? "w-16" : "w-64"} bg-white flex-shrink-0 flex flex-col h-screen overflow-y-auto border-r border-gray-200 sticky top-0 transition-width duration-300 ease-in-out ${className}`}
    >
      <div
        className={`p-4 border-b border-gray-100 flex ${collapsed ? "justify-center" : "justify-between"} items-center`}
      >
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="bg-gold text-white p-2 rounded-lg">
              <Building className="h-5 w-5" />
            </div>
            <div className="font-bold text-xl text-gray-900">The Royal</div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-500 hover:text-gray-700 focus:outline-none p-2 bg-gray-100 rounded-md hover:bg-gray-200"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <div className="p-4 border-b border-gray-100">
        <div className={`flex ${collapsed ? "justify-center" : "items-center gap-3"}`}>
          <Avatar className="h-10 w-10 border-2 border-gold/20">
            <AvatarImage src="/diverse-group-city.png" alt="User" />
            <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div>
              <div className="font-medium text-sm text-gray-900">{user.name}</div>
              <div className="text-xs text-gray-500">{user.roleId ? `Role: ${user.roleId}` : "Hotel Staff"}</div>
            </div>
          )}
        </div>
      </div>

      {/* Main Navigation */}
      {filteredMainNavItems.length > 0 && (
        <div className="p-4">
          {!collapsed && <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Main</div>}
          <nav className="space-y-1">
            {filteredMainNavItems.map((item) => (
              <NavItem
                key={item.label}
                icon={<item.icon size={18} />}
                label={item.label}
                href={item.path || "#"}
                active={activeItem === item.label}
                collapsed={collapsed}
              />
            ))}
          </nav>
        </div>
      )}

      {/* Hotel Management */}
      {filteredHotelManagementItems.length > 0 && (
        <div className="p-4">
          {!collapsed && (
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Hotel Management</div>
          )}
          <nav className="space-y-1">
            {filteredHotelManagementItems.map((item) => (
              <CollapsibleNavItem
                key={item.label}
                icon={<item.icon size={18} />}
                label={item.label}
                active={activeItem === item.label}
                activeItem={activeItem}
                children={item.children?.filter((child) => hasPermission(child.permission))}
                collapsed={collapsed}
              />
            ))}
          </nav>
        </div>
      )}

      {/* Events */}
      {filteredEventsItems.length > 0 && (
        <div className="p-4">
          {!collapsed && (
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Events</div>
          )}
          <nav className="space-y-1">
            {filteredEventsItems.map((item) => (
              <CollapsibleNavItem
                key={item.label}
                icon={<item.icon size={18} />}
                label={item.label}
                active={activeItem === item.label}
                activeItem={activeItem}
                children={item.children?.filter((child) => hasPermission(child.permission))}
                collapsed={collapsed}
              />
            ))}
          </nav>
        </div>
      )}

      {/* Other */}
      {filteredOtherItems.length > 0 && (
        <div className="p-4">
          {!collapsed && <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Other</div>}
          <nav className="space-y-1">
            {filteredOtherItems.map((item) => (
              <NavItem
                key={item.label}
                icon={<item.icon size={18} />}
                label={item.label}
                href={item.path || "#"}
                active={activeItem === item.label}
                collapsed={collapsed}
              />
            ))}
          </nav>
        </div>
      )}

      <div className="mt-auto p-4 border-t border-gray-100">
        <nav className="space-y-1">
          <NavItem
            icon={<LogOut size={18} />}
            label="Logout"
            href="/logout"
            active={activeItem === "Logout"}
            collapsed={collapsed}
          />
        </nav>
      </div>

      {/* Fixed expand button when collapsed */}
      {collapsed && (
        <div className="fixed bottom-4 left-4 z-50">
          <button
            onClick={() => setCollapsed(false)}
            className="p-2 bg-gold text-white rounded-full shadow-lg hover:bg-gold/90 focus:outline-none"
            aria-label="Expand sidebar"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </aside>
  )
}

function NavItem({ icon, label, active = false, href = "#", collapsed = false }) {
  const className = `flex ${collapsed ? "justify-center" : "items-center gap-3"} px-3 py-2 rounded-lg text-sm ${
    active ? "bg-gold/10 text-gold font-medium" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
  }`

  // If collapsed, wrap with tooltip
  if (collapsed) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={href} className={className}>
              <div className={active ? "text-gold" : "text-gray-500"}>{icon}</div>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">{label}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  // Regular link when not collapsed
  return (
    <Link href={href} className={className}>
      <div className={active ? "text-gold" : "text-gray-500"}>{icon}</div>
      <span className="flex-1">{label}</span>
    </Link>
  )
}

function CollapsibleNavItem({ icon, label, active = false, activeItem = "", children = [], collapsed = false }) {
  const [isOpen, setIsOpen] = useState(active || children.some((child) => child.label === activeItem))

  if (children.length === 0) {
    return null
  }

  // If sidebar is collapsed, show a tooltip with submenu items
  if (collapsed) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-full flex justify-center px-3 py-2 rounded-lg text-sm cursor-pointer">
              <div className={active ? "text-gold" : "text-gray-500"}>{icon}</div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" className="p-2">
            <div className="font-medium mb-2">{label}</div>
            <div className="space-y-1">
              {children.map((item) => (
                <Link
                  key={item.label}
                  href={item.path || "#"}
                  className="block px-2 py-1 text-sm rounded hover:bg-gray-100"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

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
            {children.map((item) => (
              <Link
                key={item.label}
                href={item.path || "#"}
                className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-gray-50 ${
                  activeItem === item.label ? "bg-gold/10 text-gold font-medium" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default PermissionBasedSidebar
