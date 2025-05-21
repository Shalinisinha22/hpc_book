import {
  LayoutDashboard,
  CalendarCheck,
  CalendarX,
  Users,
  Home,
  Tag,
  Building2,
  Utensils,
  Sparkles,
  CalendarClock,
  Calendar,
  MapPin,
  Star,
  HelpCircle,
  Package,
  FileText,
  UserCog,
  Clock,
  Settings,
  type LucideIcon,
} from "lucide-react"
import { PERMISSIONS, type Permission } from "@/lib/permissions"

// Define sidebar item type
export interface SidebarItem {
  label: string
  icon: LucideIcon
  path?: string
  permission: Permission
  children?: Omit<SidebarItem, "children">[]
}

// Main navigation items
export const mainNavItems: SidebarItem[] = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
    permission: PERMISSIONS.DASHBOARD_VIEW,
  },
  {
    label: "Bookings",
    icon: CalendarCheck,
    path: "/bookings",
    permission: PERMISSIONS.BOOKINGS_VIEW,
  },
  {
    label: "Cancel Bookings",
    icon: CalendarX,
    path: "/cancel-bookings",
    permission: PERMISSIONS.CANCEL_BOOKINGS_VIEW,
  },
  {
    label: "Members",
    icon: Users,
    path: "/members",
    permission: PERMISSIONS.MEMBERS_VIEW,
  },
  {
    label: "Events Calendar",
    icon: Calendar,
    path: "/events-calendar",
    permission: PERMISSIONS.EVENTS_VIEW,
  },
]

// Hotel management items
export const hotelManagementItems: SidebarItem[] = [
  {
    label: "Rooms & Suites",
    icon: Home,
    permission: PERMISSIONS.DASHBOARD_VIEW,
    children: [
      {
        label: "Rooms & Suites",
        icon: Home,
        path: "/rooms-and-suites",
        permission: PERMISSIONS.DASHBOARD_VIEW,
      },
      {
        label: "Unavailable",
        icon: Home,
        path: "/rooms-and-suites/unavailable",
        permission: PERMISSIONS.DASHBOARD_VIEW,
      },
      {
        label: "Packages",
        icon: Home,
        path: "/rooms-and-suites/packages",
        permission: PERMISSIONS.DASHBOARD_VIEW,
      },
      {
        label: "Tariffs",
        icon: Home,
        path: "/rooms-and-suites/tariffs",
        permission: PERMISSIONS.DASHBOARD_VIEW,
      },
      {
        label: "Special Tariffs",
        icon: Home,
        path: "/rooms-and-suites/special-tariffs",
        permission: PERMISSIONS.DASHBOARD_VIEW,
      },
      {
        label: "Gallery",
        icon: Home,
        path: "/rooms-and-suites/gallery",
        permission: PERMISSIONS.DASHBOARD_VIEW,
      },
    ],
  },
  {
    label: "Discounts",
    icon: Tag,
    permission: PERMISSIONS.DISCOUNTS_VIEW,
    children: [
      {
        label: "Special Offers",
        icon: Tag,
        path: "/discounts/offers",
        permission: PERMISSIONS.DISCOUNTS_VIEW,
      },
      {
        label: "Promo Codes",
        icon: Tag,
        path: "/discounts/promo-codes",
        permission: PERMISSIONS.DISCOUNTS_VIEW,
      },
    ],
  },
  {
    label: "Halls",
    icon: Building2,
    permission: PERMISSIONS.HALLS_VIEW,
    children: [
      {
        label: "Booking Requests",
        icon: Building2,
        path: "/halls/booking-requests",
        permission: PERMISSIONS.HALLS_VIEW,
      },
      {
        label: "Halls",
        icon: Building2,
        path: "/halls",
        permission: PERMISSIONS.HALLS_VIEW,
      },
      {
        label: "Gallery",
        icon: Building2,
        path: "/halls/gallery",
        permission: PERMISSIONS.HALLS_VIEW,
      },
    ],
  },
  {
    label: "Dining",
    icon: Utensils,
    permission: PERMISSIONS.DASHBOARD_VIEW,
    children: [
      {
        label: "Dinings",
        icon: Utensils,
        path: "/dining/dinings",
        permission: PERMISSIONS.DASHBOARD_VIEW,
      },
      {
        label: "Food Festivals",
        icon: Utensils,
        path: "/dining/food-festivals",
        permission: PERMISSIONS.DASHBOARD_VIEW,
      },
      {
        label: "Gallery",
        icon: Utensils,
        path: "/dining/gallery",
        permission: PERMISSIONS.DASHBOARD_VIEW,
      },
    ],
  },
  {
    label: "Wellness",
    icon: Sparkles,
    permission: PERMISSIONS.WELLNESS_VIEW,
    children: [
      {
        label: "Wellness",
        icon: Sparkles,
        path: "/wellness",
        permission: PERMISSIONS.WELLNESS_VIEW,
      },
      {
        label: "Wellness Logos",
        icon: Sparkles,
        path: "/wellness/logos",
        permission: PERMISSIONS.WELLNESS_VIEW,
      },
      {
        label: "Spa Services",
        icon: Sparkles,
        path: "/wellness/spa-services",
        permission: PERMISSIONS.WELLNESS_VIEW,
      },
    ],
  },
]

// Events items
export const eventsItems: SidebarItem[] = [
  {
    label: "Meetings & Events",
    icon: CalendarClock,
    permission: PERMISSIONS.MEETINGS_VIEW,
    children: [
      {
        label: "Meetings & Events",
        icon: CalendarClock,
        path: "/meetings-events",
        permission: PERMISSIONS.MEETINGS_VIEW,
      },
      {
        label: "Events",
        icon: CalendarClock,
        path: "/meetings-events/events",
        permission: PERMISSIONS.MEETINGS_VIEW,
      },
      {
        label: "Events Booking",
        icon: CalendarClock,
        path: "/meetings-events/booking",
        permission: PERMISSIONS.MEETINGS_VIEW,
      },
    ],
  },
]

// Other items
export const otherItems: SidebarItem[] = [
  {
    label: "Popular Destinations",
    icon: MapPin,
    path: "/popular-destinations",
    permission: PERMISSIONS.DASHBOARD_VIEW,
  },
  {
    label: "User Ratings",
    icon: Star,
    path: "/user-ratings",
    permission: PERMISSIONS.USERS_RATING_VIEW,
  },
  {
    label: "Help Center",
    icon: HelpCircle,
    path: "/help-center",
    permission: PERMISSIONS.DASHBOARD_VIEW,
  },
  {
    label: "Extras",
    icon: Package,
    path: "/extras",
    permission: PERMISSIONS.EXTRAS_VIEW,
  },
  {
    label: "Policies",
    icon: FileText,
    path: "/policies",
    permission: PERMISSIONS.POLICIES_VIEW,
  },
  {
    label: "Staff Leave",
    icon: Clock,
    path: "/staff-leave",
    permission: PERMISSIONS.STAFF_LEAVE_VIEW,
  },
  {
    label: "User & Role",
    icon: UserCog,
    path: "/user-roles",
    permission: PERMISSIONS.USER_ROLE_MANAGE,
  },
  {
    label: "Settings",
    icon: Settings,
    path: "/settings",
    permission: PERMISSIONS.DASHBOARD_VIEW,
  },
]
