import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination } from '../shared/models/pagination';
import { DeliveryMethod } from '../shared/models/deliveryMethod';
import { specParams } from '../shared/models/specParams';
import { environment } from 'src/environments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class DeliveryMethodsService {

  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getDeliveryMethodList(specParams: specParams){
    let params = new HttpParams();
    params = params.append('sort', specParams.sort);
    params = params.append('pageIndex', specParams.pageNumber);
    params = params.append('pageSize', specParams.pageSize);
    if(specParams.search) params = params.append('search', specParams.search);

    return this.http.get<Pagination<DeliveryMethod[]>>(this.baseUrl + 'DeliveryMethods/List', {params: params})
  }

  getDeliveryMethods(specParams: specParams){
    return this.http.get<DeliveryMethod[]>(this.baseUrl + 'DeliveryMethods')
  }

  getDeliveryMethod(id: number)
  {
    return this.http.get<DeliveryMethod>(this.baseUrl + 'DeliveryMethods/' + id);
  }

  updateDeliveryMethod(faq: any){
    return this.http.put(this.baseUrl + 'DeliveryMethods/' + faq.id, faq);
  }
  deleteDeliveryMethod(id: number){
    return this.http.delete(this.baseUrl + 'DeliveryMethods/' + id);
  }

  addDeliveryMethod(faq?: any){
    return this.http.post<DeliveryMethod>(this.baseUrl + 'DeliveryMethods', faq);
  }
}
