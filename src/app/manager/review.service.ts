import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/enviroment';
import { ReviewParams } from '../shared/models/ReviewParams';
import { ProductReview } from '../shared/models/ProductReview';
import { Pagination } from '../shared/models/pagination';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  baseUrl = environment.apiUrl
  constructor(private http: HttpClient) { }

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

  flagReview(id?: number){
    return this.http.post(this.baseUrl + 'ProductReview/Flag/' + id, id);
  }

  unFlagReview(id?: number){
    return this.http.post(this.baseUrl + 'ProductReview/unFlag/' + id, id);
  }
}
