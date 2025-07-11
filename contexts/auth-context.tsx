"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User, LoginInput, UserRole } from "@/types/auth"
import api from "@/lib/api"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (credentials: LoginInput) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [authToken, setAuthToken] = useState<string | null>(null);

  // Verificar si hay una sesión guardada y el token al cargar
  useEffect(() => {
    const savedToken = localStorage.getItem("restaurant-auth-token");
    const savedUser = localStorage.getItem("restaurant-user");

    if (savedToken && savedUser) {
      try {
        const parsedUser: User = JSON.parse(savedUser);
        setUser(parsedUser);
        setAuthToken(savedToken);
      } catch (error) {
        console.error("Error parsing saved user or token:", error);
        localStorage.removeItem("restaurant-user");
        localStorage.removeItem("restaurant-auth-token");
      }
    }
    setIsLoading(false);
  }, []);

  // useEffect para configurar/limpiar el token de Axios cuando authToken cambie
  useEffect(() => {
    if (authToken) {
      api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [authToken]);


  const login = async (credentials: LoginInput): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Asume que tu API de login es POST /auth/login y devuelve { accessToken: "...", user: {...} }
      const response = await api.post<{ accessToken: string, user: User }>('/auth/login', credentials);

      const { accessToken, user: apiUser } = response.data;

      // Almacenar token y usuario
      localStorage.setItem("restaurant-auth-token", accessToken);
      localStorage.setItem("restaurant-user", JSON.stringify(apiUser));

      setAuthToken(accessToken); // Actualizar estado del token
      setUser(apiUser); // Actualizar estado del usuario

      return true;
    } catch (error: any) {
      console.error("Login failed:", error.response?.data?.message || error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  const logout = () => {
    setUser(null);
    setAuthToken(null);
    localStorage.removeItem("restaurant-user");
    localStorage.removeItem("restaurant-auth-token");
    // Opcional: Redirigir a la página de login aquí o en un componente superior
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}