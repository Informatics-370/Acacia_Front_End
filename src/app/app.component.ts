import { Component, OnInit } from '@angular/core';
import { CartService } from './cart/cart.service';
import { AccountService } from './account/account.service';
import { Wishlist } from './shared/models/wishlist';
import { WishlistService } from './wishlist/wishlist.service';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbDefinition, BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'Acacia_Front_End';
  breadcrumbs: BreadcrumbDefinition[] = []

  constructor(private cartService: CartService, private accountService: AccountService, private wishlistService: WishlistService, private bcService: BreadcrumbService) 
  { 
  }

  hasDashboardLabel(): boolean {
    return this.breadcrumbs.some(breadcrumb => breadcrumb.label === 'dashboard');
  }

  ngOnInit(): void {
    this.loadCart();
    this.loadCustomer();
    this.loadWishlist();
    this.bcService.breadcrumbs$.subscribe(breadcrumbs => {
      this.breadcrumbs = breadcrumbs;
      console.log(this.breadcrumbs);
    });
  }

  loadCart(){
    const cartId = localStorage.getItem('cart_id');
    if (cartId) this.cartService.getCart(cartId);
  }

  loadWishlist(){
    const wishlistId = localStorage.getItem('wishlist_id');
    if (wishlistId) this.wishlistService.getWishlist(wishlistId);
  }

  loadCustomer(){
    const token = localStorage.getItem('token');
    this.accountService.loadCurrentUser(token).subscribe();
    console.log(this.accountService.currentUser$);
  }
}

