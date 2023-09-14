import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/enviroment';
import { PromotionListVM } from '../shared/models/PromotionListVM';
import { Pagination } from '../shared/models/pagination';
import { promoSpecParams } from '../shared/models/promotionSpecParams';
import { ShopParams } from '../shared/models/shopParams';
import { Product } from '../shared/models/product';
import { Promotion } from '../shared/models/Promotion';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {
  baseUrl = environment.apiUrl
  constructor(private httpClient: HttpClient) { }

  getPromotions(specParams: promoSpecParams){
    let params = new HttpParams()
    if(specParams.search) params.append('search', specParams.search)
    params.append('sort', specParams.sort)
    params.append('pageSize', specParams.pageSize)
    params.append('pageIndex', specParams.pageNumber)
    return this.httpClient.get<Pagination<PromotionListVM[]>>(this.baseUrl + 'promotion', {params: params})
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

  createPromotion(file:any){
    return this.httpClient.post(`${this.baseUrl}promotion`, file);
  }

  getPromotion(id: number){
    return this.httpClient.get<Promotion>(this.baseUrl + 'promotion/' + id)
  }

  deletePromotion(id: number){
    return this.httpClient.delete(this.baseUrl + 'promotion/' + id);
  }

  updatePromotion(file:any, id?:any){
    return this.httpClient.put(`${this.baseUrl}promotion/` + id, file);
  }
}
