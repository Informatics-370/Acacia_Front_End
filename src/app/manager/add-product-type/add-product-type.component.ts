import { Component } from '@angular/core';
import { ProductService } from '../product.service';
import { BreadcrumbService } from 'xng-breadcrumb';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-product-type',
  templateUrl: './add-product-type.component.html',
  styleUrls: ['./add-product-type.component.scss']
})
export class AddProductTypeComponent {
  errors: string[] | null = null;
  whitespace = "[a-zA-Z0-9][a-zA-Z0-9 ]+"
  TypeForm = new FormGroup({
    id: new FormControl(0),
    name: new FormControl('', [Validators.required, Validators.pattern(this.whitespace)]),
  });

  constructor(private productService: ProductService, private bcService: BreadcrumbService, private router: Router, private toaster: ToastrService) { 
    this.bcService.set('@productDetails', '');
  }

  addType(){
    console.log(this.TypeForm.value.name);
    this.productService.createProductType(this.TypeForm.value.name?.toString()).subscribe({
      next: () => {
        this.router.navigateByUrl('dashboard/product-type-list');
        this.toaster.success('Product Type added successfully');
      },
      error: error => {
        this.errors = error.errors
      } 
    })
  }
  
}
