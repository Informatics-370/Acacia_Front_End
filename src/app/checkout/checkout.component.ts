import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AccountService } from '../account/account.service';
import { CartService } from '../cart/cart.service';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  checkoutForm = this.fb.group({
    addressForm: this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      streetAddress: ['', Validators.required],
      complexName: ['', Validators.required],
      city: ['', Validators.required],
      province: ['', Validators.required],
      postalCode: [0, [Validators.required, Validators.min(1), Validators.minLength(4), Validators.maxLength(4)]],
      suburb: ['', Validators.required],
    }),
    deliveryForm: this.fb.group({
      deliveryMethod: [0, [Validators.required, Validators.min(1)]],
    }),
    orderTypeForm: this.fb.group({
      orderTypeId: [0, [Validators.required, Validators.min(1)]],
    })
  })

  constructor(private fb: FormBuilder, private accountService: AccountService, private cartService: CartService){}
  
  ngOnInit(): void {
    this.getAddressFormValues()
    this.getDeliveryMethod()
  }

  getAddressFormValues(){
    this.accountService.GetUserAddress().subscribe({
      next: address => {
        address && this.checkoutForm.get('addressForm')?.patchValue(address)
      }
    })
  }

  getDeliveryMethod(){
    const cart = this.cartService.getCurrentCartValue();
    if(cart && cart.deliveryMethodId){
      this.checkoutForm.get('deliveryForm')?.get('deliveryMethod')?.patchValue(cart.deliveryMethodId)
    }
  }
}

