// User type definition
export interface User {
  id: string
  name: string
  email: string
  password: string
  roleId: string
}

// Generate a unique user ID
export function generateUserId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Mock users for testing
export const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@royalbihar.com",
    password: "admin123",
    roleId: "1", // Admin role
  },
  {
    id: "2",
    name: "Front Office Staff",
    email: "frontdesk@royalbihar.com",
    password: "password123",
    roleId: "2", // Front Office role
  },
  {
    id: "3",
    name: "HR Manager",
    email: "hr@royalbihar.com",
    password: "password123",
    roleId: "3", // HR role
  },
  {
    id: "4",
    name: "Banquet Service",
    email: "banquet@royalbihar.com",
    password: "password123",
    roleId: "4", // Bqt Service role
  },
  {
    id: "5",
    name: "Accounts Manager",
    email: "accounts@royalbihar.com",
    password: "password123",
    roleId: "5", // Account role
  },
]
