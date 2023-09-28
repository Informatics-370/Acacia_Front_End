import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GiftBox } from 'src/app/shared/models/GiftBox';
import { BreadcrumbService } from 'xng-breadcrumb';
import { GiftboxService } from '../giftbox.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/shared/models/product';
import { ShopParams } from 'src/app/shared/models/shopParams';
import { GiftBoxPrice } from 'src/app/shared/models/GiftBoxPrice';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-giftbox-details',
  templateUrl: './giftbox-details.component.html',
  styleUrls: ['./giftbox-details.component.scss']
})
export class GiftboxDetailsComponent {
  id = this.activatedRoute.snapshot.paramMap.get('id');
  constructor(private gbService: GiftboxService, private activatedRoute: ActivatedRoute, private bcService: BreadcrumbService, private router: Router, private toaster: ToastrService, private fb: FormBuilder, private modalService: BsModalService) { 
    this.bcService.set('@giftboxDetails', '');
  }
  modalRef?: BsModalRef;
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
  gbproducts: Product[] = [];
  giftbox?: GiftBox;
  formData = new FormData();
  fileNameUploaded = ''
  whitespace = "[a-zA-Z0-9][a-zA-Z0-9 ]+"
  gbForm = new FormGroup({
    id: new FormControl(0, Validators.required),
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    giftBoxImage: new FormControl(''),
    products: new FormControl(),
    price: new FormControl(0, [Validators.required, Validators.min(1)]),
    packagingCosts: new FormControl(0, [Validators.required, Validators.min(1)]),
  });

 ngOnInit(): void {
  this.loadGiftbox();
  this.getProducts();
}

loadGiftbox() {
  if (this.id) {
    this.gbService.getGiftbox(+this.id).subscribe({
      next: giftbox => {
        this.giftbox = giftbox;
        this.gbproducts = giftbox.products;
        this.gbForm.patchValue({
          id: giftbox.id,
          name: giftbox.name,
          description: giftbox.description,
          price: giftbox.price,
          packagingCosts: giftbox.packagingCosts,
          products: giftbox.products,
          giftBoxImage: giftbox.giftBoxImage
        });
        this.bcService.set('@giftboxDetails', giftbox.name);
        console.log(this.gbForm.value);
        console.log(this.giftbox);
      },
      error: err => console.log(err)
    });
  }
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

uploadFile = (event: any) => {
  let fileToUpload = event.target.files[0];
  this.gbForm.value.giftBoxImage = fileToUpload;
  this.formData.append('giftBoxImage', fileToUpload);
}

updateGiftbox(){
  if(this.gbForm.valid && this.gbproducts.length > 0)
  {
    this.formData.append('id', this.gbForm.value.id?.toString()!);
    this.formData.append('name',  this.gbForm.value.name!);
    this.formData.append('description',  this.gbForm.value.description!);
    this.formData.append('price', this.gbForm.value.price?.toString()!);
    this.formData.append('packagingCosts',  this.gbForm.value.packagingCosts?.toString()!);
    this.formData.append('products', JSON.stringify(this.gbproducts));

    this.gbService.updateGiftBox(this.formData, this.id).subscribe(
      () => {
        this.router.navigateByUrl('/dashboard/giftbox-list');
        this.toaster.success('GiftBox updated successfully');
      },
      error => {
        this.errors = error.errors;
      }
    );  
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

openModal(template: TemplateRef<any>) {
  this.modalRef = this.modalService.show(template);
  }

deleteGiftbox(){
  if(this.giftbox){
    this.gbService.deleteGiftBox(this.giftbox.id).subscribe({
      next: () => {
        this.modalRef?.hide(),
        this.router.navigateByUrl('/dashboard/giftbox-list');
        this.toaster.success('GiftBox Deleted');
      },
      error: error => console.log(error)
    })
  }
}
}
