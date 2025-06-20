import { v4 as uuidv4 } from "uuid"
import { MOCK_USERS, type User, generateUserId } from "./user-model"
import axios from "axios"
import { API_ROUTES } from "@/config/api"

// In-memory storage for users
let users = [...MOCK_USERS]

// Add Role type for API usage
export interface Role {
  _id: string;
  role: string;
  description: string;
  permissions: string[];
}

export const UserService = {
  // User operations
  getUsers: async (): Promise<User[]> => {
    return [...users]
  },

  getUserById: async (id: string): Promise<User | undefined> => {
    return users.find((user) => user.id === id)
  },

  createUser: async (userData: Omit<User, "id">): Promise<User> => {
    // Check if email already exists
    if (users.some((user) => user.email === userData.email)) {
      throw new Error("Email already in use")
    }

    const newUser: User = {
      id: generateUserId(),
      ...userData,
    }

    users.push(newUser)
    return newUser
  },

  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    const userIndex = users.findIndex((user) => user.id === id)

    if (userIndex === -1) {
      throw new Error("User not found")
    }

    // Check if email is being updated and is already in use
    if (userData.email && userData.email !== users[userIndex].email) {
      if (users.some((user) => user.email === userData.email)) {
        throw new Error("Email already in use")
      }
    }

    const updatedUser = {
      ...users[userIndex],
      ...userData,
    }

    users[userIndex] = updatedUser
    return updatedUser
  },

  deleteUser: async (id: string): Promise<void> => {
    const userIndex = users.findIndex((user) => user.id === id)

    if (userIndex === -1) {
      throw new Error("User not found")
    }

    users.splice(userIndex, 1)
  },

  // Role operations (use backend API)
  getRoles: async (): Promise<Role[]> => {
    const res = await axios.get(API_ROUTES.roles, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('auth-token')}` },
    })
    return res.data.roles || res.data // adjust if API returns { roles: [...] }
  },

  getRoleById: async (id: string): Promise<Role | undefined> => {
    const res = await axios.get(`${API_ROUTES.roles}/${id}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('auth-token')}` },
    })
    return res.data.role || res.data
  },

  createRole: async (roleData: { role: string; description?: string; permissions: string[] }): Promise<Role> => {
    const res = await axios.post(`${API_ROUTES.roles}`, roleData, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('auth-token')}` },
    })
    return res.data.role || res.data
  },

  updateRole: async (id: string, roleData: { role: string; description?: string; permissions: string[] }): Promise<Role> => {
    const res = await axios.put(`${API_ROUTES.roles}/${id}`, roleData, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('auth-token')}` },
    })
    return res.data.role || res.data
  },

  deleteRole: async (id: string): Promise<void> => {
    await axios.delete(`${API_ROUTES.roles}/${id}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('auth-token')}` },
    })
  },

  // Reset data (for testing)
  resetData: () => {
    users = [...MOCK_USERS]
  },
}

export const RoleService = {
  getRoles: UserService.getRoles,
  createRole: UserService.createRole,
  updateRole: UserService.updateRole,
  deleteRole: UserService.deleteRole,
}
