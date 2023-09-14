import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/enviroment';
import { DeliveryMethod } from '../shared/models/deliveryMethod';
import { Order, OrderToAdd } from '../shared/models/Order';
import { OrderType } from '../shared/models/OrderType';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  createOrder(order: OrderToAdd){
    return this.http.post<OrderToAdd>(this.baseUrl + 'orders', order)
  }

  getDeliveryMethods(){
    return this.http.get<DeliveryMethod[]>(this.baseUrl + 'Orders/deliveryMethods').pipe(
      map(d => {
        return d.sort((x, y) => y.price - x.price)
      })
    )
  }

  VerifyCartStock(cartId: string){
    return this.http.get<boolean>(this.baseUrl + 'Orders/VerifyCartStock/' + cartId)
  }

    confirmPayment(paymentId: string, orderId: number){
      return this.http.post(this.baseUrl + 'orders/confirm', {orderId, paymentId})
    }

  getOrderTypes(){
    return this.http.get<OrderType[]>(this.baseUrl + 'Orders/OrderTypes')
  }
}
