export interface SalesReportVM {
    data: ReportCategory[]
    total: number
    deliveryCosts: number
  }
  
  export interface ReportCategory {
    categoryId: number
    categoryName: string
    subCategories: SubCategory[],
    total: number
  }
  
  export interface SubCategory {
    productId: number
    productName: string
    total: number
  }