"use client"

import type React from "react"

import { useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { PageHeader } from "@/components/page-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { API_ROUTES } from '@/config/api';

export default function SettingsPage() {
  const { toast } = useToast()
  const [isLowestPriceEnabled, setIsLowestPriceEnabled] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Validate form
  const validateForm = () => {
    let valid = true
    const newErrors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }

    if (formData.currentPassword.length < 8) {
      newErrors.currentPassword = "Current password must be at least 8 characters."
      valid = false
    }

    if (formData.newPassword.length < 8) {
      newErrors.newPassword = "New password must be at least 8 characters."
      valid = false
    }

    if (formData.confirmPassword.length < 8) {
      newErrors.confirmPassword = "Confirm password must be at least 8 characters."
      valid = false
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match"
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const token = localStorage.getItem("auth-token");
      if (!token) throw new Error("Not authenticated");
      await axios.put(
        API_ROUTES.changePassword,
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        },
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      toast({
        title: "Password changed successfully",
        description: "Your password has been updated.",
      })
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      // Clear local storage and reload to logout
      localStorage.clear();
      window.location.href = "/login";
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Failed to change password",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle lowest price toggle
  function handleLowestPriceToggle(checked: boolean) {
    setIsLowestPriceEnabled(checked)

    toast({
      title: `Lowest Price ${checked ? "Enabled" : "Disabled"}`,
      description: `The lowest price feature has been ${checked ? "enabled" : "disabled"}.`,
    })
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader heading="Settings" text="Manage your account settings and preferences." />

      <Tabs defaultValue="security" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your password to keep your account secure.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="currentPassword" className="text-sm font-medium">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    placeholder="••••••••"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  {errors.currentPassword && (
                    <p className="text-sm font-medium text-destructive">{errors.currentPassword}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="newPassword" className="text-sm font-medium">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    placeholder="••••••••"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  {errors.newPassword && <p className="text-sm font-medium text-destructive">{errors.newPassword}</p>}
                  <p className="text-sm text-muted-foreground">Password must be at least 8 characters long.</p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm font-medium text-destructive">{errors.confirmPassword}</p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Updating..." : "Update Password"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
