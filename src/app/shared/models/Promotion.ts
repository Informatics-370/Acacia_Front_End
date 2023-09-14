import { Product } from "./product"

export interface Promotion {
    id: number
    name: string
    description: string
    percentage: number
    isActive: boolean
    products: Product[]
  }