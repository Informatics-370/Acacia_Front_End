import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SupplierService } from '../supplier.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-supplier',
  templateUrl: './add-supplier.component.html',
  styleUrls: ['./add-supplier.component.scss']
})
export class AddSupplierComponent {
  errors: string[] | null = null;
  whitespace = "[a-zA-Z0-9][a-zA-Z0-9 ]+"
  SupplierForm = new FormGroup({
    id: new FormControl(0),
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phoneNumber: new FormControl(0, [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.min(1)])
  });

  constructor(private supplierService: SupplierService, private router: Router, private toaster: ToastrService) { 
  }

  addSupplier(){
    console.log(this.SupplierForm.value);
    this.supplierService.addSupplier(this.SupplierForm.value).subscribe({
      next: () => {
        this.router.navigateByUrl('dashboard/supplier-list');
        this.toaster.success('Supplier added successfully');
      },
      error: error => {
        this.errors = error.errors
      } 
    })
  }
}
