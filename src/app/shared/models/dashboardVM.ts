import { Order } from "./Order"

export interface DashboardVM {
    orders: Order[]
    totalSales: number
    activeUsers: number
    totalItemsSold: number
    pendingSupplierOrders: number
  }
  