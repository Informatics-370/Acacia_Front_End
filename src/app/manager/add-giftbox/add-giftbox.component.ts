import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GiftBox } from 'src/app/shared/models/GiftBox';
import { BreadcrumbService } from 'xng-breadcrumb';
import { GiftboxService } from '../giftbox.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GiftBoxAddVM } from 'src/app/shared/models/GiftBoxAddVM';
import { Product } from 'src/app/shared/models/product';
import { ShopParams } from 'src/app/shared/models/shopParams';

@Component({
  selector: 'app-add-giftbox',
  templateUrl: './add-giftbox.component.html',
  styleUrls: ['./add-giftbox.component.scss']
})
export class AddGiftboxComponent {
  constructor(private gbService: GiftboxService, private activatedRoute: ActivatedRoute, private bcService: BreadcrumbService, private router: Router, private toaster: ToastrService, private fb: FormBuilder) { 
    this.bcService.set('@productDetails', '');
  }

  shopParams: ShopParams = new ShopParams();
  sortOptions = [
    {name: 'Alphabetical', value: 'name'},
    {name: 'Price: Low to high', value: 'priceAsc'},
    {name: 'Price: High to Low', value: 'priceDesc'},
  ];
  totalCount = 0;
  @ViewChild('search') searchTerm?: ElementRef;
  whitespace = "[a-zA-Z0-9][a-zA-Z0-9 ]+"
  errors: string[] | null = null;
  products: Product[] = [];
  gbproducts: Product[] = [];
  giftbox?: GiftBoxAddVM;
  formData = new FormData();
  gbForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.pattern(this.whitespace)]),
    description: new FormControl('', [Validators.required, Validators.pattern(this.whitespace)]),
    giftBoxImage: new FormControl(''),
    products: new FormControl(),
    price: new FormControl('', [Validators.required, Validators.min(1)]),
    packagingCosts: new FormControl('', [Validators.required, Validators.min(1)]),
  });

 ngOnInit(): void {
  this.getProducts();
}

 getProducts(){
  this.gbService.getProducts(this.shopParams).subscribe({
    next: response => {
      this.products = response.data
      this.shopParams.pageNumber = response.pageIndex;
      this.shopParams.pageSize = response.pageSize;
      this.totalCount = response.count;
    },
    error: error => console.log(error)
  })
}

addProdToGiftbox(id: number){
  if(this.gbproducts.find(x => x.id == id)){
    this.toaster.warning("This item is already in the giftbox")
  }
  else{
    const item = this.products.find(x => x.id === id)!
    this.gbproducts.push(item)
  }
}

removeProdToGiftbox(id: number){
  this.gbproducts = this.gbproducts.filter(x => x.id != id)
}

addGiftbox(): void {
  if (this.gbForm.valid && this.gbproducts.length > 0) {
    this.formData.append('name',  this.gbForm.value.name!);
    this.formData.append('description',  this.gbForm.value.description!);
    this.formData.append('price', this.gbForm.value.price?.toString()!);
    this.formData.append('packagingCosts',  this.gbForm.value.packagingCosts?.toString()!);
    this.formData.append('products', JSON.stringify(this.gbproducts));
    console.log(this.gbForm.value);
    this.gbService.createGiftBox(this.formData).subscribe({
      next: () => {
        this.router.navigateByUrl('/dashboard/giftbox-list');
        this.toaster.success('GiftBox added successfully');
      },
      error: error => {
        this.errors = error.errors;
      }
    });
  }
}

uploadFile = (event: any) => {
  let fileToUpload = event.target.files[0];
  this.gbForm.value.giftBoxImage = fileToUpload;
  this.formData.append('giftBoxImage', fileToUpload);
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
