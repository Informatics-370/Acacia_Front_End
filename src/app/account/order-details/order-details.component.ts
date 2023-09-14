import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';
import { AccountService } from '../account.service';
import { DeliveryMethod } from 'src/app/shared/models/deliveryMethod';
import { Order } from 'src/app/shared/models/Order';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent {
  errors: string[] | null = null;
  order?: Order;
  deliveryMethods: DeliveryMethod[] = [];
  id = this.activatedRoute.snapshot.paramMap.get('id');

  constructor(private accountService: AccountService, private activatedRoute: ActivatedRoute, private bcService: BreadcrumbService) { 
    this.bcService.set('@orderDetails', '');
  }
  
  ngOnInit(): void {
    this.loadOrder();  
  }

  loadOrder(){
    if (this.id) this.accountService.getOrder(+this.id).subscribe({
      next: order => {
        this.order = order,
        this.bcService.set('@orderDetails', order.customerEmail);
      },
      error: err => console.log(err)
    })
  }

  
  printInvoice() {
    this.accountService.getInvoice(this.order!.id).subscribe({
      next: res => {
        let myfile = res.body as Blob;
        let url = window.URL.createObjectURL(myfile);
        window.open(url);
      },
      error: err => console.log(err)
    });
  }
}
