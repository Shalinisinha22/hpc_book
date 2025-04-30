import { Sidebar } from "@/components/sidebar"

export default function PromoCodesLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeItem="Promo Codes" />
      <div className="flex-1">{children}</div>
    </div>
  )
}
