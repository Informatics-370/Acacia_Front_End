import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/cart/cart.service';

@Component({
  selector: 'app-cust-order-totals',
  templateUrl: './cust-order-totals.component.html',
  styleUrls: ['./cust-order-totals.component.scss']
})
export class CustOrderTotalsComponent {
  
  constructor(public cartService: CartService) { } 

}
