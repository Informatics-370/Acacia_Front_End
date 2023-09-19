import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/enviroment';
import { AuditTrail } from '../shared/models/auditTrail';
import { Pagination } from '../shared/models/pagination';
import { AuditParams } from '../shared/models/auditParams';

@Injectable({
  providedIn: 'root'
})
export class AuditTrailService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }


  getAuditTrail(specParams: AuditParams){
    let params = new HttpParams();
    if(specParams.auditType) params = params.append('auditType', specParams.auditType);
    params = params.append('sort', specParams.sort);
    params = params.append('pageIndex', specParams.pageNumber);
    params = params.append('pageSize', specParams.pageSize);
    if(specParams.search) params = params.append('search', specParams.search);

    return this.http.get<Pagination<AuditTrail[]>>(this.baseUrl + 'AuditTrail', {params: params})
  }
}
