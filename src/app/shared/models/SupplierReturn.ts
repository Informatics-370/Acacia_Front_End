import { SupplierReturnItem } from "./SupplierReturnItem"

export interface SupplierReturn {
    id: number
    supplierOrderId: number
    managerEmail: string
    description: string
    date: string
    total: number
    returnItems: SupplierReturnItem[]
  }