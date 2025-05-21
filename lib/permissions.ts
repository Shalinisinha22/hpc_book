// Define all available permissions
export const PERMISSIONS = {
  // Main modules
  DASHBOARD_VIEW: "dashboard.view",
  BOOKINGS_VIEW: "bookings.view",
  MEMBERS_VIEW: "members.view",
  CANCEL_BOOKINGS_VIEW: "cancel_bookings.view",
  EVENTS_VIEW: "events.view",
  WELLNESS_VIEW: "wellness.view",
  HALLS_VIEW: "halls.view",
  MEETINGS_VIEW: "meetings.view",
  POLICIES_VIEW: "policies.view",
  DISCOUNTS_VIEW: "discounts.view",
  USERS_RATING_VIEW: "users_rating.view",
  EXTRAS_VIEW: "extras.view",

  // Staff management
  STAFF_LEAVE_VIEW: "staff_leave.view",
  STAFF_LEAVE_MANAGE: "staff_leave.manage",

  // User & Role management
  USER_ROLE_MANAGE: "user_role.manage",
} as const

// Permission type
export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

// Role types
export type RoleType = "Admin" | "Front Office" | "HR" | "Bqt Service" | "Account" | string

// Role interface
export interface Role {
  id: string
  name: RoleType
  description: string
  permissions: Permission[]
}

// Predefined roles with their permissions
export const PREDEFINED_ROLES: Role[] = [
  {
    id: "1",
    name: "Admin",
    description: "Full access to all features",
    permissions: [
      PERMISSIONS.DASHBOARD_VIEW,
      PERMISSIONS.BOOKINGS_VIEW,
      PERMISSIONS.MEMBERS_VIEW,
      PERMISSIONS.CANCEL_BOOKINGS_VIEW,
      PERMISSIONS.EVENTS_VIEW,
      PERMISSIONS.WELLNESS_VIEW,
      PERMISSIONS.HALLS_VIEW,
      PERMISSIONS.MEETINGS_VIEW,
      PERMISSIONS.POLICIES_VIEW,
      PERMISSIONS.DISCOUNTS_VIEW,
      PERMISSIONS.USERS_RATING_VIEW,
      PERMISSIONS.EXTRAS_VIEW,
      PERMISSIONS.STAFF_LEAVE_VIEW,
      PERMISSIONS.STAFF_LEAVE_MANAGE,
      PERMISSIONS.USER_ROLE_MANAGE,
    ],
  },
  {
    id: "2",
    name: "Front Office",
    description: "Access to front desk operations",
    permissions: [
      PERMISSIONS.DASHBOARD_VIEW,
      PERMISSIONS.BOOKINGS_VIEW,
      PERMISSIONS.MEMBERS_VIEW,
      PERMISSIONS.CANCEL_BOOKINGS_VIEW,
    ],
  },
  {
    id: "3",
    name: "HR",
    description: "Access to HR-related features",
    permissions: [
      PERMISSIONS.MEMBERS_VIEW,
      PERMISSIONS.EVENTS_VIEW,
      PERMISSIONS.WELLNESS_VIEW,
      PERMISSIONS.STAFF_LEAVE_VIEW,
      PERMISSIONS.STAFF_LEAVE_MANAGE,
    ],
  },
  {
    id: "4",
    name: "Bqt Service",
    description: "Access to banquet and event services",
    permissions: [
      PERMISSIONS.HALLS_VIEW,
      PERMISSIONS.MEETINGS_VIEW,
      PERMISSIONS.EVENTS_VIEW,
      PERMISSIONS.POLICIES_VIEW,
    ],
  },
  {
    id: "5",
    name: "Account",
    description: "Access to accounting features",
    permissions: [
      PERMISSIONS.DASHBOARD_VIEW,
      PERMISSIONS.DISCOUNTS_VIEW,
      PERMISSIONS.USERS_RATING_VIEW,
      PERMISSIONS.EXTRAS_VIEW,
    ],
  },
]
