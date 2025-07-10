"use client"
import { useRestaurant } from "@/contexts/restaurant-context"
import { ProductCard } from "@/components/product-card"
import { OrderSummary } from "@/components/order-summary"
import { ShoppingCart } from "lucide-react"

export default function CreateOrderPage() {
  const { products, cart, addToCart, updateCartQuantity } = useRestaurant()

  const getProductQuantity = (productId: string) => {
    const cartItem = cart.find((item) => item.product.id === productId)
    return cartItem ? cartItem.quantity : 0
  }

  const handleAddProduct = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    if (product) {
      addToCart(product)
    }
  }

  const handleUpdateQuantity = (productId: string, change: number) => {
    const currentQuantity = getProductQuantity(productId)
    const newQuantity = currentQuantity + change
    updateCartQuantity(productId, newQuantity)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Crear Orden</h1>
        <p className="text-muted-foreground">Selecciona productos y cantidades para crear una nueva orden</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Catálogo de Productos</h2>
            {products.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No hay productos disponibles</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    quantity={getProductQuantity(product.id)}
                    onAdd={() => handleAddProduct(product.id)}
                    onRemove={() => handleUpdateQuantity(product.id, -1)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  )
}
