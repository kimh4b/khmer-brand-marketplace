import { Component, OnInit, signal } from '@angular/core';
import { Supabase } from '../../supabase';
import { RouterLink } from '@angular/router';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-browse',
  imports: [RouterLink],
  templateUrl: './browse.html',
  styleUrl: './browse.css',
})
export class Browse implements OnInit{

    products = signal<Product[]>([]);

    constructor(private supabaseService: Supabase){}

    async ngOnInit(){
        const {data, error} = await this.supabaseService.client
        .from('products')
        .select('*, brands!inner(name, status)')
        .eq('brands.status', 'approved');

        if(data){
            this.products.set(data);
        }
    }

}
