import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AccountRoutingModule } from './account-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AccountComponent } from './account.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AddressBookComponent } from './address-book/address-book.component';
import { PersonalDetailsComponent } from './personal-details/personal-details.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FaqsComponent } from './faqs/faqs.component';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { OrdersComponent } from './orders/orders.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { ProductReviewsComponent } from './product-reviews/product-reviews.component';
import { ProductReviewDetailsComponent } from './product-review-details/product-review-details.component';
import { CoreModule } from "../core/core.module";



@NgModule({
    declarations: [
        LoginComponent,
        RegisterComponent,
        AccountComponent,
        ResetPasswordComponent,
        AddressBookComponent,
        PersonalDetailsComponent,
        FaqsComponent,
        ForgotPasswordComponent,
        OrdersComponent,
        OrderDetailsComponent,
        ProductReviewsComponent,
        ProductReviewDetailsComponent,
    ],
    imports: [
        CommonModule,
        AccountRoutingModule,
        ModalModule.forRoot(),
        SharedModule,
        AccordionModule.forRoot(),
        CoreModule
    ]
})
export class AccountModule { }
