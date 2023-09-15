import { Component } from '@angular/core';
import { CartService } from './cart.service';
import { CartItem } from '../shared/models/cart';
import { Product } from '../shared/models/product';
import { WishlistService } from '../wishlist/wishlist.service';
import { ProductService } from '../manager/product.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
constructor(public cartService: CartService, private wishlistService: WishlistService, private productService: ProductService, private toaster: ToastrService, private router: Router) { }

incrementQuanity(item: CartItem){ 
  this.productService.getProduct(item.id).subscribe({
    next: product => {
      if(product && product.quantity >= (item.quantity + 1)){
        this.cartService.addItemToCart(item);
      }
      else{
        this.toaster.warning("Sorry, there is not enough stock.")
      }
    },
    error: err => console.log(err)
  })

}
removeItem(event: {id: number, quantity: number}){
  this.cartService.removeItemFromCart(event.id, event.quantity);
}

addItemToWishlist(product: CartItem){
  this.wishlistService.addItemToWishlist(product);
}

verifyCartStock(cartId: string){
  this.cartService.VerifyCartStock(cartId).subscribe({
    next: () => this.router.navigateByUrl("/checkout"),
    error: error => console.log(error)
  })
}

}
