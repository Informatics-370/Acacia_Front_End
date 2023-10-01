import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-product-category',
  templateUrl: './add-product-category.component.html',
  styleUrls: ['./add-product-category.component.scss']
})
export class AddProductCategoryComponent {
  errors: string[] | null = null;
  whitespace = "[a-zA-Z0-9][a-zA-Z0-9 ]+"
  CategoryForm = new FormGroup({
    id: new FormControl(0),
    name: new FormControl('', [Validators.required]),
  });

  constructor(private productService: ProductService, private bcService: BreadcrumbService, private router: Router, private toaster: ToastrService) { 
    this.bcService.set('@productDetails', '');
  }

  addCategory(){
    console.log(this.CategoryForm.value.name);
    this.productService.createProductCategory(this.CategoryForm.value.name?.toString()).subscribe({
      next: () => {
        this.router.navigateByUrl('dashboard/product-category-list');
        this.toaster.success('Product Category added successfully');
      },
      error: error => {
        this.errors = error.errors
      } 
    })
  }
}
