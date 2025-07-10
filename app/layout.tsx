import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { RestaurantProvider } from "@/contexts/restaurant-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Restaurant Management System",
  description: "Sistema de gestión para restaurantes",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <RestaurantProvider>
          <SidebarProvider>
            <AppSidebar />
            <main className="flex-1">
              <div className="border-b p-4">
                <SidebarTrigger />
              </div>
              <div className="p-6">{children}</div>
            </main>
          </SidebarProvider>
        </RestaurantProvider>
      </body>
    </html>
  )
}
