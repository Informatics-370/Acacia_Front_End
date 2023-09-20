import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SupplierService } from '../supplier.service';
import { BreadcrumbService } from 'xng-breadcrumb';
import { Supplier } from 'src/app/shared/models/Supplier';

@Component({
  selector: 'app-supplier-details',
  templateUrl: './supplier-details.component.html',
  styleUrls: ['./supplier-details.component.scss']
})
export class SupplierDetailsComponent {
  errors: string[] | null = null;
  supplier?: Supplier;
  whitespace = "[a-zA-Z0-9][a-zA-Z0-9 ]+"
  SupplierForm = new FormGroup({
    id: new FormControl(0),
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phoneNumber: new FormControl(0, Validators.required)
  });

  constructor(private supplierService: SupplierService, private router: Router, private toaster: ToastrService, private bcService: BreadcrumbService, private activatedRoute: ActivatedRoute) { 
    this.bcService.set('@supplierDetails', '');
  }

  ngOnInit(): void {
    this.loadSupplier();  
  }

  loadSupplier(){
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) this.supplierService.getSupplier(+id).subscribe({
      next: supplier => {
        supplier && this.SupplierForm.patchValue(supplier);
        this.supplier = supplier,
        this.bcService.set('@supplierDetails', supplier.name);
        console.log(this.SupplierForm.value);
      },
      error: err => console.log(err)
    })
  }
  
  updateSupplier(){
    this.supplierService.updateSupplier(this.SupplierForm.value).subscribe({
      next: () => {
        this.router.navigateByUrl('/dashboard/supplier-list');
        this.toaster.success('Supplier updated');
      },
      error: error => {
        this.errors = error.errors
      } 
    })
  }

}
