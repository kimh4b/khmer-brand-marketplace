import { Injectable, signal } from '@angular/core';
import { User } from './models/user.model';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  currentUser = signal<User | null>(null);

  constructor() {
    const saved = localStorage.getItem('user');
    if (saved) {
      const user: User = JSON.parse(saved);
      this.currentUser.set(user);
    }
  }

  setUser(user: User) {
    this.currentUser.set(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('user');
  }
}