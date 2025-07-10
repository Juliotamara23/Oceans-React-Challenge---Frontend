export interface Product {
  id: string
  name: string
  price: number
}

export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  price: number
}

export interface Order {
  id: string
  date: string
  items: OrderItem[]
  total: number
}

export interface CartItem {
  product: Product
  quantity: number
}
