import { GiftBoxPrice } from "./GiftBoxPrice"
import { Product } from "./product"

export interface GiftBox{
    id: number,
    name: string
    description: string
    giftBoxImage: string
    products: Product[]
    price: number
    packagingCosts: number
}