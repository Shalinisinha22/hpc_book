import { Toaster } from "@/components/toaster"
import type { ReactNode } from "react"

export default function DiningsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Toaster />
    </>
  )
}
