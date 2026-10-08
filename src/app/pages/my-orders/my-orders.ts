import { Component, OnInit, signal } from '@angular/core';
import { Supabase } from '../../supabase';
import { Auth } from '../../auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-orders',
  imports: [],
  templateUrl: './my-orders.html',
  styleUrl: './my-orders.css',
})
export class MyOrders implements OnInit {
  orders = signal<any[]>([]);
  myReviews = signal<any[]>([]);

  constructor(
    private supabaseService: Supabase,
    private auth: Auth,
    private router: Router,
  ) {}

  async ngOnInit() {
    const user = this.auth.currentUser();
    if (!user) return;
    const { data } = await this.supabaseService.getOrdersByBuyer(user.id);
    if (data) {
      this.orders.set(data);
    }

    const { data: reviewsData } = await this.supabaseService.client
      .from('reviews')
      .select('brand_id')
      .eq('buyer_id', user.id);
    if (reviewsData) {
      this.myReviews.set(reviewsData);
    }
  }

  hasReviewed(brandId: string): boolean {
    return this.myReviews().some(r => r.brand_id === brandId);
  }

  async onReview(order: any, rating: number, comment: string) {
    const user = this.auth.currentUser();
    if (!user) return;
    const { data } = await this.supabaseService.createReview(
      user.id,
      order.brand_id,
      rating,
      comment,
    );
    if (data) {
      this.myReviews.update(reviews => [...reviews, { brand_id: order.brand_id }]);
    }
  }
}