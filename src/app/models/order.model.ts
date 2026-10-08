import { Product } from './product.model';

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'cancelled';

export interface OrderItem {
  id: string;
  quantity: number;
  products: Product;
}

export interface Order {
  id: string;
  brand_id: string;
  buyer_id: string;
  status: OrderStatus;
  order_items: OrderItem[];
  brands: { name: string };
}