import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { DeliveryMethodsService } from '../delivery-methods.service';
import { DeliveryMethod } from 'src/app/shared/models/deliveryMethod';
import { specParams } from 'src/app/shared/models/specParams';

@Component({
  selector: 'app-delivery-method-list',
  templateUrl: './delivery-method-list.component.html',
  styleUrls: ['./delivery-method-list.component.scss']
})
export class DeliveryMethodListComponent {
  constructor(private deliveryService: DeliveryMethodsService, private toaster: ToastrService, private modalService: BsModalService, private router: Router) { } 
  ngOnInit(): void {
    this.getDeliveryMethods();
  }

  modalRef?: BsModalRef;
  @ViewChild('search') searchTerm?: ElementRef;
  deliveryMethods: DeliveryMethod[] = [];
  specParams: specParams = new specParams();
  sortOptions = [
    {name: 'Alphabetical: A-Z', value: 'AnsAsc'},
    {name: 'Alphabetical: Z-A', value: 'DescAns'},
  ];
  totalCount = 0;

  getDeliveryMethods(){
    this.deliveryService.getDeliveryMethodList(this.specParams).subscribe({
      next: response => {
        this.deliveryMethods = response.data;
        this.specParams.pageNumber = response.pageIndex;
        this.specParams.pageSize = response.pageSize;
        this.totalCount = response.count;
        console.log(this.deliveryMethods);
      },
      error: error => console.log(error)
    })
  }

  onSortSelected(event: any)
  {
    this.specParams.sort = event.target.value;
    this.getDeliveryMethods();
  }

  onSearch(){
    this.specParams.search = this.searchTerm?.nativeElement.value;
    this.specParams.pageNumber = 1;  
    this.getDeliveryMethods();
  }

  onReset(){
    if(this.searchTerm) this.searchTerm.nativeElement.value = '';
    this.specParams = new specParams();
    this.getDeliveryMethods();
  }

  onPageChanged(event: any)
  {
    if(this.specParams.pageNumber !== event)
    {
      this.specParams.pageNumber = event;
      this.getDeliveryMethods();
    }
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    }

  deleteDeliveryMethod(id: number){
    this.deliveryService.deleteDeliveryMethod(id).subscribe({
      next: () => {
        this.modalRef?.hide(),
        this.router.navigateByUrl('/dashboard/DeliveryMethods');
        this.toaster.success('Delivery Method Deleted');
        this.getDeliveryMethods()
      },
      error: error => console.log(error)
    })
  }
}
