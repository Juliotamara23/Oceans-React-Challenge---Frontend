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
import { ChefHat, AlertCircle } from "lucide-react"

export function LoginPage() {
  const { login, isLoading } = useAuth()
  const [error, setError] = useState<string>("")

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setError("")

    const success = await login(data)

    if (!success) {
      setError("Usuario o contraseña incorrectos")
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
              {isSubmitting || isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-2">Usuarios de prueba:</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>
                <strong>adminuser</strong> / adminpassword
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
