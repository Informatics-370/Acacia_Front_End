import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { createWriteOffVM } from 'src/app/shared/models/createWriteOffVM';
import { ShopParams } from 'src/app/shared/models/shopParams';
import { InventoryService } from '../inventory.service';
import { Product } from 'src/app/shared/models/product';

@Component({
  selector: 'app-add-writeoff',
  templateUrl: './add-writeoff.component.html',
  styleUrls: ['./add-writeoff.component.scss']
})
export class AddWriteoffComponent {
  constructor(private inventoryService: InventoryService, private router: Router, private toaster: ToastrService) { 
  }

  shopParams: ShopParams = new ShopParams();
  sortOptions = [
    {name: 'Alphabetical', value: 'name'},
    {name: 'Price: Low to high', value: 'priceAsc'},
    {name: 'Price: High to Low', value: 'priceDesc'},
  ];
  Reasons = [
    {value: 'Damaged'},
    {value: 'Theft'},
    {value: 'Obsolete'},
    {value: 'Losted'},
    {value: 'Other'},
  ];
  totalCount = 0;
  @ViewChild('search') searchTerm?: ElementRef;
  errors: string[] | null = null;
  products: Product[] = [];
  writeOffProduct?: Product;
  writeOff?: createWriteOffVM;
  whitespace = "[a-zA-Z0-9][a-zA-Z0-9 ]+"
  writeOffForm = new FormGroup({
    quantity: new FormControl(0, [Validators.required, Validators.min(1)]),
    productId: new FormControl(0, [Validators.required]),
    reason: new FormControl('', [Validators.required, Validators.pattern(this.whitespace)]),
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

onReasonSelected(event: any){
this.writeOffForm.value.reason = event.target.value;
}

addProdToPromotion(id: number){
  if(this.writeOffProduct != null || this.writeOffForm.value.productId != 0){
    this.toaster.warning("This item has already been selected")
  }
  else{
    const item = this.products.find(x => x.id == id)!
    this.writeOffProduct = item
    this.writeOffForm.value.productId = +item.id
  }
  console.log(this.writeOffForm.value)
}

removeProdToPromotion(){
  this.writeOffForm.value.productId = 0
  this.writeOffProduct = undefined
}

createWriteOff(): void {
  if (this.writeOffForm.valid) {
    this.writeOffForm.value.productId = this.writeOffProduct?.id
    console.log(this.writeOffForm.value);
    this.inventoryService.createWriteOff(this.writeOffForm.value).subscribe({
      next: () => {
        this.router.navigateByUrl('/dashboard/writeoffs');
        this.toaster.success('WriteOff added successfully');
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
}
