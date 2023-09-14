import { ReturnItem } from "./ReturnItem"

export interface CustomerReturn {
    id: number
    orderId: number
    customerEmail: string
    description: string
    date: string
    total: number
    returnItems: ReturnItem[]
  }