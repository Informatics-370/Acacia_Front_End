import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DeliveryMethod } from 'src/app/shared/models/deliveryMethod';
import { DeliveryMethodsService } from '../delivery-methods.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-delivery-method',
  templateUrl: './add-delivery-method.component.html',
  styleUrls: ['./add-delivery-method.component.scss']
})
export class AddDeliveryMethodComponent {
  errors: string[] | null = null;
  whitespace = "[a-zA-Z0-9][a-zA-Z0-9 ]+"

  deliveryMethodForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    deliveryTime: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    price: new FormControl(0, [Validators.required, Validators.min(1)]),
  });

  deliveryMethod?: DeliveryMethod;

  constructor(private deliveryService: DeliveryMethodsService, private bcService: BreadcrumbService, private router: Router, private toaster: ToastrService) { 
  }

  ngOnInit(): void {
  }

  addDeliveryMethod(){
    console.log(this.deliveryMethodForm.value);
    this.deliveryService.addDeliveryMethod(this.deliveryMethodForm.value).subscribe({
      next: () => {
        this.router.navigateByUrl('dashboard/DeliveryMethods');
        this.toaster.success('Delivery Method added successfully');
      },
      error: error => {
        this.errors = error.errors
      } 
    })
  }
}
