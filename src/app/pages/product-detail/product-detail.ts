import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Supabase } from '../../supabase';
import { Auth } from '../../auth';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product.model';
import { Review } from '../../models/review.model';

@Component({
  selector: 'app-product-detail',
  imports: [FormsModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail implements OnInit {
  product = signal<Product | null>(null);
  quantity = 1;
  errorMessage = signal('');
  successMessage = signal('');
  reviews = signal<Review[]>([]);

  constructor(
    private route: ActivatedRoute,
    private supabaseService: Supabase,
    private auth: Auth,
  ) {}

  async ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id');
    const { data, error } = await this.supabaseService.client
      .from('products')
      .select('*, brands(name)')
      .eq('id', productId)
      .single();
    if (data) {
      this.product.set(data);
      const { data: reviewsData } = await this.supabaseService.getReviewsByBrand(data.brand_id);
      if (reviewsData) {
        this.reviews.set(reviewsData);
      }
    }
  }

  async onOrder() {
    const user = this.auth.currentUser();
    if (!user) return;
    const product = this.product();
if (!product) return;
    const { data, error } = await this.supabaseService.createOrder(
      user.id,
      product.brand_id,
    );
    if (data) {
      const newOrderId = data[0].id;
      
      const { data: itemData, error: itemError } = await this.supabaseService.createOrderItem(
        newOrderId,
        product.id,
        this.quantity,
      );
      if (itemData) {
        this.successMessage.set('Thank you for your order!');
      } else {
        this.errorMessage.set('Fail to place an order :(');
      }
    } else {
      this.errorMessage.set('Fail to place an order :(');
    }
  }
}
