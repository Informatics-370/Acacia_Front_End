import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from 'src/app/account/account.service';
import { Order } from 'src/app/shared/models/Order';
import { DeliveryMethod } from 'src/app/shared/models/deliveryMethod';
import { BreadcrumbService } from 'xng-breadcrumb';
import { OrderService } from '../order.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent {
  errors: string[] | null = null;
  order?: Order;
  whitespace = "[a-zA-Z0-9][a-zA-Z0-9 ]+"
  deliveryMethods: DeliveryMethod[] = [];
  dispatchForm = new FormGroup({
    orderId: new FormControl(0),
    trackingNumber: new FormControl('', [Validators.required]),
    customerEmail: new FormControl(''),
  });

  packageForm = new FormGroup({
    orderId: new FormControl(0, Validators.required),
    customerEmail: new FormControl('', Validators.required),
  });
  
  id = this.activatedRoute.snapshot.paramMap.get('id');

  constructor(private orderService: OrderService, private activatedRoute: ActivatedRoute, private bcService: BreadcrumbService, private toastrService: ToastrService) { 
    this.bcService.set('@orderDetails', '');
  }
  
  ngOnInit(): void {
    this.loadOrder();  
  }

  loadOrder(){
    if (this.id) this.orderService.getOrder(+this.id).subscribe({
      next: order => {
        this.order = order,
        this.dispatchForm.value.orderId = order.id,
        this.dispatchForm.value.customerEmail = order.customerEmail,
        this.packageForm.value.orderId = order.id,
        this.packageForm.value.customerEmail = order.customerEmail,
        this.bcService.set('@orderDetails', order.customerEmail);
      },
      error: err => console.log(err)
    })
    console.log(this.dispatchForm.value)
  }

  dispatchOrder(){
    if(this.order){
      this.dispatchForm.value.orderId = this.order.id;
      this.dispatchForm.value.customerEmail = this.order.customerEmail;
      this.orderService.dispatchOrder(this.dispatchForm.value).subscribe({
        next: order => {
          this.toastrService.success('Tracking number has been loaded and the customer has been informed')
          this.loadOrder()
        },
        error: err => console.log(err)
      })
    }
  }

  packageOrder(){
    this.orderService.packageOrder(this.packageForm.value).subscribe({
      next: order => {
        this.toastrService.success('The order status has been changed and the customer has been informed'),
        this.loadOrder()
      },
      error: err => console.log(err)
    })
  }
  

  printInvoice() {
    this.orderService.getInvoice(this.order!.id).subscribe({
      next: res => {
        let myfile = res.body as Blob;
        let url = window.URL.createObjectURL(myfile);
        window.open(url);
      },
      error: err => console.log(err)
    });
  }

}
