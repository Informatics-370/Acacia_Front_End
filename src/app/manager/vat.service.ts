import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { VatParams } from '../shared/models/vatParams';
import { Vat } from '../shared/models/Vat';
import { Pagination } from '../shared/models/pagination';
import { environment } from 'src/environments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class VatService {
  baseUrl = environment.apiUrl
  constructor(private http: HttpClient) { }

  getVatList(vatParams: VatParams){
    let params = new HttpParams();
    params = params.append('sort', vatParams.sort);
    params = params.append('pageIndex', vatParams.pageNumber);
    params = params.append('pageSize', vatParams.pageSize);
    if(vatParams.IsActive) params = params.append('isActive', vatParams.IsActive);
    return this.http.get<Pagination<Vat[]>>(this.baseUrl + 'vat', {params: params})
  }

  getVatById(id: number){
    return this.http.get<Vat>(this.baseUrl + 'vat/' + id);
  }

  getCurrentVat(){
    return this.http.get<Vat>(this.baseUrl + 'vat/currentvat');
  }

  addVat(vatPercentage: any){
    return this.http.post<Vat>(this.baseUrl + 'Vat?vatPercentage=' + vatPercentage, vatPercentage);
  }
}
