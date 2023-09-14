import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/enviroment';
import { orderParams } from '../shared/models/orderParams';
import { Pagination } from '../shared/models/pagination';
import { Order } from '../shared/models/Order';
import { DeliveryMethod } from '../shared/models/deliveryMethod';
import { map } from 'rxjs';
import { DispatchOrder } from '../shared/models/DispatchOrder';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  
  getOrders(specParams: orderParams){
    let params = new HttpParams();
    if(specParams.deliveryMethodId > 0) params = params.append('deliveryMethodId', specParams.deliveryMethodId);
    params = params.append('sort', specParams.sort);
    params = params.append('pageIndex', specParams.pageNumber);
    params = params.append('pageSize', specParams.pageSize);
    if(specParams.search) params = params.append('search', specParams.search);

    return this.http.get<Pagination<Order[]>>(this.baseUrl + 'orders', {params: params})
  }

  getOrder(id: number){
    return this.http.get<Order>(this.baseUrl + 'orders/' + id);
  }

  dispatchOrder(dispatchOrder: any){
    return this.http.post(this.baseUrl + 'Orders/DispatchOrder', dispatchOrder);
  }

  packageOrder(packageOrder: any){
    return this.http.post(this.baseUrl + 'Orders/PackageOrder', packageOrder);
  }


  getDeliveryMethods(){
    return this.http.get<DeliveryMethod[]>(this.baseUrl + 'Orders/deliveryMethods').pipe(
      map(d => {
        return d.sort((x, y) => y.price - x.price)
      })
    )
  }
  
  getInvoice(id: number) {
    return this.http.get(this.baseUrl + 'orders/GenerateInvoice/' + id, { observe: 'response', responseType: 'blob' });
  }
}
