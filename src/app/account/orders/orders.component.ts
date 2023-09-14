import { Component, ElementRef, ViewChild } from '@angular/core';
import { Order } from 'src/app/shared/models/Order';
import { DeliveryMethod } from 'src/app/shared/models/deliveryMethod';
import { orderParams } from 'src/app/shared/models/orderParams';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent {
  
  @ViewChild('search') searchTerm?: ElementRef;
  orders: Order[] = [];
  deliveryMethods: DeliveryMethod[] = [];
  orderParams: orderParams = new orderParams();
  sortOptions = [
    {name: 'Date: Low to High', value: 'dateAsc'},
    {name: 'Date: High to Low', value: 'dateDesc'},
    {name: 'Total: Low to High', value: 'totalAsc'},
    {name: 'Total: High to Low', value: 'totalDesc'},
  ];
  totalCount = 0;

  constructor(private accountService: AccountService){}

  ngOnInit(): void {
    this.getOrders();
    this.getDeliveryMethods();
  }

  getOrders(){
    this.accountService.getOrders(this.orderParams).subscribe({
      next: response => {
        this.orders = response.data;
        this.orderParams.pageNumber = response.pageIndex;
        this.orderParams.pageSize = response.pageSize;
        this.totalCount = response.count;
      },
      error: error => console.log(error)
    })
  }

  getDeliveryMethods(){
    this.accountService.getDeliveryMethods().subscribe({
      next: response => this.deliveryMethods = [ ...response],
      error: error => console.log(error)
    })
  }

  onDeliveryMethodSelected(deliveryMethodId: number){
    this.orderParams.deliveryMethodId = deliveryMethodId;
    this.orderParams.pageNumber = 1;
    this.getOrders();
  }



  onSortSelected(event: any)
  {
    this.orderParams.sort = event.target.value;
    this.getOrders();
  }

  onPageChanged(event: any)
  {
    if(this.orderParams.pageNumber !== event)
    {
      this.orderParams.pageNumber = event;
      this.getOrders();
    }
  }

  onSearch(){
    this.orderParams.search = this.searchTerm?.nativeElement.value;
    this.orderParams.pageNumber = 1;  
    this.getOrders();
  }

  onReset(){
    if(this.searchTerm) this.searchTerm.nativeElement.value = '';
    this.orderParams = new orderParams();
    this.getOrders();
  }
}
