import { Component } from '@angular/core';
import { DeliveryMethodsService } from '../delivery-methods.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';
import { DeliveryMethod } from 'src/app/shared/models/deliveryMethod';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delivery-method-details',
  templateUrl: './delivery-method-details.component.html',
  styleUrls: ['./delivery-method-details.component.scss']
})
export class DeliveryMethodDetailsComponent {
  errors: string[] | null = null;
  whitespace = "[a-zA-Z0-9][a-zA-Z0-9 ]+"
  deliveryMethodForm = new FormGroup({
    id: new FormControl(0),
    name: new FormControl('', [Validators.required]),
    deliveryTime: new FormControl('',[Validators.required]),
    description: new FormControl('', [Validators.required]),
    price: new FormControl(0, [Validators.required, Validators.min(1)]),
  });

  deliveryMethod?: DeliveryMethod;

  constructor(private faqService: DeliveryMethodsService, private activatedRoute: ActivatedRoute, private bcService: BreadcrumbService, private router: Router, private toaster: ToastrService) { 
    this.bcService.set('@deliveryDetails', '');
  }

  ngOnInit(): void {
    this.loadDeliveryMethod();  
  }

  loadDeliveryMethod(){
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) this.faqService.getDeliveryMethod(+id).subscribe({
      next: deliveryMethod => {
        deliveryMethod && this.deliveryMethodForm.patchValue(deliveryMethod);
        this.deliveryMethod = deliveryMethod,
        this.bcService.set('@deliveryDetails', deliveryMethod.name);
        console.log(this.deliveryMethodForm.value);
      },
      error: err => console.log(err)
    })
  }
  
  updateDeliveryMethod(){
    this.faqService.updateDeliveryMethod(this.deliveryMethodForm.value).subscribe({
      next: () => {
        this.router.navigateByUrl('/dashboard/DeliveryMethods');
        this.toaster.success('Delivery Method updated');
      },
      error: error => {
        this.errors = error.errors
      } 
    })
  }
}
