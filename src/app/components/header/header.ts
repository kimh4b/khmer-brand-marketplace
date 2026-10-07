import { Component } from '@angular/core';
import { Auth } from '../../auth';
import { Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
    constructor(public auth:Auth, private router:Router){}

    logout(){
        this.auth.logout();
        this.router.navigate(['/'])
    }
    
}
