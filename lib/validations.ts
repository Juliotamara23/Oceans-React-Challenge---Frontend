import { z } from "zod"

export const productSchema = z.object({
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres"),
  price: z.number().min(0.01, "El precio debe ser mayor a cero").max(9999.99, "El precio no puede exceder 9999.99"),
})

export type ProductFormData = z.infer<typeof productSchema>
