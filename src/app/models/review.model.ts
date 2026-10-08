export interface Review {
  id: string;
  brand_id: string;
  buyer_id: string;
  rating: number;
  comment: string;
  users: { name: string };
}