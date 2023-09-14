import { ReturnItem } from "./ReturnItem"

export interface LogReturn {
    orderId: number
    customerEmail: string
    description: string
    returnItems: ReturnItem[]
  }