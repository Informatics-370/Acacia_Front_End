import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/enviroment';
import { Pagination } from '../shared/models/pagination';
import { User } from '../shared/models/user';
import { UserParams } from '../shared/models/userParams';
import { User_Role } from '../shared/models/User_Role';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getUsers(userParams: UserParams){
    let params = new HttpParams();
    params = params.append('sort', userParams.sort);
    params = params.append('pageIndex', userParams.pageNumber);
    params = params.append('pageSize', userParams.pageSize);
    if(userParams.search) params = params.append('search', userParams.search);
    if(userParams.userRole) params = params.append('userRole', userParams.userRole);

    return this.http.get<Pagination<User[]>>(this.baseUrl + 'account/users', {params: params})
  }

  getUserRoles(){
    return this.http.get<User_Role[]>(this.baseUrl + 'account/roles');
  }

  getUser(email: any){
    return this.http.get<User>(this.baseUrl + 'account/user?email=' + email);
  }

  updateUser(user?: User){
    return this.http.put(this.baseUrl + 'account/update-user', user);
  }

  updateUserRole(user?: any){
    return this.http.put(this.baseUrl + 'account/update-user-role', user);
  }
}
