import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { RestaurantProvider } from "@/contexts/restaurant-context"
import { AuthProvider } from "@/contexts/auth-context"
import { AuthGuard } from "@/components/auth-guard"
import { Header } from "@/components/header"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Restaurant Management System",
  description: "Sistema de gestión para restaurantes",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="h-full">
      <body className={`${inter.className} flex h-full`}>
        <AuthProvider>
          <AuthGuard>
            <RestaurantProvider>
              <SidebarProvider>
                <AppSidebar />
                <main className="flex-1 flex flex-col">
                  <Header />
                  <div className="p-6 flex-1 overflow-auto">
                    {children}
                  </div>
                </main>
              </SidebarProvider>
            </RestaurantProvider>
          </AuthGuard>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  )
}