import * as cuid from "cuid"

export interface WishlistItem {
    id: number
    productName: string
    price: number
    pictureUrl: string
    type: string
    category: string
  }

  export interface Wishlist {
    id: string
    items: WishlistItem[]
  }

  export class Wishlist implements Wishlist {
    id = cuid();
    items: WishlistItem[] = [];
  }

  export interface WishlistTotals {
    shipping: number;
    subtotal: number;
    total: number;
  }