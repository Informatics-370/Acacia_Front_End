import { Component } from '@angular/core';
import { ProductService } from '../product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Type } from 'src/app/shared/models/type';

@Component({
  selector: 'app-update-product-type',
  templateUrl: './update-product-type.component.html',
  styleUrls: ['./update-product-type.component.scss']
})
export class UpdateProductTypeComponent {
  errors: string[] | null = null;
  whitespace = "[a-zA-Z0-9][a-zA-Z0-9 ]+"

  TypeForm = new FormGroup({
    id: new FormControl(0),
    name: new FormControl('', [Validators.required]),
  });

  type?: Type;

  constructor(private productService: ProductService, private activatedRoute: ActivatedRoute, private bcService: BreadcrumbService, private router: Router, private toaster: ToastrService) { 
    this.bcService.set('@typeDetails', '');
  }

  ngOnInit(): void {
    this.loadType();  
  }

  loadType(){
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) this.productService.getType(+id).subscribe({
      next: type => {
        type && this.TypeForm.patchValue(type);
        this.type = type,
        this.bcService.set('@typeDetails', type.name);
        console.log(this.TypeForm.value);
      },
      error: err => console.log(err)
    })
  }
  
  updateType(){
    this.productService.updateProductType(this.TypeForm.value).subscribe({
      next: () => {
        this.router.navigateByUrl('/dashboard/product-type-list');
        this.toaster.success('Product Type updated');
      },
      error: error => {
        this.errors = error.errors
      } 
    })
  }
}
