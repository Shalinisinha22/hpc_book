"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { PageHeader } from "@/components/page-header"
import { UserService } from "@/lib/user-role-service"
import { PERMISSIONS } from "@/lib/role-permissions"
import { AlertCircle, Check, Edit, Trash, UserPlus, Plus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import axios from "axios"
import { API_ROUTES } from "@/config/api"
import { getAllSidebarPermissions } from "@/utils/get-all-sidebar-permissions"
import { dashboardPermissions, hotelManagementPermissions } from "@/utils/sidebar-permission-groups"

// User and Role types
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}
interface Role {
  _id: string;
  role: string;
  description: string;
  permissions: string[];
}

export default function UserRolesPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("users")
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false)
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [itemToDelete, setItemToDelete] = useState<User | Role | null>(null)
  const [deleteType, setDeleteType] = useState("")

  // Form states
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    password: "",
    roleId: "",
  })

  const [roleForm, setRoleForm] = useState({
    role: "",
    description: "",
    permissions: [] as string[],
  })

  // Fetch all users except those with role 'user'
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_ROUTES.members}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
        },
      })
      // Filter out users with role 'user'
      setUsers(res.data.users.filter((u: User) => u.role !== 'user'))
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load users', variant: 'destructive' })
    }
  }

  // Load data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const [rolesData] = await Promise.all([UserService.getRoles()])
        setRoles(rolesData)
        await fetchUsers()
      } catch (error) {
        console.error("Error loading data:", error)
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [toast])

  // Handle user form submission
  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (selectedUser) {
        // Update existing user
        const dataToUpdate = { ...userForm }

        // If password is empty, don't update it
        if (!dataToUpdate.password) {
          delete dataToUpdate.password
        }

        await axios.put(`${API_ROUTES.members}/${selectedUser._id}`, dataToUpdate, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('auth-token')}` },
        })
        toast({
          title: "Success",
          description: "User updated successfully",
        })
      } else {
        // Create new user
        await axios.post(API_ROUTES.register, {
          name: userForm.name,
          email: userForm.email,
          password: userForm.password,
          role: userForm.roleId, // send role name
        },
      {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth-token')}` },
      })
        toast({
          title: "Success",
          description: "User created successfully",
        })
      }

      // Refresh users list
      await fetchUsers()

      // Close dialog and reset form
      setIsUserDialogOpen(false)
      resetUserForm()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to save user. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle role form submission
  const handleRoleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (selectedRole) {
        // Update existing role (keep as is or update as needed)
        await UserService.updateRole(selectedRole._id, roleForm)
        toast({
          title: "Success",
          description: "Role updated successfully",
        })
      } else {
        // Create new role using /api/roles POST
        await axios.post(API_ROUTES.roles, {
          role: roleForm.role,
          description: roleForm.description,
          permissions: roleForm.permissions,
        }, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('auth-token')}` },
        })
        toast({
          title: "Success",
          description: "Role created successfully",
        })
      }

      // Refresh roles list
      const updatedRoles = await UserService.getRoles()
      setRoles(updatedRoles)

      // Close dialog and reset form
      setIsRoleDialogOpen(false)
      resetRoleForm()
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to save role. Please try again.";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  }

  // Handle delete confirmation
  const handleDelete = async () => {
    try {
      if (deleteType === "user") {
        await axios.delete(`${API_ROUTES.members}/${itemToDelete?._id}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('auth-token')}` },
        })
        toast({
          title: "Success",
          description: "User deleted successfully",
        })
      } else if (deleteType === "role") {
        await UserService.deleteRole(itemToDelete._id)
        const updatedRoles = await UserService.getRoles()
        setRoles(updatedRoles)
        toast({
          title: "Success",
          description: "Role deleted successfully",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to delete. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setItemToDelete(null)
      setDeleteType("")
    }
  }

  // Edit user
  const editUser = (user: User) => {
    setSelectedUser(user)
    setUserForm({
      name: user.name,
      email: user.email,
      password: "", // Don't show password, leave empty to keep existing
      roleId: user.role, // use role string
    })
    setIsUserDialogOpen(true)
  }

  // Edit role
  const editRole = (role: Role) => {
    setSelectedRole(role)
    setRoleForm({
      role: role.role, // use backend field
      description: role.description,
      permissions: [...role.permissions],
    })
    setIsRoleDialogOpen(true)
  }

  // Delete user
  const confirmDeleteUser = (user: User) => {
    setItemToDelete(user)
    setDeleteType("user")
    setIsDeleteDialogOpen(true)
  }

  // Delete role
  const confirmDeleteRole = (role: Role) => {
    setItemToDelete(role)
    setDeleteType("role")
    setIsDeleteDialogOpen(true)
  }

  // Reset user form
  const resetUserForm = () => {
    setSelectedUser(null)
    setUserForm({
      name: "",
      email: "",
      password: "",
      roleId: "",
    })
  }

  // Reset role form
  const resetRoleForm = () => {
    setSelectedRole(null)
    setRoleForm({
      role: "",
      description: "",
      permissions: [] as string[],
    })
  }

  // Toggle permission in role form
  const togglePermission = (permission: string) => {
    setRoleForm((prev) => {
      const permissions = [...prev.permissions]
      if (permissions.includes(permission)) {
        return { ...prev, permissions: permissions.filter((p) => p !== permission) }
      } else {
        return { ...prev, permissions: [...permissions, permission] }
      }
    })
  }



  // Get role name by ID
  const getRoleName = (roleName: string) => {
    const role = roles.find((r) => r.role === roleName)
    return role ? role.role : "Unknown"
  }

  // Check if role is predefined
  const isPredefinedRole = (roleId: string) => {
    // Adjust this logic as needed for your backend
    return ["1", "2", "3", "4", "5"].includes(roleId)
  }

  return (
    <div className="p-6 space-y-6">
      <PageHeader heading="User & Role Management" />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Users</h2>
            <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    resetUserForm()
                    setIsUserDialogOpen(true)
                  }}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{selectedUser ? "Edit User" : "Add New User"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleUserSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={userForm.name}
                      onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userForm.email}
                      onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">
                      Password{" "}
                      {selectedUser && <span className="text-xs text-gray-500">(Leave empty to keep current)</span>}
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={userForm.password}
                      onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                      required={!selectedUser}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <select
                      id="role"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={userForm.roleId}
                      onChange={(e) => setUserForm({ ...userForm, roleId: e.target.value })}
                      required
                    >
                      <option value="">-- Select Role --</option>
                      {roles.map((role) => (
                        <option key={role._id} value={role.role}>
                          {role.role}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsUserDialogOpen(false)
                        resetUserForm()
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">{selectedUser ? "Update User" : "Create User"}</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <Skeleton className="h-8 w-24" />
                </div>
              ))}
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                        No users found. Add your first user to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gold/10 text-gold">
                            {getRoleName(user.role)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => editUser(user)}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => confirmDeleteUser(user)}>
                              <Trash className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )
                  }
                </TableBody>
              </Table>
            </div>
          )
          }
        </TabsContent>

        {/* Roles Tab */}
        <TabsContent value="roles" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Roles</h2>
            <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    resetRoleForm()
                    setIsRoleDialogOpen(true)
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Role
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{selectedRole ? "Edit Role" : "Add New Role"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleRoleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Role Name</Label>
                    <Input
                      id="role"
                      value={roleForm.role}
                      onChange={(e) => setRoleForm({ ...roleForm, role: e.target.value })}
                      required
                      disabled={selectedRole && isPredefinedRole(selectedRole._id)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={roleForm.description}
                      onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                 
                      disabled={selectedRole && isPredefinedRole(selectedRole._id)}
                    />
                  </div>

                  {/* Permissions Section - Improved UI */}
                  <div className="rounded-lg border bg-white shadow-sm p-6 mt-4">
                    <h3 className="text-lg font-semibold mb-4">Assign Page Access</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-medium mb-2 text-gray-700 border-b pb-1">Dashboard Permissions</h4>
                        <div className="space-y-2">
                          {dashboardPermissions.map(({ label, permission }) => (
                            <div key={permission} className="flex items-center space-x-2">
                              <Checkbox
                                id={permission}
                                checked={roleForm.permissions.includes(permission)}
                                onCheckedChange={() => togglePermission(permission)}
                              />
                              <Label htmlFor={permission}>{label}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2 text-gray-700 border-b pb-1">Hotel Management Permissions</h4>
                        <div className="space-y-2">
                          {hotelManagementPermissions.map(({ label, permission }) => (
                            <div key={permission} className="flex items-center space-x-2">
                              <Checkbox
                                id={permission}
                                checked={roleForm.permissions.includes(permission)}
                                onCheckedChange={() => togglePermission(permission)}
                              />
                              <Label htmlFor={permission}>{label}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsRoleDialogOpen(false)
                        resetRoleForm()
                      }}
                    >
                      Cancel
                    </Button>
                    {!(selectedRole && isPredefinedRole(selectedRole._id)) && (
                      <Button type="submit">{selectedRole ? "Update Role" : "Create Role"}</Button>
                    )}
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="p-4 border rounded-lg space-y-2">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex space-x-2 pt-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                        No custom roles found. Add your first role to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    roles.map((role) => (
                      <TableRow key={role._id}>
                        <TableCell className="font-medium">
                          {role.role}
                          {isPredefinedRole(role._id) && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              Default
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{role.description}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              {role.permissions.length} permissions
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => editRole(role)}>
                              {isPredefinedRole(role._id) ? (
                                <>
                                  <Check className="h-4 w-4 mr-1" />
                                  View
                                </>
                              ) : (
                                <>
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </>
                              )
                              }
                            </Button>
                            {!isPredefinedRole(role._id) && (
                              <Button variant="ghost" size="sm" onClick={() => confirmDeleteRole(role)}>
                                <Trash className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )
                  }
                </TableBody>
              </Table>
            </div>

          )}
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              Are you sure you want to delete this {deleteType}?
              {deleteType === "role" && (
                <span className="block mt-2 text-sm text-gray-500">
                  This action cannot be undone. All users with this role will need to be reassigned.
                </span>
              )}
            </p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
