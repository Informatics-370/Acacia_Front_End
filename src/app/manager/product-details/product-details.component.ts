import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ProductService } from '../product.service';
import { Product } from 'src/app/shared/models/product';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Category } from 'src/app/shared/models/category';
import { Type } from 'src/app/shared/models/type';
import { ToastrService } from 'ngx-toastr';
import html2canvas from 'html2canvas';
import { SupplierService } from '../supplier.service';
import { Supplier } from 'src/app/shared/models/Supplier';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  errors: string[] | null = null;
  categories: Category[] = [];
  types: Type[] = [];
  suppliers: Supplier[] = [];
  product?: any;
  formData = new FormData();
  fileNameUploaded = '';
  qrCodeStr = 'www.google.com';
  whitespace = "[a-zA-Z0-9][a-zA-Z0-9 ]+"
  ProductForm = new FormGroup({
    id: new FormControl(0, Validators.required),
    name: new FormControl('', [Validators.required, Validators.pattern(this.whitespace)]),
    price: new FormControl(0,  [Validators.required, Validators.min(1)]),
    description: new FormControl("", [Validators.required, Validators.pattern(this.whitespace)]),
    pictureUrl: new FormControl(),
    productCategoryId: new FormControl(0, [Validators.required, Validators.min(1)]),
    productTypeId: new FormControl(0, [Validators.required, Validators.min(1)]),
    supplierId: new FormControl(0,  [Validators.required, Validators.min(1)]),
    tresholdValue: new FormControl(0,  [Validators.required, Validators.min(1)]),
    quantity: new FormControl({value: 0, disabled: true})
  });


  id = this.activatedRoute.snapshot.paramMap.get('id');

  constructor(private productService: ProductService, private supplierService: SupplierService, private activatedRoute: ActivatedRoute, private bcService: BreadcrumbService, private router: Router, private toaster: ToastrService, private fb: FormBuilder) { 
    this.bcService.set('productDetails', '');
  }
  
  ngOnInit(): void {
    this.loadProduct();  
    this.getCategories();
    this.getTypes();
    this.getSuppliers();
  }
  
  loadProduct(){
    if (this.id) this.productService.getProduct(+this.id).subscribe({
      next: product => {
        this.ProductForm.patchValue(product);
        this.product = product,
        this.qrCodeStr = 'http://localhost:4200/shop/' + this.product.id;
        this.bcService.set('productDetails', product.name);
        console.log(this.ProductForm.value);
      },
      error: err => console.log(err)
    })
  }

  getSuppliers(){
    this.supplierService.getSuppliersList().subscribe({
      next: response => this.suppliers = [...response],
      error: error => console.log(error)
    })
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

  onCategorySelected(event: any)
  {
    this.ProductForm.value.productCategoryId = event.target.value;
  }

  onSupplierSelected(event: any)
  {
    this.ProductForm.value.supplierId = event.target.value;
  }

  onTypeSelected(event: any)
  {
    this.ProductForm.value.productTypeId = event.target.value;
  }
  
  updateProduct(){
    if(this.ProductForm.valid)
    {
      this.formData.append('id', this.ProductForm.value.toString()!);
      this.formData.append('name', this.ProductForm.value.name!);
      this.formData.append('description', this.ProductForm.value.description!);
      this.formData.append('price', this.ProductForm.value.price?.toString()!);
      this.formData.append('tresholdValue', this.ProductForm.value.supplierId?.toString()!);
      this.formData.append('productCategoryId', this.ProductForm.value.productCategoryId?.toString()!);
      this.formData.append('productTypeId',this.ProductForm.value.productTypeId?.toString()!);
      this.formData.append('supplierId', this.ProductForm.value.supplierId?.toString()!);
      console.log(this.formData)
      console.log(this.ProductForm.value)
  
      this.productService.updateProduct(this.formData, this.id).subscribe(
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
  
  printQRCode() {
    const captureElement = document.querySelector("#capture") as HTMLElement;
    if (!captureElement) {
      console.error("Element with ID 'capture' not found");
      return;
    }
    html2canvas(captureElement).then((canvas) => {
      const imageData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.setAttribute("download", "QRCode.png");
      link.setAttribute("href", imageData);
      link.click();
    });
  }

  uploadFile = (event: any) => {
    let fileToUpload = event.target.files[0];
    this.formData.append('pictureUrl', fileToUpload);
  }
  
}
