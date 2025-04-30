import type { ReactNode } from "react"

interface PageHeaderProps {
  heading: string
  text?: string
  children?: ReactNode
}

export function PageHeader({ heading, text, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-6 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-semibold">{heading}</h1>
        {text && <p className="text-sm text-gray-500 mt-1">{text}</p>}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  )
}
