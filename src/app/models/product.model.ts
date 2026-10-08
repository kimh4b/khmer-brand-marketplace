export type StockStatus = 'in_stock' | 'out_of_stock';

export interface Product {
  id: string;
  brand_id: string;
  name: string;
  price: number;
  stock_status: StockStatus;
  photo_url: string;
  size: string;
  category: string;
  description: string;
  brands?: { name: string; status: string };
}