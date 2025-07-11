"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InputField } from "@/components/form-field"
import { useAuth } from "@/contexts/auth-context"
import { loginSchema, type LoginFormData } from "@/lib/auth-validations"
import { ChefHat, AlertCircle, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export function LoginPage() {
  const { login, isLoading, isAuthenticated } = useAuth()
  const [error, setError] = useState<string>("")
  const router = useRouter()

  // Redireccionar si ya está autenticado
  if (isAuthenticated) {
    router.push("/");
    return null;
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setError("")

    try {
      const success = await login(data)

      if (!success) {
        setError("Usuario o contraseña incorrectos. Por favor, inténtalo de nuevo.")
      } else {
        // Si el login fue exitoso, AuthContext ya manejará la persistencia.
        router.push("/");
      }
    } catch (err: any) {
      // Este catch solo se ejecutará si la promesa `login` es rechaza
      console.error("Error en el login:", err);
      setError(err.response?.data?.message || "Ocurrió un error inesperado al iniciar sesión.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <ChefHat className="h-12 w-12 text-orange-600" />
          </div>
          <CardTitle className="text-2xl font-bold">RestaurantApp</CardTitle>
          <p className="text-muted-foreground">Inicia sesión para continuar</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <InputField
              label="Usuario"
              placeholder="Ingresa tu usuario"
              error={errors.username?.message}
              required
              {...register("username")}
            />

            <InputField
              label="Contraseña"
              type="password"
              placeholder="Ingresa tu contraseña"
              error={errors.password?.message}
              required
              {...register("password")}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting || isLoading}>
              {isSubmitting || isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Iniciando sesión...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-2">Usuarios de prueba (según tu API):</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>
                <strong>adminuser</strong> / adminpass
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}