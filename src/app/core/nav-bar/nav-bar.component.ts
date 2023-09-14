import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/account/account.service';
import { CartService } from 'src/app/cart/cart.service';
import { WishlistService } from 'src/app/wishlist/wishlist.service';
import { CartItem } from 'src/app/shared/models/cart';
import { WishlistItem } from 'src/app/shared/models/wishlist';
import { User } from 'src/app/shared/models/user';


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {

  user?: User;

  constructor(public cartService: CartService, public accountService: AccountService, public wishlistService: WishlistService) { } 

  getCount(items: CartItem[]){
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }

  getWishlistCount(items: WishlistItem[]){
    return items.length;
  }
}
