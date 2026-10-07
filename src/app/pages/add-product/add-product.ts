import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Supabase } from '../../supabase';
import { Auth } from '../../auth';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-add-product',
  imports: [FormsModule, RouterLink],
  templateUrl: './add-product.html',
  styleUrl: './add-product.css',
})
export class AddProduct implements OnInit{

	name= '';
	description= '';
	price = 0;
	size = '';
	category = '';
	photoUrl = '';
	errorMessage = '';
	brandId = '';
	hasNoBrand = signal(false);

	constructor(private supabaseService: Supabase, private auth: Auth, private router: Router){}

	async ngOnInit(){
		const user = this.auth.currentUser();
		const {data, error} = await this.supabaseService.getBrandByOwner(user.id);
		if(data && data.length > 0){
			this.brandId = data[0].id;
		}else{
			this.hasNoBrand.set(true);
		}
	}

	async onSubmit(){
		const {data, error} = await this.supabaseService.createProduct(this.brandId, this.name, this.description, this.price, this.size, this.category, this.photoUrl);
		console.log(data);
		console.log(error);
		if(data) {
			this.router.navigate(['/']);
		}else{
			this.errorMessage = "Fail to create product!";
		}
	}
}
