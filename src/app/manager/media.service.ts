import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/enviroment';
import { Media } from '../shared/models/Media';
import { Pagination } from '../shared/models/pagination';
import { specParams } from '../shared/models/specParams';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getMediaList(specParams: specParams){
    let params = new HttpParams();
    params = params.append('sort', specParams.sort);
    params = params.append('pageIndex', specParams.pageNumber);
    params = params.append('pageSize', specParams.pageSize);
    if(specParams.search) params = params.append('search', specParams.search);

    return this.http.get<Pagination<Media[]>>(this.baseUrl + 'Media', {params: params})
  }

  getMedia(id: number)
  {
    return this.http.get<Media>(this.baseUrl + 'Media/' + id);
  }

  updateMedia(faq: any){
    return this.http.put(this.baseUrl + 'Media/update/' + faq.id, faq);
  }
  deleteMedia(id: number){
    return this.http.delete(this.baseUrl + 'Media/delete/' + id);
  }

  addMedia(faq?: any){
    return this.http.post<Media>(this.baseUrl + 'Media/add', faq);
  }
}
