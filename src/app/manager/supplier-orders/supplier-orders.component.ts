import { Component, ElementRef, ViewChild } from '@angular/core';
import { orderParams } from 'src/app/shared/models/orderParams';
import { SupplierordersService } from '../supplierorders.service';
import { SupplierOrder } from 'src/app/shared/models/SupplierOrder';

@Component({
  selector: 'app-supplier-orders',
  templateUrl: './supplier-orders.component.html',
  styleUrls: ['./supplier-orders.component.scss']
})
export class SupplierOrdersComponent {
  @ViewChild('search') searchTerm?: ElementRef;
  orders: SupplierOrder[] = [];
  orderParams: orderParams = new orderParams();
  sortOptions = [
    {name: 'Date: Low to High', value: 'dateAsc'},
    {name: 'Date: High to Low', value: 'dateDesc'},
    {name: 'Total: Low to High', value: 'totalAsc'},
    {name: 'Total: High to Low', value: 'totalDesc'},
  ];
  totalCount = 0;

  constructor(private orderService: SupplierordersService){}

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders(){
    this.orderService.getSuppliersOrders(this.orderParams).subscribe({
      next: response => {
        this.orders = response.data;
        this.orderParams.pageNumber = response.pageIndex;
        this.orderParams.pageSize = response.pageSize;
        this.totalCount = response.count;
      },
      error: error => console.log(error)
    })
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
