import { Injectable } from '@angular/core';
import { environment } from 'src/environments/enviroment';
import { Company } from '../shared/models/Company';
import { ReplaySubject, map, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  baseUrl = environment.apiUrl;
  private companySource = new ReplaySubject<Company | null>(1); 
  company$ = this.companySource.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  loadCompany(id: number){
    return this.http.get<Company>(this.baseUrl + 'company/' + id).pipe(
      map(company => {
        if(company){
          this.companySource.next(company);
          return company;
        }else{
          return null
        }
      })
    )
  }

  updateCompany(company: any){
    return this.http.put(`${this.baseUrl}company/${company.id}`, company);
  }
}
