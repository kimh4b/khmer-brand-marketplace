import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from './auth';

export const adminGuard: CanActivateFn = (route, state) => {

  const auth = inject(Auth);
  const router = inject(Router);

  const user = auth.currentUser();
  
  if(user && user.role === 'admin'){
    return true;
  }else{
    router.navigate(['/login']);
    return false;
  }
};
