import { v4 as uuidv4 } from "uuid"
import { MOCK_USERS, type User, generateUserId } from "./user-model"
import { PREDEFINED_ROLES, type Role } from "./role-permissions"

// In-memory storage for users and roles
let users = [...MOCK_USERS]
let roles = [...PREDEFINED_ROLES]

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

    // Check if role exists
    if (!roles.some((role) => role.id === userData.roleId)) {
      throw new Error("Invalid role")
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

    // Check if role is being updated and exists
    if (userData.roleId && !roles.some((role) => role.id === userData.roleId)) {
      throw new Error("Invalid role")
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

  // Role operations
  getRoles: async (): Promise<Role[]> => {
    return [...roles]
  },

  getRoleById: async (id: string): Promise<Role | undefined> => {
    return roles.find((role) => role.id === id)
  },

  getRoleWithPermissions: async (roleId: string): Promise<Role | undefined> => {
    return roles.find((role) => role.id === roleId)
  },

  createRole: async (roleData: Omit<Role, "id">): Promise<Role> => {
    const newRole: Role = {
      id: uuidv4(),
      ...roleData,
    }

    roles.push(newRole)
    return newRole
  },

  updateRole: async (id: string, roleData: Partial<Role>): Promise<Role> => {
    const roleIndex = roles.findIndex((role) => role.id === id)

    if (roleIndex === -1) {
      throw new Error("Role not found")
    }

    // Check if this is a predefined role (1-5)
    if (["1", "2", "3", "4", "5"].includes(id)) {
      throw new Error("Cannot modify predefined roles")
    }

    const updatedRole = {
      ...roles[roleIndex],
      ...roleData,
    }

    roles[roleIndex] = updatedRole
    return updatedRole
  },

  deleteRole: async (id: string): Promise<void> => {
    const roleIndex = roles.findIndex((role) => role.id === id)

    if (roleIndex === -1) {
      throw new Error("Role not found")
    }

    // Check if this is a predefined role (1-5)
    if (["1", "2", "3", "4", "5"].includes(id)) {
      throw new Error("Cannot delete predefined roles")
    }

    // Check if any users are using this role
    if (users.some((user) => user.roleId === id)) {
      throw new Error("Cannot delete role that is assigned to users")
    }

    roles.splice(roleIndex, 1)
  },

  // Reset data (for testing)
  resetData: () => {
    users = [...MOCK_USERS]
    roles = [...PREDEFINED_ROLES]
  },
}

export const RoleService = {
  getRoles: async (): Promise<Role[]> => {
    return UserService.getRoles()
  },

  createRole: async (roleData: Omit<Role, "id">): Promise<Role> => {
    return UserService.createRole(roleData)
  },

  updateRole: async (id: string, roleData: Partial<Role>): Promise<Role> => {
    return UserService.updateRole(id, roleData)
  },

  deleteRole: async (id: string): Promise<void> => {
    return UserService.deleteRole(id)
  },
}
