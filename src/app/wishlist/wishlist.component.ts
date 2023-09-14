import { Component, Input } from '@angular/core';
import { WishlistItem } from '../shared/models/wishlist';
import { WishlistService } from './wishlist.service';
import { CartService } from '../cart/cart.service';
import { Product } from '../shared/models/product';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent {
  @Input () product?: Product;
  
  constructor(public wishlistService: WishlistService, private cartService: CartService) { }
  removeItem(id: number){
    this.wishlistService.removeItemFromWishlist(id);
  }

  addItemToCart(item: WishlistItem){
    this.cartService.addItemToCart(item);
  }

}
