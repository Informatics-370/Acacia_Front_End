import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, delay, finalize, identity } from 'rxjs';
import { BusyService } from '../service/busy.service';
import { environment } from 'src/environments/enviroment';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(private busyService: BusyService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if(!request.url.includes('emailExists')){
      this.busyService.busy();
    }
    return next.handle(request).pipe(
      (environment.production ? identity : delay(700)),
      finalize(() => { this.busyService.idle() })
    )
  }
}
