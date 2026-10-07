import { Component } from '@angular/core';
import { Supabase } from '../../supabase';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [FormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})

export class Signup {

    name = '';
    email = '';
    password = '';
    role = '';


    constructor(private supabaseService : Supabase, private router: Router){}

    errorMessage = '';

    async onSubmit(){
        const { data, error} = await this.supabaseService.signup(this.name, this.email, this.password, this.role);
        if(data){
            this.router.navigate(['/login']);
        }
        if(error){
            if(error.code === '23505'){
                this.errorMessage = 'This email is already registed.';
            } else {
                this.errorMessage = 'Soomething sent wrong. Please try again';
            }
        } else {
            this.errorMessage = '';
            console.log('Signup successful:', data);
        }
    }
}
