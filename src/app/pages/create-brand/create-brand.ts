import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Supabase } from '../../supabase';
import { Auth } from '../../auth';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-create-brand',
  imports: [FormsModule, RouterLink],
  templateUrl: './create-brand.html',
  styleUrl: './create-brand.css',
})
export class CreateBrand implements OnInit {
  name = '';
  logo = '';
  description = '';
  errorMessage = '';
  loading = signal(true);
  hasBrand = signal(false);
  existingBrand = signal<any>(null);

  constructor(
    private supabaseService: Supabase,
    private auth: Auth,
    private router: Router,
  ) {}

  async ngOnInit() {
    const user = this.auth.currentUser();
    const { data, error } = await this.supabaseService.getBrandByOwner(user.id);
    if (data && data.length > 0) {
      this.hasBrand.set(true);
      this.existingBrand.set(data[0]);
      this.name = data[0].name;
      this.logo = data[0].logo;
      this.description = data[0].description;
    }
    this.loading.set(false);
  }

  async onSubmit() {
    const user = this.auth.currentUser();
    const { data, error } = await this.supabaseService.createBrand(
      user.id,
      this.name,
      this.logo,
      this.description,
    );
    if (data) {
      this.router.navigate(['/']);
    } else {
      this.errorMessage = 'Failed to create brand';
    }
  }

  async onUpdate() {
    const { data, error } = await this.supabaseService.updateBrand(
      this.existingBrand().id,
      this.name,
      this.logo,
      this.description,
    );
    if (data) {
      this.router.navigate(['/seller-dashboard']);
    } else {
      this.errorMessage = 'Failed to update brand';
    }
  }
}
