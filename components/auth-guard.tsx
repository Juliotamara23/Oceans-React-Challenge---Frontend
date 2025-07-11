"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

interface AuthGuardProps {
  children: React.ReactNode
}

// Definir rutas públicas que no requieren autenticación
const publicPaths = ["/login", "/register", "/forgot-password"];

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // Redirección y lógica de protección
  useEffect(() => {
    // Si aún está cargando, no hacer nada
    if (isLoading) {
      return;
    }

    // Si no está autenticado Y la ruta actual NO es pública, redirigir a /login
    if (!isAuthenticated && !publicPaths.includes(pathname)) {
      router.push("/login");
    }

    // Si está autenticado Y la ruta actual ES /login, redirigir al dashboard
    if (isAuthenticated && publicPaths.includes(pathname)) {
        router.push("/"); // Redirige al dashboard
    }
  }, [isAuthenticated, isLoading, pathname, router]);


  // Mostrar spinner mientras carga el estado de autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Si la ruta actual es pública, simplemente renderizará los children.
  if (!isAuthenticated && !publicPaths.includes(pathname)) {
    return null; // No renderizar nada mientras se redirige
  }

  return <>{children}</>
}