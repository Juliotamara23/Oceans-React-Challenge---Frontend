"use client"
import type { Product } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { Plus, Minus } from "lucide-react"

interface ProductCardProps {
  product: Product
  quantity?: number
  onAdd?: () => void
  onRemove?: () => void
  onQuantityChange?: (quantity: number) => void
  showControls?: boolean
}

export function ProductCard({
  product,
  quantity = 0,
  onAdd,
  onRemove,
  onQuantityChange,
  showControls = true,
}: ProductCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">{product.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold text-green-600">{formatCurrency(product.price)}</p>
      </CardContent>
      {showControls && (
        <CardFooter className="flex items-center justify-between">
          {quantity > 0 ? (
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" onClick={onRemove} className="h-8 w-8 bg-transparent">
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-medium min-w-[2rem] text-center">{quantity}</span>
              <Button variant="outline" size="icon" onClick={onAdd} className="h-8 w-8 bg-transparent">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button onClick={onAdd} className="w-full">
              Agregar
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  )
}
