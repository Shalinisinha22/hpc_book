import "./globals.css"
import { Toaster } from "@/components/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthMiddleware } from '@/components/auth-middleware'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <AuthMiddleware>
            {children}
          </AuthMiddleware>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
