import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthWrapper } from '@/components/auth-wrapper'
import { Toaster } from '@/components/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Hotel Patliputra Continental - Management System',
  description: 'Hotel management system for Hotel Patliputra Continental',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthWrapper>
          {children}
          <Toaster />
        </AuthWrapper>
      </body>
    </html>
  )
}