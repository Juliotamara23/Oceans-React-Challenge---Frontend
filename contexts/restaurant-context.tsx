"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { Product, Order, CartItem } from "@/types"
import { generateId } from "@/lib/utils"

interface RestaurantContextType {
  products: Product[]
  orders: Order[]
  cart: CartItem[]
  addProduct: (product: Omit<Product, "id">) => void
  addToCart: (product: Product) => void
  removeFromCart: (productId: string) => void
  updateCartQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  createOrder: () => void
  getCartTotal: () => number
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined)

// Datos iniciales mockeados
const initialProducts: Product[] = [
  { id: "1", name: "Pizza Margherita", price: 12.5 },
  { id: "2", name: "Hamburguesa Clásica", price: 9.9 },
  { id: "3", name: "Ensalada César", price: 8.5 },
  { id: "4", name: "Pasta Carbonara", price: 11.0 },
  { id: "5", name: "Salmón a la Plancha", price: 18.5 },
]

const initialOrders: Order[] = [
  {
    id: "1",
    date: "2024-01-10T14:30:00Z",
    items: [
      { productId: "1", productName: "Pizza Margherita", quantity: 2, price: 12.5 },
      { productId: "3", productName: "Ensalada César", quantity: 1, price: 8.5 },
    ],
    total: 33.5,
  },
  {
    id: "2",
    date: "2024-01-10T15:45:00Z",
    items: [
      { productId: "2", productName: "Hamburguesa Clásica", quantity: 1, price: 9.9 },
      { productId: "4", productName: "Pasta Carbonara", quantity: 1, price: 11.0 },
    ],
    total: 20.9,
  },
]

export function RestaurantProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [cart, setCart] = useState<CartItem[]>([])

  const addProduct = (productData: Omit<Product, "id">) => {
    const newProduct: Product = {
      id: generateId(),
      ...productData,
    }
    setProducts((prev) => [...prev, newProduct])
  }

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.product.id === product.id)
      if (existingItem) {
        return prev.map((item) => (item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prev, { product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId))
  }

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart((prev) => prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setCart([])
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }

  const createOrder = () => {
    if (cart.length === 0) return

    const newOrder: Order = {
      id: generateId(),
      date: new Date().toISOString(),
      items: cart.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      })),
      total: getCartTotal(),
    }

    setOrders((prev) => [newOrder, ...prev])
    clearCart()
  }

  return (
    <RestaurantContext.Provider
      value={{
        products,
        orders,
        cart,
        addProduct,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        createOrder,
        getCartTotal,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  )
}

export function useRestaurant() {
  const context = useContext(RestaurantContext)
  if (context === undefined) {
    throw new Error("useRestaurant must be used within a RestaurantProvider")
  }
  return context
}
