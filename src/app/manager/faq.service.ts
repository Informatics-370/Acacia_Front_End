import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/enviroment';
import { specParams } from '../shared/models/specParams';
import { Faq } from '../shared/models/faq';
import { Pagination } from '../shared/models/pagination';

@Injectable({
  providedIn: 'root'
})
export class FaqService {

  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getFaqs(specParams: specParams){
    let params = new HttpParams();
    params = params.append('sort', specParams.sort);
    params = params.append('pageIndex', specParams.pageNumber);
    params = params.append('pageSize', specParams.pageSize);
    if(specParams.search) params = params.append('search', specParams.search);

    return this.http.get<Pagination<Faq[]>>(this.baseUrl + 'faq', {params: params})
  }

  getFaq(id: number)
  {
    return this.http.get<Faq>(this.baseUrl + 'faq/' + id);
  }

  updateFaq(faq: any){
    return this.http.put(this.baseUrl + 'faq/update/' + faq.id, faq);
  }
  deleteFaq(id: number){
    return this.http.delete(this.baseUrl + 'faq/delete/' + id);
  }

  addFaq(faq?: any){
    return this.http.post<Faq>(this.baseUrl + 'faq/add', faq);
  }

}
