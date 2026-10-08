import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Supabase } from '../../supabase';
import { Auth } from '../../auth';
import { Router, RouterLink } from '@angular/router';
import { Brand } from '../../models/brand.model';
import { Product } from '../../models/product.model';
import { Order, OrderStatus} from '../../models/order.model';


@Component({
  selector: 'app-seller-dashboard',
  imports: [FormsModule, RouterLink],
  templateUrl: './seller-dashboard.html',
  styleUrl: './seller-dashboard.css',
})
export class SellerDashboard implements OnInit {
  brand = signal<Brand | null>(null);
  products = signal<Product[]>([]);
  orders = signal<Order[]>([]);
  hasNoBrand = signal(false);

  constructor(
    private supabaseService: Supabase,
    private auth: Auth,
    private router: Router,
  ) {}

  async ngOnInit() {
    const user = this.auth.currentUser();
    if (!user) return;
    const { data, error } = await this.supabaseService.getBrandByOwner(user.id);

    if (data && data.length > 0) {
      const brandData = data[0];
      this.brand.set(brandData);

      const { data: productsData } = await this.supabaseService.client
        .from('products')
        .select('*')
        .eq('brand_id', brandData.id);

      if (productsData) {
        this.products.set(productsData);
      }

      await this.loadOrders(brandData.id);
    } else {
      this.hasNoBrand.set(true);
    }
  }

  getOrderTotal(order: Order): number {
    return order.order_items.reduce(
      (sum, item) => sum + item.quantity * item.products.price, 0);
  }

  async onUpdateStatus(order: Order, newStatus: OrderStatus) {
  const { error } = await this.supabaseService.updateOrderStatus(order.id, newStatus);

  if (!error) {
    this.orders.update(orders =>
      orders.map(o => (o.id === order.id ? { ...o, status: newStatus } : o))
    );
  }
}

  async loadOrders(brandId: string) {
    const { data } = await this.supabaseService.getOrdersByBrand(brandId);
    if (data) {
      this.orders.set(data);
    }
  }
}
