import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Category } from 'src/app/shared/models/category';
import { Product } from 'src/app/shared/models/product';
import { Type } from 'src/app/shared/models/type';
import { ProductService } from '../product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, Validators } from '@angular/forms';
import { SupplierService } from '../supplier.service';
import { Supplier } from 'src/app/shared/models/Supplier';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent {

  constructor(private productService: ProductService, private supplierService: SupplierService, private bcService: BreadcrumbService, private router: Router, private toaster: ToastrService) { }
  whitespace = "[a-zA-Z0-9][a-zA-Z0-9 ]+"
  errors: string[] | null = null;
  categories: Category[] = [];
  types: Type[] = [];
  suppliers: Supplier[] = [];
  product?: Product;
  formData = new FormData();

  ProductForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    price: new FormControl(0,  [Validators.required, Validators.min(1)]),
    description: new FormControl("", [Validators.required]),
    pictureUrl: new FormControl(Validators.required),
    productCategoryId: new FormControl(0, [Validators.required, Validators.min(1)]),
    productTypeId: new FormControl(0, [Validators.required, Validators.min(1)]),
    supplierId: new FormControl(0,  [Validators.required, Validators.min(1)]),
    tresholdValue: new FormControl(0,  [Validators.required, Validators.min(1)]),
  });

 ngOnInit(): void {
  this.getCategories();
  this.getTypes();
  this.getSuppliers();
}

 getCategories(){
  this.productService.getCategories().subscribe({
    next: response => this.categories = [...response],
    error: error => console.log(error)
  })
}

getTypes(){
  this.productService.getTypes().subscribe({
    next: response => this.types = [...response], 
    error: error => console.log(error)
  })
}

getSuppliers(){
  this.supplierService.getSuppliersList().subscribe({
    next: response => this.suppliers = [...response],
    error: error => console.log(error)
  })
}

onCategorySelected(event: any)
{
  this.ProductForm.value.productCategoryId = event.target.value;
}

onTypeSelected(event: any)
{
  this.ProductForm.value.productTypeId = event.target.value;
}

onSupplierSelected(event: any)
{
  this.ProductForm.value.supplierId = event.target.value;
}

uploadFile = (event: any) => {
  let fileToUpload = event.target.files[0];
  this.formData.append('pictureUrl', fileToUpload);
}

addProduct(){
  if(this.ProductForm.valid)
  {
    this.formData.append('name', this.ProductForm.value.name!);
    this.formData.append('description', this.ProductForm.value.description!);
    this.formData.append('price', this.ProductForm.value.price?.toString()!);
    this.formData.append('tresholdValue', this.ProductForm.value.supplierId?.toString()!);
    this.formData.append('productCategoryId', this.ProductForm.value.productCategoryId?.toString()!);
    this.formData.append('productTypeId',this.ProductForm.value.productTypeId?.toString()!);
    this.formData.append('supplierId', this.ProductForm.value.supplierId?.toString()!);
    console.log(this.formData)
    console.log(this.ProductForm.value)

    this.productService.createProduct(this.formData).subscribe(
      () => {
        this.router.navigateByUrl('/dashboard/products-list');
        this.toaster.success('Product added successfully');
      },
      error => {
        this.errors = error.errors;
      }
    );  
  }
}
}
