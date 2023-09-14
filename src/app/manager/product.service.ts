import { Injectable } from '@angular/core';
import { ShopParams } from '../shared/models/shopParams';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Pagination } from '../shared/models/pagination';
import { Product } from '../shared/models/product';
import { environment } from 'src/environments/enviroment';
import { Category } from '../shared/models/category';
import { Type } from '../shared/models/type';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
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

  createProduct(file:FormData){
    return this.http.post(`${this.baseUrl}products/AddProduct`, file);
  }

  addProductList(data: FormData){
    return this.http.post(`${this.baseUrl}products/AddProductList`, data);
  }

  updateProduct(file:FormData, id?:any){
    return this.http.put(`${this.baseUrl}products?id=${id}`, file);
  }
  deleteProduct(id: number){
    return this.http.delete(this.baseUrl + 'products/' + id);
  }

  getCategory(id: any){
    return this.http.get<Category>(this.baseUrl + 'products/category/' + id);
  }

  createProductCategory(name?: string){
    return this.http.post<any>(this.baseUrl + 'products/category/add?name=' + name, name);
  }
  updateProductCategory(category: any){
    return this.http.put(this.baseUrl + 'products/category/update/' + category.id + "?name=" + category.name, category.name);
  }
  deleteProductCategory(id: number){
    return this.http.delete(this.baseUrl + 'products/category/delete/' + id);
  }

  getType(id: any){
    return this.http.get<Type>(this.baseUrl + 'products/type/' + id);
  }
  createProductType(name?: string){
    return this.http.post(this.baseUrl + 'products/type/add?name=' + name, name);
  }
  updateProductType(type: any){
    return this.http.put(this.baseUrl + 'products/type/update/' + type.id + "?name=" + type.name, type.name);
  }
  deleteProductType(id: number){
    return this.http.delete(this.baseUrl + 'products/type/delete/' + id);
  }
}
