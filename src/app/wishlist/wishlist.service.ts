import { Injectable } from '@angular/core';
import { Wishlist, WishlistItem, WishlistTotals } from '../shared/models/wishlist';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/enviroment';
import { Product } from '../shared/models/product';
import { CartService } from '../cart/cart.service';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  baseUrl = environment.apiUrl;
  private wishlistSource = new BehaviorSubject<Wishlist | null>(null);
  wishlistSource$ = this.wishlistSource.asObservable();
  private wishlistTotalSource = new BehaviorSubject<WishlistTotals | null>(null);
  wishlistTotalSource$ = this.wishlistTotalSource.asObservable();

  constructor(private http: HttpClient, private cartService: CartService) { }

  getWishlist(id: string) {
    return this.http.get<Wishlist>(this.baseUrl + 'wishlist?id=' + id).subscribe({
      next: wishlist => {
        this.wishlistSource.next(wishlist);
        // this.calculateTotals();
      }
    })
  }

  setWishlist(wishlist: Wishlist) {
    return this.http.post<Wishlist>(this.baseUrl + 'wishlist', wishlist).subscribe({
      next: () => {
        this.wishlistSource.next(wishlist);
        // this.calculateTotals();
      }
    })
  }

  getCurrentWishlistValue(){
    return this.wishlistSource.value;
  }

  addItemToWishlist(item: Product | WishlistItem){
    if(this.isProduct(item)) item = this.mapProductItemToWishlistItem(item);
    const wishlist = this.getCurrentWishlistValue() ?? this.createWishlist();
    wishlist.items = this.addWishlistHelper(wishlist.items, item);
    this.setWishlist(wishlist);
  }

  private addWishlistHelper(items: WishlistItem[], itemToAdd: WishlistItem): WishlistItem[] {
    const item = items.find(i => i.id === itemToAdd.id);
    if (item) return items;
    else {
      items.push(itemToAdd);
    }
    return items;
  }

  removeItemFromWishlist(id: number){
    const wishlist = this.getCurrentWishlistValue();
    if(!wishlist) return;
    const item = wishlist.items.find(i => i.id === id);
    if (item) {
      wishlist.items = wishlist.items.filter(i => i.id !== id);
      if(wishlist.items.length > 0) this.setWishlist(wishlist);
      else this.deleteWishlist(wishlist);
    }
  }
  
  deleteWishlist(wishlist: Wishlist) {
    return this.http.delete(this.baseUrl + 'wishlist?id=' + wishlist.id).subscribe({
      next: () => {
        this.wishlistSource.next(null);
        this.wishlistTotalSource.next(null);
        localStorage.removeItem('wishlist_id');
      }
    })
  }

  private mapProductItemToWishlistItem(item: Product): WishlistItem {
    var price = 0
    if(item.promotion){
      price = item.price * (1 - item.promotion/100)
    }
    else{
      price = item.price
    }
    return {
      id: item.id,
      productName: item.name,
      price: price,
      pictureUrl: item.pictureUrl,
      type: item.productType,
      category: item.productCategory
    }
  }

  private createWishlist(): Wishlist {
    const wishlist = new Wishlist();
    localStorage.setItem('wishlist_id', wishlist.id);
    return wishlist;
  }

  private isProduct(item: WishlistItem | Product): item is Product {
    return (item as Product).productType !== undefined;
  }
}
