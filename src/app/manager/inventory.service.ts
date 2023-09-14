import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/enviroment';
import { writeOffParams } from '../shared/models/writeOffParams';
import { WriteOff } from '../shared/models/WriteOff';
import { Pagination } from '../shared/models/pagination';
import { ShopParams } from '../shared/models/shopParams';
import { Product } from '../shared/models/product';
import { LogReturn } from '../shared/models/LogReturn';
import { specParams } from '../shared/models/specParams';
import { CustomerReturn } from '../shared/models/CustomerReturn';
import { SupplierReturn } from '../shared/models/SupplierReturn';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  baseUrl = environment.apiUrl
  constructor(private http: HttpClient) { }

  getWriteOffs(writeoffParams: writeOffParams){
    let params = new HttpParams();
    if(writeoffParams.productId > 0) params = params.append('productId', writeoffParams.productId);
    params = params.append('sort', writeoffParams.sort);
    params = params.append('pageIndex', writeoffParams.pageNumber);
    params = params.append('pageSize', writeoffParams.pageSize);
    if(writeoffParams.search) params = params.append('search', writeoffParams.search);

    return this.http.get<Pagination<WriteOff[]>>(this.baseUrl + 'Inventory/WriteOffs', {params: params})
  }

  getReturns(searchParams: specParams){
    let params = new HttpParams();
    params = params.append('sort', searchParams.sort);
    params = params.append('pageIndex', searchParams.pageNumber);
    params = params.append('pageSize', searchParams.pageSize);
    if(searchParams.search) params = params.append('search', searchParams.search);

    return this.http.get<Pagination<CustomerReturn[]>>(this.baseUrl + 'Inventory/ReturnsLog', {params: params})
  }

  getReturn(id: number){
    return this.http.get<CustomerReturn>(this.baseUrl + 'Inventory/ReturnsLog/' + id)
  }

  logReturn(returnRequest?: any){
    return this.http.post<LogReturn>(this.baseUrl + 'Inventory/LogReturn', returnRequest)
  }

  getProducts(shopParams: ShopParams){
    let params = new HttpParams();

    if(shopParams.categoryId > 0) params = params.append('categoryId', shopParams.categoryId);
    if(shopParams.typeId > 0) params = params.append('typeId', shopParams.typeId);
    params = params.append('sort', shopParams.sort);
    params = params.append('pageIndex', shopParams.pageNumber);
    params = params.append('pageSize', shopParams.pageSize);
    if(shopParams.search) params = params.append('search', shopParams.search);

    return this.http.get<Pagination<Product[]>>(this.baseUrl + 'products', {params: params})
  }

  getWriteOff(id: number)
  {
    return this.http.get<WriteOff>(this.baseUrl + 'Inventory/WriteOffs/' + id);
  }

  createWriteOff(writeoff: any)
  {
    return this.http.post<WriteOff>(this.baseUrl + 'inventory', writeoff);
  }


  getSupplierReturns(searchParams: specParams){
    let params = new HttpParams();
    params = params.append('sort', searchParams.sort);
    params = params.append('pageIndex', searchParams.pageNumber);
    params = params.append('pageSize', searchParams.pageSize);
    if(searchParams.search) params = params.append('search', searchParams.search);

    return this.http.get<Pagination<SupplierReturn[]>>(this.baseUrl + 'SupplierOrders/ReturnsLog', {params: params})
  }

  getSupplierReturn(id: number){
    return this.http.get<SupplierReturn>(this.baseUrl + 'SupplierOrders/ReturnsLog/' + id)
  }

  logSupplierReturn(returnRequest?: any){
    return this.http.post<LogReturn>(this.baseUrl + 'SupplierOrders/LogReturn', returnRequest)
  }

}
