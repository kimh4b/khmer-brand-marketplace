import { Routes } from '@angular/router';
import { Browse } from './pages/browse/browse';
import { Login } from './pages/login/login';
import { Signup } from './pages/signup/signup';
import { ProductDetail } from './pages/product-detail/product-detail';
import { CreateBrand } from './pages/create-brand/create-brand';
import { AddProduct } from './pages/add-product/add-product';
import { authGuard } from './auth-guard';
import { SellerDashboard } from './pages/seller-dashboard/seller-dashboard';
import { MyOrders } from './pages/my-orders/my-orders';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { adminGuard } from './admin-guard';
import { Profile } from './pages/profile/profile';

export const routes: Routes = [
    { path: '', component: Browse },
    { path: 'login', component: Login },
    { path: 'signup', component: Signup },
    { path: 'product/:id', component: ProductDetail },
    { path: 'create-brand', component: CreateBrand, canActivate: [authGuard]},
    { path: 'add-product', component: AddProduct, canActivate: [authGuard]},
    { path: 'seller-dashboard', component: SellerDashboard, canActivate: [authGuard]},
    { path: 'my-orders', component: MyOrders, canActivate: [authGuard]},
    { path: 'admin-dashboard', component: AdminDashboard, canActivate: [adminGuard]},
    { path: 'profile', component: Profile, canActivate: [authGuard] },
];
