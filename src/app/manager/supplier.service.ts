import { Injectable } from '@angular/core';
import { Supplier } from '../shared/models/Supplier';
import { Pagination } from '../shared/models/pagination';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/enviroment';
import { specParams } from '../shared/models/specParams';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  baseUrl = environment.apiUrl
  constructor(private http: HttpClient) { }

  getSuppliersList(){
    return this.http.get<Supplier[]>(this.baseUrl + 'supplier/List')
  }

  getSuppliers(specParams: specParams){
    let params = new HttpParams();
    params = params.append('sort', specParams.sort);
    params = params.append('pageIndex', specParams.pageNumber);
    params = params.append('pageSize', specParams.pageSize);
    if(specParams.search) params = params.append('search', specParams.search);

    return this.http.get<Pagination<Supplier[]>>(this.baseUrl + 'supplier', {params: params})
  }

  getSupplier(id: number)
  {
    return this.http.get<Supplier>(this.baseUrl + 'supplier/' + id);
  }

  updateSupplier(supplier: any){
    return this.http.put(this.baseUrl + 'supplier/' + supplier.id, supplier);
  }
  deleteSupplier(id: number){
    return this.http.delete(this.baseUrl + 'supplier/' + id);
  }

  addSupplier(supplier?: any){
    return this.http.post<Supplier>(this.baseUrl + 'supplier/', supplier);
  }
}
