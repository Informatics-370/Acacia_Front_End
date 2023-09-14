import { Component, ElementRef, Input, TemplateRef, ViewChild } from '@angular/core';
import { SupplierordersService } from '../supplierorders.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ShopParams } from 'src/app/shared/models/shopParams';
import { Product } from 'src/app/shared/models/product';
import { SupplierOrder, SupplierOrderItem } from 'src/app/shared/models/SupplierOrder';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Supplier } from 'src/app/shared/models/Supplier';

@Component({
  selector: 'app-approve-supplier-order',
  templateUrl: './approve-supplier-order.component.html',
  styleUrls: ['./approve-supplier-order.component.scss']
})
export class ApproveSupplierOrderComponent {
  constructor(private orderService: SupplierordersService, private router: Router, private bcService: BreadcrumbService, private toaster: ToastrService, private modalService: BsModalService, private activatedRoute: ActivatedRoute) { 
  }


  @Input() supplierid = 0;
  @Input() orderid = 0;
  shopParams: ShopParams = new ShopParams();
  sortOptions = [
    {name: 'Alphabetical', value: 'name'},
    {name: 'Price: Low to high', value: 'priceAsc'},
    {name: 'Price: High to Low', value: 'priceDesc'},
  ];
  totalCount = 0;
  @ViewChild('search') searchTerm?: ElementRef;
  errors: string[] | null = null;
  products: Product[] = [];
  order?: SupplierOrder;

  placeorderForm = new FormGroup({
    supplierId: new FormControl(0, Validators.required),
    orderItems: new FormControl(),
  });

  Qunatity = new FormGroup({
    quantity: new FormControl(0, [Validators.required, Validators.min(1)]),
  });

  supplier?: Supplier;
  SupplierForm = new FormGroup({
    id: new FormControl(0),
    name: new FormControl({value: '', disabled: true}, Validators.required),
    email: new FormControl({value: '', disabled: true}, [Validators.required, Validators.email]),
    phoneNumber: new FormControl({value: 0, disabled: true}, Validators.required)
  });

 ngOnInit(): void {
  this.loadSupplier();
  this.getProducts();
  this.loadOrder();
}

loadOrder(){
  if (this.orderid) this.orderService.getSupplierOrder(this.orderid).subscribe({
    next: order => {
      this.order = order,
      this.placeorderForm.value.supplierId = order.supplier.id
      this.placeorderForm.value.orderItems = order.orderItems
      this.bcService.set('@orderDetails', order.supplier.name);
    },
    error: err => console.log(err)
  })
}

addProdToLog(productToAdd: Product, quantityToAdd: number){
  if(this.order){
    if(this.order.orderItems.find(x => x.productId == productToAdd.id)){
      this.toaster.warning('This item is already in the return list');
    }else{
      this.order.orderItems?.push({
        productId: productToAdd.id,
        productName: productToAdd.name,
        pictureUrl: productToAdd.pictureUrl,
        price: productToAdd.price,
        quantity: quantityToAdd,
      })
    }
  }
  this.modalRef?.hide()
  console.log(this.order?.orderItems)
}

removeProdFromLog(id?: number){
  if(this.order){
    this.order.orderItems = this.order.orderItems.filter(x => x.productId != id)!
    console.log(this.order.orderItems)
  }
}


approveOrder(){
  if(this.order?.status == 'Pending'){
    if (this.placeorderForm.valid) {
      this.placeorderForm.value.supplierId = this.order.supplier.id
      this.placeorderForm.value.orderItems = this.order.orderItems
      console.log(this.placeorderForm.value)
      console.log(this.order.id)
      this.orderService.ApproveOrder(this.order.id, this.placeorderForm.value).subscribe({
        next: () => {
          this.router.navigateByUrl('/dashboard/SupplierOrders');
          this.toaster.success('Email Sent to supplier');
        },
        error: error => {
          this.errors = error.errors;
        }
      });
    }
  }
}

loadSupplier(){
  if (this.supplierid) this.orderService.getSupplier(+this.supplierid).subscribe({
    next: supplier => {
      supplier && this.SupplierForm.patchValue(supplier);
      this.supplier = supplier,
      this.placeorderForm.value.supplierId = supplier.id
      console.log(this.SupplierForm.value);
    },
    error: err => console.log(err)
  })
}

 getProducts(){
  this.shopParams.supplierId = +this.supplierid!
  console.log(this.shopParams)
  this.orderService.getProducts(this.shopParams).subscribe({
    next: response => {
      this.products = response.data
      this.shopParams.pageNumber = response.pageIndex;
      this.shopParams.pageSize = response.pageSize;
      this.totalCount = response.count;
    },
    error: error => console.log(error)
  })
}

onSortSelected(event: any)
{
  this.shopParams.sort = event.target.value;
  this.getProducts();
}

onPageChanged(event: any)
{
  if(this.shopParams.pageNumber !== event)
  {
    this.shopParams.pageNumber = event;
    this.getProducts();
  }
}

onSearch(){
  this.shopParams.search = this.searchTerm?.nativeElement.value;
  this.shopParams.pageNumber = 1;  
  this.getProducts();
}

onReset(){
  if(this.searchTerm) this.searchTerm.nativeElement.value = '';
  this.shopParams = new ShopParams();
  this.getProducts();
}

modalRef?: BsModalRef;
openModal(template: TemplateRef<any>) {
  this.modalRef = this.modalService.show(template);
  }
}
