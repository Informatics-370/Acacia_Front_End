import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/enviroment';
import { Supplier } from '../shared/models/Supplier';
import { Pagination } from '../shared/models/pagination';
import { specParams } from '../shared/models/specParams';
import { ShopParams } from '../shared/models/shopParams';
import { Product } from '../shared/models/product';
import { ConfigureSupplierOrder, SupplierOrder } from '../shared/models/SupplierOrder';
import { orderParams } from '../shared/models/orderParams';

@Injectable({
  providedIn: 'root'
})
export class SupplierordersService {
  baseUrl = environment.apiUrl
  constructor(private http: HttpClient) { }

  placeOrder(orderRequest?: any){
    return this.http.post<ConfigureSupplierOrder>(this.baseUrl + 'SupplierOrders/PlaceOrder', orderRequest)
  }

  ApproveOrder(id: number, orderRequest?: any){
    return this.http.put<ConfigureSupplierOrder>(this.baseUrl + 'SupplierOrders/ApproveOrder/' + id, orderRequest)
  }

  ConfirmOrderDelivery(id: number, order?: any){
    return this.http.put<ConfigureSupplierOrder>(this.baseUrl + 'SupplierOrders/ConfirmOrderDelivery/' + id, order)
  }

  ConfirmPayment(id: number, data: FormData){
    return this.http.put<any>(this.baseUrl + 'SupplierOrders/ConfirmPayment/' + id, data)
  }

  CancelOrder(id: number){
    return this.http.put<ConfigureSupplierOrder>(this.baseUrl + 'SupplierOrders/CancelOrder/' + id, id)
  }

  getSuppliersOrders(specParams: orderParams){
    let params = new HttpParams();
    params = params.append('sort', specParams.sort);
    params = params.append('pageIndex', specParams.pageNumber);
    params = params.append('pageSize', specParams.pageSize);
    if(specParams.search) params = params.append('search', specParams.search);

    return this.http.get<Pagination<SupplierOrder[]>>(this.baseUrl + 'SupplierOrders', {params: params})
  }

  getSupplierOrder(id: number){
    return this.http.get<SupplierOrder>(this.baseUrl + 'SupplierOrders/' + id);
  }

  getInvoice(id: number) {
    return this.http.get(this.baseUrl + 'SupplierOrders/PrintInvoice/' + id, { observe: 'response', responseType: 'blob' });
  }

  getProofOfPayment(id: number) {
    return this.http.get(this.baseUrl + 'SupplierOrders/PrintPOP/' + id, { observe: 'response', responseType: 'blob' });
  }

  getSuppliers(specParams: specParams){
    let params = new HttpParams();
    params = params.append('sort', specParams.sort);
    params = params.append('pageIndex', specParams.pageNumber);
    params = params.append('pageSize', specParams.pageSize);
    if(specParams.search) params = params.append('search', specParams.search);

    return this.http.get<Pagination<Supplier[]>>(this.baseUrl + 'supplier', {params: params})
  }

  getSupplier(id: number)
  {
    return this.http.get<Supplier>(this.baseUrl + 'supplier/' + id);
  }

  getProducts(shopParams: ShopParams){
    let params = new HttpParams();
    if(shopParams.categoryId > 0) params = params.append('categoryId', shopParams.categoryId);
    if(shopParams.supplierId > 0) params = params.append('supplierId', shopParams.supplierId);
    if(shopParams.typeId > 0) params = params.append('typeId', shopParams.typeId);
    params = params.append('sort', shopParams.sort);
    params = params.append('pageIndex', shopParams.pageNumber);
    params = params.append('pageSize', shopParams.pageSize);
    if(shopParams.search) params = params.append('search', shopParams.search);
    console.log(shopParams)
    return this.http.get<Pagination<Product[]>>(this.baseUrl + 'products', {params: params})
  }
}
