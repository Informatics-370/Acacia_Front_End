import { Component, ElementRef, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SupplierordersService } from '../supplierorders.service';
import { Router } from '@angular/router';
import { Supplier } from 'src/app/shared/models/Supplier';
import { specParams } from 'src/app/shared/models/specParams';

@Component({
  selector: 'app-make-supplier-order',
  templateUrl: './make-supplier-order.component.html',
  styleUrls: ['./make-supplier-order.component.scss']
})
export class MakeSupplierOrderComponent {
  constructor(private orderService: SupplierordersService, private toaster: ToastrService, private router: Router) { } 
  ngOnInit(): void {
    this.getSuppliers();
  }

  @ViewChild('search') searchTerm?: ElementRef;
  suppliers: Supplier[] = [];
  specParams: specParams = new specParams();
  sortOptions = [
    {name: 'Alphabetical: A-Z', value: 'nameAsc'},
    {name: 'Alphabetical: Z-A', value: 'nameDesc'},
  ];
  totalCount = 0;

  getSuppliers(){
    this.orderService.getSuppliers(this.specParams).subscribe({
      next: response => {
        this.suppliers = response.data;
        this.specParams.pageNumber = response.pageIndex;
        this.specParams.pageSize = response.pageSize;
        this.totalCount = response.count;
        console.log(this.suppliers);
      },
      error: error => console.log(error)
    })
  }

  onSortSelected(event: any)
  {
    this.specParams.sort = event.target.value;
    this.getSuppliers();
  }

  onSearch(){
    this.specParams.search = this.searchTerm?.nativeElement.value;
    this.specParams.pageNumber = 1;  
    this.getSuppliers();
  }

  onReset(){
    if(this.searchTerm) this.searchTerm.nativeElement.value = '';
    this.specParams = new specParams();
    this.getSuppliers();
  }

  onPageChanged(event: any)
  {
    if(this.specParams.pageNumber !== event)
    {
      this.specParams.pageNumber = event;
      this.getSuppliers();
    }
  }
}
