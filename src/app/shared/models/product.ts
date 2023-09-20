import { Type } from './type';
import { Supplier } from "./Supplier";
import { Category } from "./category";

export interface Product {
    id: number;
    name: string;
    description: string;
    pictureUrl: any;
    price: number;
    productType: any;
    productCategory: any;
    promotion: number;
    supplier: any;
    quantity: number;
    tresholdValue: number;
}

export interface ProductDto {
    id: number
    name: string
    description: string
    price: number
    promotion: number
    productCategory: Category
    productType: Type
    supplier: Supplier
    pictureUrl: string
    qrCode: any
    quantity: number
    tresholdValue: number
  }

