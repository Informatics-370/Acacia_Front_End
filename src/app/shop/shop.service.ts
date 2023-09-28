import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../shared/models/product';
import { Pagination } from '../shared/models/pagination';
import { Category } from '../shared/models/category';
import { Type } from '../shared/models/type';
import { ShopParams } from '../shared/models/shopParams';
import { ReviewParams } from '../shared/models/ReviewParams';
import { ProductReview } from '../shared/models/ProductReview';
import { environment } from 'src/environments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

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

  getProduct(id: number)
  {
    return this.http.get<Product>(this.baseUrl + 'products/' + id);
  }

  getCategories(){
    return this.http.get<Category[]>(this.baseUrl + 'products/categories')
  }

  getTypes(){
    return this.http.get<Type[]>(this.baseUrl + 'products/types')
  }

  getReviews(specParams: ReviewParams){
    let params = new HttpParams();
    if(specParams.productId > 0) params = params.append('productId', specParams.productId);
    params = params.append('sort', specParams.sort);
    params = params.append('pageIndex', specParams.pageNumber);
    params = params.append('pageSize', specParams.pageSize);
    if(specParams.search) params = params.append('search', specParams.search);

    return this.http.get<Pagination<ProductReview[]>>(this.baseUrl + 'ProductReview/Reviews', {params: params})
  }

  getReview(id: number){
    return this.http.get<ProductReview>(this.baseUrl + 'ProductReview/' + id);
  }

  flagReview(id?: number){
    return this.http.post(this.baseUrl + 'ProductReview/Flag/' + id, id);
  }

  createReview(review?: any){
    return this.http.post(this.baseUrl + 'ProductReview/Add', review);
  }
}
