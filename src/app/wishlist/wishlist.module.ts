import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WishlistComponent } from './wishlist.component';
import { WishlistRoutingModule } from './wishlist-routing.module';
import { SharedModule } from '../shared/shared.module';
import { CoreModule } from "../core/core.module";



@NgModule({
    declarations: [
        WishlistComponent
    ],
    imports: [
        CommonModule,
        WishlistRoutingModule,
        SharedModule,
        CoreModule
    ]
})
export class WishlistModule { }
