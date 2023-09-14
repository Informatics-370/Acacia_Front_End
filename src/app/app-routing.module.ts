import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TestErrorComponent } from './core/test-error/test-error.component';
import { NotFoundComponent } from './core/not-found/not-found.component';
import { ServerErrorComponent } from './core/server-error/server-error.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AboutUsComponent } from './about-us/about-us.component';

const routes: Routes = [
  {path: '', component: HomeComponent, data : {breadcrumb: 'Home'}},
  {path: 'test-error', component: TestErrorComponent},
  {path: 'aboutus', component: AboutUsComponent},
  {path: 'not-found', component: NotFoundComponent},
  {path: 'server-error', component: ServerErrorComponent},
  {path: 'shop', loadChildren: () => import('./shop/shop.module').then(mod => mod.ShopModule)},
  {path: 'cart', loadChildren: () => import('./cart/cart.module').then(mod => mod.CartModule)},
  {path: 'wishlist', loadChildren: () => import('./wishlist/wishlist.module').then(mod => mod.WishlistModule)},
  {
    path: 'checkout',
    canActivate: [AuthGuard],
    loadChildren: () => import('./checkout/checkout.module').then(mod => mod.CheckoutModule)
  },
  {
    path: 'account',
    loadChildren: () => import('./account/account.module').then(mod => mod.AccountModule)
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadChildren: () => import('./manager/dashboard.module').then(mod => mod.DashboardModule),
    data : {breadcrumb: 'dashboard'}
  },
  {path: '**', redirectTo: '', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
