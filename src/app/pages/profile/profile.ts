import { Component } from '@angular/core';
import { Auth } from '../../auth';
import { Supabase } from '../../supabase';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  name = '';
  email = '';
  errorMessage = '';
  successMessage = '';

  constructor(
    public auth: Auth,
    private supabaseService: Supabase,
  ) {
    const user = this.auth.currentUser();
    if (!user) return;
    this.name = user.name;
    this.email = user.email;
  }

  async onSave() {
    const user = this.auth.currentUser();
    if (!user) return;
    const { data, error } = await this.supabaseService.updateUser(user.id, this.name, this.email);

    if (data) {
      this.auth.setUser({ ...user, name: this.name, email: this.email });
      this.successMessage = 'Profile updated';
      this.errorMessage = '';
    } else {
      this.errorMessage = 'Failed to update profile';
    }
  }
}
