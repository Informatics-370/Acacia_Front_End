import { Component } from '@angular/core';
import { ProductService } from '../product.service';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Category } from 'src/app/shared/models/category';

@Component({
  selector: 'app-update-product-category',
  templateUrl: './update-product-category.component.html',
  styleUrls: ['./update-product-category.component.scss']
})
export class UpdateProductCategoryComponent {
  errors: string[] | null = null;
  whitespace = "[a-zA-Z0-9][a-zA-Z0-9 ]+"
  CategoryForm = new FormGroup({
    id: new FormControl(0),
    name: new FormControl('', [Validators.required]),
  });

  category?: Category;

  constructor(private productService: ProductService, private activatedRoute: ActivatedRoute, private bcService: BreadcrumbService, private router: Router, private toaster: ToastrService) { 
    this.bcService.set('@categoryDetails', '');
  }

  ngOnInit(): void {
    this.loadCategory();  
  }

  loadCategory(){
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) this.productService.getCategory(+id).subscribe({
      next: category => {
        category && this.CategoryForm.patchValue(category);
        this.category = category,
        this.bcService.set('@categoryDetails', category.name);
        console.log(this.CategoryForm.value);
      },
      error: err => console.log(err)
    })
  }
  
  updateCategory(){
    this.productService.updateProductCategory(this.CategoryForm.value).subscribe({
      next: () => {
        this.router.navigateByUrl('/dashboard/product-category-list');
        this.toaster.success('Product Category updated');
      },
      error: error => {
        this.errors = error.errors
      } 
    })
  }

}
