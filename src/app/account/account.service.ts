
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, map, of, take } from 'rxjs';
import { environment } from 'src/environments/enviroment';
import { User, User_Address } from '../shared/models/user';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { User_Role } from '../shared/models/User_Role';
import { Faq } from '../shared/models/faq';
import { Pagination } from '../shared/models/pagination';
import { specParams } from '../shared/models/specParams';
import { resetPassword } from '../shared/models/ResetPassword';
import { Order } from '../shared/models/Order';
import { orderParams } from '../shared/models/orderParams';
import { DeliveryMethod } from '../shared/models/deliveryMethod';
import { ProductReview } from '../shared/models/ProductReview';
import { ReviewParams } from '../shared/models/ReviewParams';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private currentUserSource = new ReplaySubject<User | null>(1); 
  currentUser$ = this.currentUserSource.asObservable();
  

  constructor(private http: HttpClient, private router: Router) { }

  loadCurrentUser(token: string | null){
    if(token === null){
      this.currentUserSource.next(null);
      return of(null);
    }
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);

    return this.http.get<User>(this.baseUrl + 'account', {headers}).pipe(
      map(user => {
        if(user){
          localStorage.setItem('token', user.token);
          this.currentUserSource.next(user);
          return user;
        }else{
          return null
        }
      })
    )
  }


  login(values: any){
    console.log(this.currentUserSource);
    return this.http.post<User>(this.baseUrl + 'account/login', values).pipe(
      map(user => {
        localStorage.setItem('token', user.token);
        this.currentUserSource.next(user);
      })
    )
  }

  register(file:FormData){
    return this.http.post<User>(this.baseUrl + 'account/register', file).pipe(
      map(user => {
        localStorage.setItem('token', user.token);
        this.currentUserSource.next(user);
      })
    )
  }

  logout(){
    localStorage.removeItem('token');
    this.currentUserSource.next(null);
    this.router.navigateByUrl('/');
  }

  checkEmailExists(email: string){
    return this.http.get<boolean>(this.baseUrl + 'account/emailExists?email=' + email);
  }

  GetUserAddress(): Observable<User_Address> {
    return this.http.get<User_Address>(this.baseUrl + 'account/address');
  }

  updateUserAddress(address: any){
    return this.http.put<User_Address>(this.baseUrl + 'account/address', address);
  }

  resetPassword(password: any){
    return this.http.put(this.baseUrl + 'account/reset-password', password);
  }

  updateUser(userDetails: any){
    return this.http.put(this.baseUrl + 'account/update-user', userDetails);
  }

  getUserRoles(){
    return this.http.get<User_Role[]>(this.baseUrl + 'account/roles');
  }

  deleteUser(){
    return this.http.delete(this.baseUrl + 'account/delete-user');
  }

  resetForgottenPassword(resetVM: any){
    return this.http.post<any>(this.baseUrl + 'account/reset-forgot-password', resetVM);
  }

  sendForgotPasswordRequest(email: any){
    return this.http.post<string>(this.baseUrl + 'account/forgot-password?email=' + email, email);
  }

  getFaqs(specParams: specParams){
    let params = new HttpParams();
    params = params.append('sort', specParams.sort);
    params = params.append('pageIndex', specParams.pageNumber);
    params = params.append('pageSize', specParams.pageSize);
    if(specParams.search) params = params.append('search', specParams.search);

    return this.http.get<Pagination<Faq[]>>(this.baseUrl + 'faq', {params: params})
  }

  getOrders(specParams: orderParams){
    let params = new HttpParams();
    if(specParams.deliveryMethodId > 0) params = params.append('deliveryMethodId', specParams.deliveryMethodId);
    params = params.append('sort', specParams.sort);
    params = params.append('pageIndex', specParams.pageNumber);
    params = params.append('pageSize', specParams.pageSize);
    if(specParams.search) params = params.append('search', specParams.search);

    return this.http.get<Pagination<Order[]>>(this.baseUrl + 'orders/User', {params: params})
  }

  getOrder(id: number){
    return this.http.get<Order>(this.baseUrl + 'orders/' + id);
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

  updateReview(review: any){
    return this.http.put<ProductReview>(this.baseUrl + 'ProductReview/' + review.id, review);
  }

  deleteReview(id: number){
    return this.http.delete(this.baseUrl + 'ProductReview/' + id);
  }

  flagReview(id: number){
    return this.http.post(this.baseUrl + 'ProductReview/Flag' + id, id);
  }

  unFlagReview(id: number){
    return this.http.post(this.baseUrl + 'ProductReview/unFlag/' + id, id);
  }
}
