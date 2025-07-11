import type React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface FormFieldProps {
  label: string
  error?: string
  children: React.ReactNode
  required?: boolean
}

export function FormField({ label, error, children, required }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label className={cn(required && "after:content-['*'] after:text-red-500 after:ml-1")}>{label}</Label>
      {children}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  required?: boolean
}

export function InputField({ label, error, required, className, ...props }: InputFieldProps) {
  return (
    <FormField label={label} error={error} required={required}>
      <Input className={cn(error && "border-red-500", className)} {...props} />
    </FormField>
  )
}