export interface Product {
  id: string;
  name: string;
  price: number;
}

// Interfaz para el payload de creación de producto
export type CreateProductDto = Omit<Product, "id">;

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  total: number;
}

// Interfaz para el payload de creación de orden
export interface CreateOrderDto {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
}