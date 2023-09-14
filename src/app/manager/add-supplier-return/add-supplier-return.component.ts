import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { InventoryService } from '../inventory.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ShopParams } from 'src/app/shared/models/shopParams';
import { Product } from 'src/app/shared/models/product';
import { SupplierReturnItem } from 'src/app/shared/models/SupplierReturnItem';
import { SupplierReturn } from 'src/app/shared/models/SupplierReturn';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-supplier-return',
  templateUrl: './add-supplier-return.component.html',
  styleUrls: ['./add-supplier-return.component.scss']
})
export class AddSupplierReturnComponent {
  constructor(private inventoryService: InventoryService, private router: Router, private toaster: ToastrService, private modalService: BsModalService) { 
  }

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
  supplierReturn?: SupplierReturn;
  ReturnProducts?: SupplierReturnItem[]  = [];
  whitespace = "[a-zA-Z0-9][a-zA-Z0-9 ]+"
  returnForm = new FormGroup({
    supplierOrderId: new FormControl(0, [Validators.required, Validators.min(1)]),
    managerEmail: new FormControl('', [Validators.required, Validators.email]),
    description: new FormControl('', [Validators.required, Validators.pattern(this.whitespace)]),
    date: new FormControl(),
    total: new FormControl(),
    returnItems: new FormControl(),
  });

  Qunatity = new FormGroup({
    quantity: new FormControl(0, [Validators.required, Validators.min(1)]),
  });

 ngOnInit(): void {
  this.getProducts();
}

 getProducts(){
  this.inventoryService.getProducts(this.shopParams).subscribe({
    next: response => {
      this.products = response.data
      this.shopParams.pageNumber = response.pageIndex;
      this.shopParams.pageSize = response.pageSize;
      this.totalCount = response.count;
    },
    error: error => console.log(error)
  })
}

addProdToLog(productToAdd: Product, quantityToAdd: number){
  if(this.ReturnProducts?.find(x => x.productId == productToAdd.id)){
    this.toaster.warning("This item is already in the return list")
  }else{
    this.ReturnProducts?.push({
      productId: productToAdd.id,
      productName: productToAdd.name,
      pictureUrl: productToAdd.pictureUrl,
      price: productToAdd.price,
      quantity: quantityToAdd,
    })
  }

  this.modalRef?.hide()
}

removeProdFromLog(id?: number){
  this.ReturnProducts = this.ReturnProducts?.filter(x => x.productId != id)!
}

logReturn(): void {
  if (this.returnForm.valid) {
    this.returnForm.value.returnItems = this.ReturnProducts
    console.log(this.returnForm.value);
    this.inventoryService.logSupplierReturn(this.returnForm.value).subscribe({
      next: () => {
        this.router.navigateByUrl('/dashboard/SupplierReturns');
        this.toaster.success('Return logged successfully');
      },
      error: error => {
        this.errors = error.errors;
      }
    });
  }
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
