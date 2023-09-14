import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class BusyService {
  bustRequestCount = 0;
  constructor(private spinnerService: NgxSpinnerService) { }

  busy(){
    this.bustRequestCount++;
    this.spinnerService.show(undefined, {
      type: 'square-loader',
      bdColor: 'rgba(255,255,255,0.7)',
      color: '#333333'
    });
  }

  idle(){
    this.bustRequestCount--;
    if (this.bustRequestCount <= 0){
      this.bustRequestCount = 0;
      this.spinnerService.hide();
    }
  }
}
