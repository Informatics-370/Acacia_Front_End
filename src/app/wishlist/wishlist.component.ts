import { Component, Input, OnInit } from '@angular/core';
import { WishlistItem } from '../shared/models/wishlist';
import { WishlistService } from './wishlist.service';
import { CartService } from '../cart/cart.service';
import { Product } from '../shared/models/product';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../manager/product.service';
import { take } from 'rxjs';
import { Cart } from '../shared/models/cart';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {
  cart?: Cart | null 

  constructor(public wishlistService: WishlistService, private cartService: CartService, private toaster: ToastrService, private productService: ProductService) { }

  ngOnInit(): void {
    this.cartService.cartSource$.subscribe({
      next: mycart => {
        this.cart = mycart
      },
      error: () => {
        this.cart = null
      }
    })
  }

  removeItem(id: number){
    this.wishlistService.removeItemFromWishlist(id);
  }

  addItemToCart(item: WishlistItem, productId: number){
    this.productService.getProduct(productId).subscribe({
      next: product => {
        const Cartitem = this.cart?.items.find(i => i.id === product.id);
        if(!Cartitem && product.quantity >= 1){
          this.cartService.addItemToCart(item);
        }    
        else if(Cartitem && product.quantity >= (Cartitem.quantity + 1)){
          this.cartService.addItemToCart(item);
        }
        else{
          this.toaster.warning("Sorry, there is not enough stock.")
        }
      },
      error: err => console.log(err)
    })
  }
}
