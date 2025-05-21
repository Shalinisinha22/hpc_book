import type React from "react"
import ClientLayout from "../clientLayout"

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClientLayout>{children}</ClientLayout>
}
