import { Component, OnInit, signal } from '@angular/core';
import { Supabase } from '../../supabase';
import { Auth } from '../../auth';

@Component({
  selector: 'app-admin-dashboard',
  imports: [],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  allBrands = signal<any[]>([]);

  constructor(
    private supabaseService: Supabase,
    private auth: Auth,
  ) {}

  async ngOnInit() {
    const { data } = await this.supabaseService.getAllBrands();
    if (data) {
      this.allBrands.set(data);
    }
  }

  async onUpdateStatus(brand: any, status: string) {
    const { error } = await this.supabaseService.updateBrandStatus(brand.id, status);
    if (!error) {
      this.allBrands.update((brands) =>
        brands.map((b) => (b.id === brand.id ? { ...b, status } : b)),
      );
    }
  }
}
