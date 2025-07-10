export interface Product {
  id: string;
  name: string;
  price: string;
}

// Interfaz para el payload de creación de producto
export type CreateProductDto = Omit<Product, "id">;

export interface CartItem {
  product: Product;
  quantity: number;
}

// Interfaz para los ítems tal como vienen de la API en `orderProducts`
export interface APIOrderItem {
  id: string;
  product: Product;
  quantity: number;
  priceAtPurchase: string;
}

// Interfaz de la orden tal como viene de la API
export interface Order {
  id: string;
  orderDate: string;
  total: string;
  orderProducts: APIOrderItem[];
}

// Interfaz para el payload de creación de orden
export interface CreateOrderDto {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
}