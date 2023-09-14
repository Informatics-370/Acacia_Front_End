import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { AccountComponent } from './account.component';
import { CommonModule } from '@angular/common';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { PersonalDetailsComponent } from './personal-details/personal-details.component';
import { AddressBookComponent } from './address-book/address-book.component';
import { AuthGuard } from '../core/guards/auth.guard';
import { FaqsComponent } from './faqs/faqs.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { OrdersComponent } from './orders/orders.component';
import { ProductReviewsComponent } from './product-reviews/product-reviews.component';
import { ProductReviewDetailsComponent } from './product-review-details/product-review-details.component';

const routes: Routes = [
  {path: '', component: AccountComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'reset-password', canActivate: [AuthGuard], component: ResetPasswordComponent},
  {path: 'personal-details', canActivate: [AuthGuard], component: PersonalDetailsComponent},
  {path: 'address-book', canActivate: [AuthGuard], component: AddressBookComponent},
  {path: 'faqs', canActivate: [AuthGuard], component: FaqsComponent},
  {path: 'forgot-password', component: ForgotPasswordComponent},
  {path: 'orders', canActivate: [AuthGuard], component: OrdersComponent},
  {path: 'orders/:id', canActivate: [AuthGuard], component: OrderDetailsComponent, data: {breadcrumb: {alias: 'orderDetails'}}},
  {path: 'reviews', canActivate: [AuthGuard], component: ProductReviewsComponent},
  {path: 'reviews/:id', canActivate: [AuthGuard], component: ProductReviewDetailsComponent, data: {breadcrumb: {alias: 'reviewDetails'}}},
]
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
