import { OrderAddress } from "./OrderAddress"
import { Vat } from "./Vat"
import { User_Address } from "./user"

export interface Order {
    id: number
    customerEmail: string
    orderDate: string
    shipToAddress: OrderAddress
    deliveryMethod: string
    shippingPrice: number
    savings: number
    orderType: string
    orderItems: OrderItem[]
    subTotal: number
    groupElephantDiscount: number
    total: number
    vat: Vat
    status: string
  }
  export interface OrderToAdd {
    basketId: string
    deliveryMethodId: number
    orderTypeId: number
    shipToAddress: OrderAddress
  }



  export interface OrderItem {
    productId: number
    productName: string
    pictureUrl: string
    promotion: number
    price: number
    quantity: number
  }

  
