import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/shared/models/product';
import { SupplierordersService } from '../supplierorders.service';
import { ShopParams } from 'src/app/shared/models/shopParams';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ConfigureSupplierOrder, SupplierOrderItem } from 'src/app/shared/models/SupplierOrder';
import { Supplier } from 'src/app/shared/models/Supplier';

@Component({
  selector: 'app-make-supplier-order-details',
  templateUrl: './make-supplier-order-details.component.html',
  styleUrls: ['./make-supplier-order-details.component.scss']
})
export class MakeSupplierOrderDetailsComponent {
  constructor(private orderService: SupplierordersService, private router: Router, private bcService: BreadcrumbService, private toaster: ToastrService, private modalService: BsModalService, private activatedRoute: ActivatedRoute) { 
    this.bcService.set('@orderDetails', '');
  }
  id = this.activatedRoute.snapshot.paramMap.get('id');
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
  OrderItems?: SupplierOrderItem[]  = [];
  whitespace = "[a-zA-Z0-9][a-zA-Z0-9 ]+"
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
    name: new FormControl({value: '', disabled: true}, [Validators.required, Validators.pattern(this.whitespace)]),
    email: new FormControl({value: '', disabled: true}, [Validators.required, Validators.email]),
    phoneNumber: new FormControl({value: 0, disabled: true}, Validators.required)
  });

 ngOnInit(): void {
  this.loadSupplier();
  this.getProducts();
}

addProdToLog(productToAdd: Product, quantityToAdd: number){
  if(this.OrderItems?.find(x => x.productId == productToAdd.id)){
    this.toaster.warning('This item is already in the return list');
  }else{
    this.OrderItems?.push({
      productId: productToAdd.id,
      productName: productToAdd.name,
      pictureUrl: productToAdd.pictureUrl,
      price: productToAdd.price,
      quantity: quantityToAdd,
    })
  }
  this.modalRef?.hide()
  console.log(this.OrderItems)
}

removeProdFromLog(id?: number){
  this.OrderItems = this.OrderItems?.filter(x => x.productId != id)!
  console.log(this.OrderItems)
}

placeOrder(): void {
  if (this.placeorderForm.valid) {
    this.placeorderForm.value.orderItems = this.OrderItems
    console.log(this.placeorderForm.value);
    this.orderService.placeOrder(this.placeorderForm.value).subscribe({
      next: () => {
        this.router.navigateByUrl('/dashboard/SupplierOrders');
        this.toaster.success('Order placed successfully');
      },
      error: error => {
        this.errors = error.errors;
      }
    });
  }
}

loadSupplier(){
  if (this.id) this.orderService.getSupplier(+this.id).subscribe({
    next: supplier => {
      supplier && this.SupplierForm.patchValue(supplier);
      this.supplier = supplier,
      this.placeorderForm.value.supplierId = supplier.id
      this.bcService.set('@orderDetails', supplier.name);
      console.log(this.SupplierForm.value);
    },
    error: err => console.log(err)
  })
}

 getProducts(){
  this.shopParams.supplierId = +this.id!
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
