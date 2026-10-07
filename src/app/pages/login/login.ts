import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Supabase } from '../../supabase';
import { Auth } from '../../auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  
    email = '';
    password = '';
    errorMessage = '';
    constructor(private supabaseService: Supabase, private auth: Auth, private router: Router){}
  

    async onSubmit(){
        const { data, error } = await this.supabaseService.login(this.email, this.password);
    
        if(data && data.length > 0){
            const { password, ...safeUser } = data[0];
            this.auth.setUser(safeUser);
            this.errorMessage = '';
            this.router.navigate(['/'])
        } else {
            this.errorMessage = 'Wrong email or password';
        }
    }
}
