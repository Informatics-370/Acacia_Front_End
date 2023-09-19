import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from 'src/environments/enviroment';
import { Cart, CartItem, CartTotals } from '../shared/models/cart';
import { HttpClient } from '@angular/common/http';
import { Product } from '../shared/models/product';
import { Wishlist, WishlistItem } from '../shared/models/wishlist';
import { DeliveryMethod } from '../shared/models/deliveryMethod';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  baseUrl = environment.apiUrl;
  private cartSource = new BehaviorSubject<Cart | null>(null);
  cartSource$ = this.cartSource.asObservable();
  private cartTotalSource = new BehaviorSubject<CartTotals | null>(null);
  cartTotalSource$ = this.cartTotalSource.asObservable();


  constructor(private http: HttpClient) { }

  setShippingPrice(deliveryMethod: DeliveryMethod){
    const cart = this.getCurrentCartValue();
    if(cart) {
      cart.shippingPrice = deliveryMethod.price
      cart.deliveryMethodId = deliveryMethod.id
      this.setCart(cart)
    }
  }

  createPaymentIntent(){
    return this.http.post<Cart>(this.baseUrl + 'payments/' + this.getCurrentCartValue()?.id, {})
    .pipe(
      map(cart => {
        this.cartSource.next(cart)
        console.log(cart)
      })
    )
  }

  getCart(id: string) {
    return this.http.get<Cart>(this.baseUrl + 'basket?id=' + id).subscribe({
      next: cart => {
        this.cartSource.next(cart);
        this.calculateTotals();
      }
    })
  }

  setCart(cart: Cart) {
    return this.http.post<Cart>(this.baseUrl + 'basket', cart).subscribe({
      next: () => {
        this.cartSource.next(cart);
        this.calculateTotals();
      }
    })
  }

  getCurrentCartValue(){
    return this.cartSource.value;
  }

  addItemToCart(item: Product | CartItem | any, quantity = 1){
    if(this.isProduct(item)) item = this.mapProductItemToCartItem(item);
    if(this.isWishlistItem(item)) item = this.mapWishlistItemToCartItem(item);
    const cart = this.getCurrentCartValue() ?? this.createCart();
    cart.items = this.addOrUpdateItem(cart.items, item, quantity);
    this.setCart(cart);
  }

  removeItemFromCart(id: number, quantity = 1){
    const cart = this.getCurrentCartValue();
    if(!cart) return;
    const item = cart.items.find(i => i.id === id);
    if (item) {
      item.quantity -= quantity;
      if(item.quantity === 0) {
        cart.items = cart.items.filter(i => i.id !== id);
      }
      if(cart.items.length > 0) this.setCart(cart);
      else this.deleteCart(cart);
    }
  }
  
  deleteCart(cart: Cart) {
    return this.http.delete(this.baseUrl + 'basket?id=' + cart.id).subscribe({
      next: () => {
        this.deleteLocalCart()
      }
    })
  }

  deleteLocalCart(){
    this.cartSource.next(null);
    this.cartTotalSource.next(null);
    localStorage.removeItem('cart_id');
  }
  
  VerifyCartStock(cartId: string){
    return this.http.get<boolean>(this.baseUrl + 'Orders/VerifyCartStock/' + cartId)
  }

  private mapProductItemToCartItem(item: Product): CartItem {
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
      quantity: 0,
      pictureUrl: item.pictureUrl,
      type: item.productType,
      category: item.productCategory
    }
  }

  private mapWishlistItemToCartItem(item: WishlistItem): CartItem {
    return {
      id: item.id,
      productName: item.productName,
      price: item.price,
      quantity: 0,
      pictureUrl: item.pictureUrl,
      type: item.type,
      category: item.category
    }
  }

  private addOrUpdateItem(items: CartItem[], itemToAdd: CartItem, quantity: number): CartItem[] {
    const item = items.find(i => i.id === itemToAdd.id);
    if (item) item.quantity += quantity;
    else {
      itemToAdd.quantity = quantity;
      items.push(itemToAdd);
    }
    return items;
  }

  private createCart(): Cart {
    const cart = new Cart();
    localStorage.setItem('cart_id', cart.id);
    return cart;
  }

  private calculateTotals(){
    const cart = this.getCurrentCartValue();
    if(!cart) return;
    const subtotal = cart.items.reduce((prev, curr) => (curr.price * curr.quantity) + prev, 0);
    const total = cart.shippingPrice + subtotal; 
    this.cartTotalSource.next({shipping: cart.shippingPrice, total, subtotal});
  }

  private isProduct(item: CartItem | Product | WishlistItem): item is Product {
    return (item as Product).productType !== undefined;
  }

  private isWishlistItem(item: CartItem | WishlistItem): item is WishlistItem {
    return (item as WishlistItem).type !== undefined;
  }
}
