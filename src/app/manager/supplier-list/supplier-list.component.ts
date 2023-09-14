import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { SupplierService } from '../supplier.service';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { Supplier } from 'src/app/shared/models/Supplier';
import { specParams } from 'src/app/shared/models/specParams';

@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.scss']
})
export class SupplierListComponent {
  constructor(private supplierService: SupplierService, private toaster: ToastrService, private modalService: BsModalService, private router: Router) { } 
  ngOnInit(): void {
    this.getSuppliers();
  }

  modalRef?: BsModalRef;
  @ViewChild('search') searchTerm?: ElementRef;
  suppliers: Supplier[] = [];
  specParams: specParams = new specParams();
  sortOptions = [
    {name: 'Alphabetical: A-Z', value: 'nameAsc'},
    {name: 'Alphabetical: Z-A', value: 'nameDesc'},
  ];
  totalCount = 0;

  getSuppliers(){
    this.supplierService.getSuppliers(this.specParams).subscribe({
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

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    }

  deleteSupplier(id: number){
    this.supplierService.deleteSupplier(id).subscribe({
      next: () => {
        this.modalRef?.hide(),
        this.router.navigateByUrl('/dashboard/supplier-list');
        this.toaster.success('Supplier Deleted');
        this.getSuppliers()
      },
      error: error => console.log(error)
    })
  }
}
