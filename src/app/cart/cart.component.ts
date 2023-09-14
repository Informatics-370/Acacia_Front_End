import { Component } from '@angular/core';
import { CartService } from './cart.service';
import { CartItem } from '../shared/models/cart';
import { Product } from '../shared/models/product';
import { WishlistService } from '../wishlist/wishlist.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
constructor(public cartService: CartService, private wishlistService: WishlistService) { }

incrementQuanity(item: CartItem){ 
  this.cartService.addItemToCart(item);
}
removeItem(event: {id: number, quantity: number}){
  this.cartService.removeItemFromCart(event.id, event.quantity);
}

addItemToWishlist(product: CartItem){
  this.wishlistService.addItemToWishlist(product);
}

}
