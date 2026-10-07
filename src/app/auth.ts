import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class Auth {
currentUser = signal<any>(null);

constructor(){
    const saved = localStorage.getItem('user');
    if(saved){
        const user = JSON.parse(saved);
        this.currentUser.set(user);
    }
}

setUser(user: any){
    this.currentUser.set(user);
    localStorage.setItem('user', JSON.stringify(user))
    
}

logout(){
    this.currentUser.set(null);
    localStorage.removeItem('user');
}
}
