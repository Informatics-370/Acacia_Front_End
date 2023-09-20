import { Component, Input, ViewChild } from '@angular/core';
import { CheckoutService } from '../checkout.service';
import { CartService } from 'src/app/cart/cart.service';
import { OrderType } from 'src/app/shared/models/OrderType';
import { FormGroup } from '@angular/forms';
import { AccountService } from 'src/app/account/account.service';
import { User } from 'src/app/shared/models/user';
import { DeliveryMethod } from 'src/app/shared/models/deliveryMethod';

@Component({
  selector: 'app-checkout-order-type',
  templateUrl: './checkout-order-type.component.html',
  styleUrls: ['./checkout-order-type.component.scss']
})

export class CheckoutOrderTypeComponent {
  @Input() checkoutForm?: FormGroup;
  orderTypes: OrderType[] = [];
  deliveryMethods: DeliveryMethod[] = [];
  user?: User | null

  constructor(private checkoutService: CheckoutService, private cartService: CartService, public accountService: AccountService){}

  ngOnInit(): void {
    this.accountService.currentUser$.subscribe({
      next: user => {
        this.user = user
      }
    })

    this.checkoutService.getDeliveryMethods().subscribe({
      next: d => this.deliveryMethods = d
    })

    this.checkoutService.getOrderTypes().subscribe({
      next: d => {
        if(this.user && this.user.roles[0] == 'Externalcustomer'){
          this.orderTypes = d.filter(type => type.name != "Pay-and-Go");
        }
        else{
          this.orderTypes = d
        }

      }
    })
  }

  onSelection(){
    let orderId = this.checkoutForm?.get('orderTypeForm')?.get('orderTypeId')?.value
    if(orderId == 1 || orderId == 3){
      let deliveryId = this.deliveryMethods.find(x => x.price == 0)
      if(deliveryId){
        this.cartService.setShippingPrice(deliveryId)
      }
      this.checkoutForm?.get('addressForm')?.get('firstName')?.patchValue("N/A")
      this.checkoutForm?.get('addressForm')?.get('lastName')?.patchValue("N/A")
      this.checkoutForm?.get('addressForm')?.get('streetAddress')?.patchValue("N/A")
      this.checkoutForm?.get('addressForm')?.get('complexName')?.patchValue("N/A")
      this.checkoutForm?.get('addressForm')?.get('city')?.patchValue("N/A")
      this.checkoutForm?.get('addressForm')?.get('province')?.patchValue("N/A")
      this.checkoutForm?.get('addressForm')?.get('postalCode')?.patchValue("4399")
      this.checkoutForm?.get('addressForm')?.get('suburb')?.patchValue("N/A")
      this.checkoutForm?.get('deliveryForm')?.get('deliveryMethod')?.patchValue(deliveryId?.id)
      this.checkoutForm?.get('addressForm')?.disable();
      this.checkoutForm?.get('deliveryForm')?.disable();
    }
    else{
      this.checkoutForm?.get('addressForm')?.enable();
      this.checkoutForm?.get('deliveryForm')?.enable();
      this.checkoutForm?.get('deliveryForm')?.get('deliveryMethod')?.patchValue(0)
      this.checkoutForm?.get('addressForm')?.get('firstName')?.patchValue("")
      this.checkoutForm?.get('addressForm')?.get('lastName')?.patchValue("")
      this.getAddressFormValues()
    }
  }

  getAddressFormValues(){
    this.accountService.GetUserAddress().subscribe({
      next: address => {
        address && this.checkoutForm?.get('addressForm')?.patchValue(address)
      }
    })
  }
}



