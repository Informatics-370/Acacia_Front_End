import { SubCategory } from "./SalesReportVM"

export interface SupplierReportVM {
    data: SupplierReportCategory[]
    total: number
  }

  export interface SupplierReportCategory {
    supplierId: number
    supplierName: string
    subCategories: SubCategory[]
    total: number
  }
  



