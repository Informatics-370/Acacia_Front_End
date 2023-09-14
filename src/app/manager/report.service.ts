import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/enviroment';
import { ReportVM } from '../shared/models/ReportVM';
import { ReportParams } from '../shared/models/ReportParams';
import { Supplier } from '../shared/models/Supplier';
import { Product } from '../shared/models/product';
import { User } from '../shared/models/user';
import { SupplierReportVM } from '../shared/models/SupplierReport';
import { SalesReportVM } from '../shared/models/SalesReportVM';
import { ProfitabilityReportVM } from '../shared/models/ProfitabilityReportVM';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  baseUrl = environment.apiUrl
  constructor(private httpClient: HttpClient) { }

  getPromotionsReport(specParams: ReportParams){
    let params = new HttpParams()
    if(specParams.sort != null || specParams.sort != '') params = params.append('sort', specParams.sort);
    if(specParams.categoryId > 0) params = params.append('categoryId', specParams.categoryId);
    if(specParams.startDate != null) params = params.append('startDate', specParams.startDate.toISOString());
    if(specParams.endDate != null) params = params.append('endDate', specParams.endDate.toISOString());
    return this.httpClient.get<ReportVM>(this.baseUrl + 'Reports/Promotions', {params: params})
  }

getSalesReport(specParams: ReportParams){
  let params = new HttpParams() 
  if(specParams.sort != null || specParams.sort != '') params = params.append('sort', specParams.sort);
  if(specParams.startDate != null) params = params.append('startDate', specParams.startDate.toISOString());
  if(specParams.endDate != null) params = params.append('endDate', specParams.endDate.toISOString());
  return this.httpClient.get<SalesReportVM>(this.baseUrl + 'Reports/SalesReport', {params: params})
  }


getSupplierOrderReport(specParams: ReportParams) {
  let params = new HttpParams();
  if(specParams.sort != null || specParams.sort != '') params = params.append('sort', specParams.sort);
  if(specParams.startDate != null) params = params.append('startDate', specParams.startDate.toISOString());
  if(specParams.endDate != null) params = params.append('endDate', specParams.endDate.toISOString());
  return this.httpClient.get<SupplierReportVM>(this.baseUrl + 'Reports/SupplierOrderReport', { params: params });
}


getTrendsReport(specParams: ReportParams){
  let params = new HttpParams()
  if(specParams.sort != null || specParams.sort != '') params = params.append('sort', specParams.sort);
  if(specParams.categoryId > 0) params = params.append('categoryId', specParams.categoryId);
  if(specParams.startDate != null) params = params.append('startDate', specParams.startDate.toISOString());
  if(specParams.endDate != null) params = params.append('endDate', specParams.endDate.toISOString());
  return this.httpClient.get<ReportVM>(this.baseUrl + 'Reports/ProductTrends', {params: params})
  }

getProfitabilityReport(specParams: ReportParams){
  let params = new HttpParams()
  if(specParams.sort != null || specParams.sort != '') params = params.append('sort', specParams.sort);
  if(specParams.categoryId > 0) params = params.append('categoryId', specParams.categoryId);
  if(specParams.startDate != null) params = params.append('startDate', specParams.startDate.toISOString());
  if(specParams.endDate != null) params = params.append('endDate', specParams.endDate.toISOString());
  return this.httpClient.get<ProfitabilityReportVM>(this.baseUrl + 'Reports/ProfitabilityReport', {params: params})
  }

getSupplierListReport(specParams: ReportParams){
  let params = new HttpParams()
  if(specParams.sort != null || specParams.sort != '') params = params.append('sort', specParams.sort);
  return this.httpClient.get<Supplier[]>(this.baseUrl + 'Reports/SuppliersList', {params: params})
  }

getProductListReport(specParams: ReportParams){
  let params = new HttpParams()
  if(specParams.sort != null || specParams.sort != '') params = params.append('sort', specParams.sort);
  return this.httpClient.get<Product[]>(this.baseUrl + 'Reports/ProductsList', {params: params})
  }

getUserListReport(specParams: ReportParams){
  let params = new HttpParams()
  if(specParams.sort != null || specParams.sort != '') params = params.append('sort', specParams.sort);
  return this.httpClient.get<User[]>(this.baseUrl + 'Reports/UsersList', {params: params})
  }

}