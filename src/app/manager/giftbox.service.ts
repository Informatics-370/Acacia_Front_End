import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/enviroment';
import { specParams } from '../shared/models/specParams';
import { Pagination } from '../shared/models/pagination';
import { GiftBox } from '../shared/models/GiftBox';
import { GiftBoxListVM } from '../shared/models/GiftBoxListVM';
import { ShopParams } from '../shared/models/shopParams';
import { Product } from '../shared/models/product';

@Injectable({
  providedIn: 'root'
})
export class GiftboxService {
  baseUrl = environment.apiUrl
  constructor(private httpClient: HttpClient) { }

  getGiftboxes(specParams: specParams){
    let params = new HttpParams()
    if(specParams.search) params.append('search', specParams.search)
    params.append('sort', specParams.sort)
    params.append('pageSize', specParams.pageSize)
    params.append('pageIndex', specParams.pageNumber)
    return this.httpClient.get<Pagination<GiftBoxListVM[]>>(this.baseUrl + 'giftbox', {params: params})
  }

  getProducts(shopParams: ShopParams){
    let params = new HttpParams();

    if(shopParams.categoryId > 0) params = params.append('categoryId', shopParams.categoryId);
    if(shopParams.typeId > 0) params = params.append('typeId', shopParams.typeId);
    params = params.append('sort', shopParams.sort);
    params = params.append('pageIndex', shopParams.pageNumber);
    params = params.append('pageSize', shopParams.pageSize);
    if(shopParams.search) params = params.append('search', shopParams.search);

    return this.httpClient.get<Pagination<Product[]>>(this.baseUrl + 'products', {params: params})
  }

  createGiftBox(file:FormData){
    return this.httpClient.post(`${this.baseUrl}giftbox`, file);
  }

  getGiftbox(id: number){
    return this.httpClient.get<GiftBox>(this.baseUrl + 'giftbox/' + id)
  }

  deleteGiftBox(id: number){
    return this.httpClient.delete(this.baseUrl + 'giftbox/' + id);
  }

  updateGiftBox(file:FormData, id?:any){
    return this.httpClient.put(`${this.baseUrl}giftbox/${id}`, file);
  }
}
