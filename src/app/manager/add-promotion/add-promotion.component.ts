import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Promotion } from 'src/app/shared/models/Promotion';
import { Product } from 'src/app/shared/models/product';
import { PromotionService } from '../promotion.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ToastrService } from 'ngx-toastr';
import { ShopParams } from 'src/app/shared/models/shopParams';

@Component({
  selector: 'app-add-promotion',
  templateUrl: './add-promotion.component.html',
  styleUrls: ['./add-promotion.component.scss']
})
export class AddPromotionComponent {
  constructor(private promoService: PromotionService, private bcService: BreadcrumbService, private router: Router, private toaster: ToastrService) { 
  }

  shopParams: ShopParams = new ShopParams();
  sortOptions = [
    {name: 'Alphabetical', value: 'name'},
    {name: 'Price: Low to high', value: 'priceAsc'},
    {name: 'Price: High to Low', value: 'priceDesc'},
  ];
  Statuses = [
    {name: 'Active', value: true},
    {name: 'Inactive', value: false},
  ];

  totalCount = 0;
  @ViewChild('search') searchTerm?: ElementRef;
  errors: string[] | null = null;
  products: Product[] = [];
  promoProducts: Product[] = [];
  promotion?: Promotion;
  whitespace = "[a-zA-Z0-9][a-zA-Z0-9 ]+"
  promoForm = new FormGroup({
    id: new FormControl(0),
    name: new FormControl('', [Validators.required]),
    description: new FormControl('',[Validators.required]),
    percentage: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(99)]),
    isActive: new FormControl(true, Validators.required),
    products: new FormControl(),
  });

 ngOnInit(): void {
  this.getProducts();
}

 getProducts(){
  this.promoService.getProducts(this.shopParams).subscribe({
    next: response => {
      this.products = response.data
      this.shopParams.pageNumber = response.pageIndex;
      this.shopParams.pageSize = response.pageSize;
      this.totalCount = response.count;
    },
    error: error => console.log(error)
  })
}


addProdToPromotion(id: number){
  if(this.promoProducts.find(x => x.id == id)){
    this.toaster.warning("This item is already in the promotion")
  }
  else{
    const item = this.products.find(x => x.id === id)!
    this.promoProducts.push(item)
  }
}

removeProdToPromotion(id: number){
  this.promoProducts = this.promoProducts.filter(x => x.id != id)
  this.promoForm.value.products = this.promoProducts
}

addPromotion(): void {
  if (this.promoForm.valid && this.promoProducts.length > 0) {
    console.log(this.promoForm.value);
    this.promoForm.value.products = this.promoProducts
    this.promoService.createPromotion(this.promoForm.value).subscribe({
      next: () => {
        this.router.navigateByUrl('/dashboard/promotions-list');
        this.toaster.success('Promotion added successfully');
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

onStatusSelected(event: any){
  if(event.target.value == "false"){
    this.promoForm.value.isActive = false;
  }else{
    this.promoForm.value.isActive = true;
  }
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
