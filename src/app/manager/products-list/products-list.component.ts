import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ProductService } from '../product.service';
import { Product } from 'src/app/shared/models/product';
import { Category } from 'src/app/shared/models/category';
import { ShopParams } from 'src/app/shared/models/shopParams';
import { Type } from 'src/app/shared/models/type';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})

export class ProductsListComponent implements OnInit {
  modalRef?: BsModalRef;
  menuItemIndex = 0;
  
  @ViewChild('search') searchTerm?: ElementRef;
  errors: string[] = ["Note** PDF files are only accepted."];
  products: Product[] = [];
  categories: Category[] = [];
  types: Type[] = [];
  shopParams: ShopParams = new ShopParams();
  formData = new FormData();
  sortOptions = [
    {name: 'Alphabetical', value: 'name'},
    {name: 'Price: Low to high', value: 'priceAsc'},
    {name: 'Price: High to Low', value: 'priceDesc'},
  ];
  totalCount = 0;

  documentationForm = new FormGroup({
    productList: new FormControl('', Validators.required),
  });

  constructor(private productService: ProductService, private toaster: ToastrService, private modalService: BsModalService, private router: Router){}

  ngOnInit(): void {
    this.getProducts();
    this.getCategories();
    this.getTypes();
  }

  getProducts(){
    this.productService.getProducts(this.shopParams).subscribe({
      next: response => {
        this.products = response.data;
        this.shopParams.pageNumber = response.pageIndex;
        this.shopParams.pageSize = response.pageSize;
        this.totalCount = response.count;
      },
      error: error => console.log(error)
    })
  }

  getCategories(){
    this.productService.getCategories().subscribe({
      next: response => this.categories = [{id: 0, name: 'All'}, ...response],
      error: error => console.log(error)
    })
  }

  getTypes(){
    this.productService.getTypes().subscribe({
      next: response => this.types = [{id: 0, name: 'All'}, ...response],
      error: error => console.log(error)
    })
  }

  onCategorySelected(categoryId: number){
    this.shopParams.categoryId = categoryId;
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  onTypeSelected(typeId: number){
    this.shopParams.typeId = typeId;
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  addProductList(){  
    if(this.formData){
      this.productService.addProductList(this.formData).subscribe(
        () => {
          this.modalRef?.hide(),
          this.router.navigateByUrl('/dashboard/products-list');
          this.toaster.success('Product List uploaded successfully');
        },
        error => {
          this.errors = error.errors;
        }
      ); 
    }
  }

  deleteProduct(id: any){
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.modalRef?.hide(),
        this.router.navigateByUrl('/dashboard/products-list');
        this.toaster.success('Product Deleted');
        this.getProducts()
      },
      error: error => console.log(error)
    })
  }

  uploadProductList = (event: any) => {
    let fileToUpload = event.target.files[0];
    this.formData.append('productList', fileToUpload, fileToUpload.name);
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

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
}
