import { z } from "zod"

export const loginSchema = z.object({
  username: z
    .string()
    .min(3, "El usuario debe tener al menos 3 caracteres")
    .max(20, "El usuario no puede exceder 20 caracteres"),
  password: z
    .string()
    .min(4, "La contraseña debe tener al menos 4 caracteres")
    .max(50, "La contraseña no puede exceder 50 caracteres"),
})

export type LoginFormData = z.infer<typeof loginSchema>
