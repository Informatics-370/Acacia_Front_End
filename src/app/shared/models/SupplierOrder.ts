import { Company } from "./Company"
import { Supplier } from "./Supplier"

export interface SupplierOrder {
  id: number
  managerEmail: string
  orderDate: string
  status: string
  orderItems: SupplierOrderItem[]
  total: number
  companyDetails: Company
  supplier: Supplier
}

export interface SupplierOrderItem {
  productId: number
  productName: string
  pictureUrl: string
  price: number
  quantity: number
}

export interface ConfigureSupplierOrder {
  supplierId: number
  orderItems: SupplierOrderItem[]
}



  
  