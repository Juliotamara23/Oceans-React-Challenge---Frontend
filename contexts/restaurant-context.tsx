"use client"

import { createContext, useContext, useState, type ReactNode, useEffect } from "react"
import type { Product, Order, CartItem, CreateProductDto, CreateOrderDto } from "@/types"
import api from "@/lib/api"
// import { generateId } from "@/lib/utils"

interface RestaurantContextType {
  products: Product[]
  orders: Order[]
  cart: CartItem[]
  loading: boolean;
  error: string | null;
  addProduct: (productData: CreateProductDto) => Promise<void>
  addToCart: (product: Product) => void
  removeFromCart: (productId: string) => void
  updateCartQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  createOrder: () => Promise<void>
  getCartTotal: () => number
  fetchProducts: () => Promise<void>;
  fetchOrders: () => Promise<void>;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined)

export function RestaurantProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // --- Funciones de interacción con la API ---

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<Product[]>('/products');
      setProducts(response.data);
    } catch (err: any) {
      console.error("Error fetching products:", err);
      setError(err.response?.data?.message || "Error al cargar productos.");
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData: CreateProductDto) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<Product>('/products', productData);
      setProducts((prev) => [...prev, response.data]);
      
    } catch (err: any) {
      console.error("Error adding product:", err);
      setError(err.response?.data?.message || "Error al añadir producto.");
      throw err; // Re-lanza el error para que el componente que llama lo pueda manejar
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<Order[]>('/orders');
      setOrders(response.data);
    } catch (err: any) {
      console.error("Error fetching orders:", err);
      setError(err.response?.data?.message || "Error al cargar órdenes.");
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async () => {
    if (cart.length === 0) {
      setError("No hay productos en el carrito para crear una orden.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const orderData: CreateOrderDto = {
        items: cart.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      };
      
      const response = await api.post<Order>('/orders', orderData);
      setOrders((prev) => [response.data, ...prev]);
      clearCart(); // Limpiar carrito solo si la orden se creó exitosamente
    } catch (err: any) {
      console.error("Error creating order:", err);
      setError(err.response?.data?.message || "Error al crear la orden.");
      throw err; // Re-lanza el error para el componente que llama
    } finally {
      setLoading(false);
    }
  };

  // --- Funciones de manejo del carrito ---

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

  // --- Cargar datos iniciales al montar el contexto ---
  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  return (
    <RestaurantContext.Provider
      value={{
        products,
        orders,
        cart,
        loading,
        error,
        addProduct,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        createOrder,
        getCartTotal,
        fetchProducts,
        fetchOrders,
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