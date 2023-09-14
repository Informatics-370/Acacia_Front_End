import { Product } from "./product"

export interface GiftBoxAddVM {
    name: string
    description: string
    giftBoxImage: string
    products: Product[]
    price: number
    packagingCosts: number
}