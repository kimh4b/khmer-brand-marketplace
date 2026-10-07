import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment.development';
import { retry } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Supabase {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  get client() {
    return this.supabase;
  }

  async signup(name: string, email: string, password: string, role: string) {
    const { data, error } = await this.supabase.rpc('signup_user', {
      p_name: name,
      p_email: email,
      p_password: password,
      p_role: role
    });
    return { data, error };
  }

  async login(email: string, password: string) {
    const { data, error } = await this.supabase.rpc('login_user', {
      p_email: email,
      p_password: password
    });
    return { data, error };
  }

  async createBrand(ownerUserId: string, name: string, logo: string, description: string){
    const {data, error} = await this.supabase.from('brands').insert({
      owner_user_id: ownerUserId, 
      name: name,
      logo: logo,
      description: description,
    }).select();

    return {data, error};
  }

  async getBrandByOwner(ownerUserId: string){
    const {data, error} = await this.supabase.from('brands').select('*').eq('owner_user_id', ownerUserId)

    return {data, error};
  }

  async createProduct(brandId: string, name: string, description: string, price: number, size: string, category: string, photoUrl: string){
    const {data, error} = await this.supabase.from('products').insert({
      brand_id: brandId,
      name: name,
      description: description,
      price: price,
      size: size,
      category: category,
      photo_url: photoUrl,
      stock_status: 'in stock',
    }).select();

    return {data, error};
  }

  async createOrder(buyerId: string, brandId: string){
    const {data, error} = await this.supabase.from('orders').insert({
      buyer_id: buyerId,
      brand_id: brandId,
      status: 'pending',
    }).select();

    return {data, error }
  }

  async createOrderItem(orderId: string, productId: string, quantity: number){
    const {data, error} = await this.supabase.from('order_items').insert({
      order_id: orderId,
      product_id: productId,
      quantity: quantity,
    }).select();

    return {data, error};
  }

  async getOrdersByBrand(brandId: string) {
  const { data, error } = await this.supabase
    .from('orders')
    .select('*, order_items(*, products(name, price))')
    .eq('brand_id', brandId)
    .order('created_at', { ascending: false })

  return { data, error };
}

  async updateOrderStatus(orderId: string, newStatus: string){
    const {data, error} = await this.supabase
    .from('orders')
    .update({ status: newStatus})
    .eq('id', orderId)
    .select()

    return {data, error};
  }

  async getOrdersByBuyer(buyerId: string){
    const {data, error} = await this.supabase
    .from('orders')
    .select('*, order_items(*, products(name, price)), brands(name)')
    .eq('buyer_id', buyerId)
    .order('created_at', { ascending: false})

    return {data, error};
  }

  async getPendingBrands(){
    const {data, error} = await this.supabase
    .from('brands')
    .select('*')
    .eq('status', 'pending')

    return {data, error};
  }

  async updateBrandStatus(brandId: string, status: string){
    const {data, error} = await this.supabase
    .from('brands')
    .update({ status })
    .eq('id', brandId)

    return {data, error};
  }

  async getAllBrands(){
    const {data , error} = await this.supabase
    .from('brands')
    .select('*')
    .order('created_at', {ascending: false});

    return {data, error};
  }

  async createReview(buyerId: string, brandId: string, rating: number, comment: string){
    const {data, error} = await this.supabase
    .from('reviews')
    .insert({
      buyer_id: buyerId,
      brand_id: brandId,
      rating: rating,
      comment: comment,
    })
    .select()

    return {data, error};
  }

  async getReviewsByBrand(brandId: string){
    const {data, error} = await this.supabase
    .from('reviews')
    .select('*, users(name)')
    .eq('brand_id', brandId)
    .order('created_at', {ascending: false})

    return {data, error};
  }

  async updateUser(userId: string, name: string, email: string){
    const {data, error} = await this.supabase
    .from('users')
    .update({name, email})
    .eq('id', userId)
    .select();

    return {data, error};
  }

  async updateBrand(brandId: string, name: string, logo: string, description: string){
    const {data, error } = await this.supabase
    .from('brands')
    .update({name, logo, description})
    .eq('id', brandId)
    .select();

    return {data, error};
  }
}