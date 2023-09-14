import { Component, ElementRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CartService } from 'src/app/cart/cart.service';
import { CheckoutService } from '../checkout.service';
import { ToastrService } from 'ngx-toastr';
import { NavigationExtras, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { OrderAddress } from 'src/app/shared/models/OrderAddress';
import { Cart } from 'src/app/shared/models/cart';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TestErrorComponent } from 'src/app/core/test-error/test-error.component';

@Component({
  selector: 'app-checkout-review',
  templateUrl: './checkout-review.component.html',
  styleUrls: ['./checkout-review.component.scss']
})
export class CheckoutReviewComponent implements OnInit{
  constructor(private cartService: CartService, private checkoutService: CheckoutService, private modalService: BsModalService, private toasterService: ToastrService, private router: Router){}

  @Input() checkoutForm?: FormGroup;
  modalRef?: BsModalRef;
  cartTotal = 0;
  @ViewChild('paymentRef', { static: true }) paymentRef!: ElementRef;

  ngOnInit(): void {
    this.cartService.cartTotalSource$.subscribe( res => {
      if(res){
        this.cartTotal = res.total
      }
    });
  }

  createPaymentIntent(){
    this.cartService.createPaymentIntent().subscribe({
      next: () => this.toasterService.success("Payment intent created"),
      error: error => this.toasterService.error(error.message)
    })
  }
























  submitOrder(){
    const cart = this.cartService.getCurrentCartValue();
    if(!cart) return;
    const orderToAdd = this.getOrderToMake(cart)
    if(!orderToAdd) return;
    console.log(orderToAdd) 
    this.createPaypalOrder().then((paypalOrderId: string) => {
      this.checkoutService.createOrder(orderToAdd).subscribe({
        next: (order) => {
          this.toasterService.success('Order created successfully');
          this.cartService.deleteLocalCart();
          const navigationExtras: NavigationExtras = { state: order };
          this.router.navigate(['checkout/success'], navigationExtras);
          console.log(order);
          this.modalRef?.hide();
          // this.checkoutService.confirmPayment(paypalOrderId, 1).subscribe({
          //   next: () => {itera}
          // })
        }
      });
    });
  }

  openModal(template: TemplateRef<any>) {
    const cart = this.cartService.getCurrentCartValue();
    if(!cart) return;
    this.checkoutService.VerifyCartStock(cart.id).subscribe({
      next: () => {
        this.modalRef = this.modalService.show(template);
        this.submitOrder();
        // this.modalRef?.hide();
      },
      error: () => {
        this.modalRef?.hide();
      }
    })
  }

    getOrderToMake(cart: Cart){
      this.checkoutForm?.get('deliveryForm')?.get('deliveryMethod')?.enable()
      this.checkoutForm?.get('orderTypeForm')?.get('orderTypeId')?.enable()
      const deliveryMethodId = this.checkoutForm?.get('deliveryForm')?.get('deliveryMethod')?.value
      const orderTypeId = this.checkoutForm?.get('orderTypeForm')?.get('orderTypeId')?.value
      const shipToAddress = this.checkoutForm?.get('addressForm')?.value as OrderAddress
      if(!deliveryMethodId || !shipToAddress) return
      return {
        basketId: cart.id,
        deliveryMethodId: deliveryMethodId,
        shipToAddress: shipToAddress,
        orderTypeId: orderTypeId
      }
  }

  createPaypalOrder(): Promise<string> {
    return new Promise((resolve, reject) => {
      window.paypal
        .Buttons({
          createOrder: (data: any, actions: any) => {
            const amount = parseFloat((this.cartTotal * 0.058).toFixed(2)); 
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: amount.toString(),
                    currency_code: 'USD'
                  }
                }
              ]
            });
          },
          onApprove: (data: any, actions: any) => {
            return actions.order.capture().then((details: any) => {
              if (details.status === 'COMPLETED') {
                const paypalOrderId: string = details.id;
                resolve(paypalOrderId);
              } else {
                reject('Payment not completed');
              }
            });
          },
          onError: (error: any) => {
            reject(error);
          }
        })
        .render('#paypal-button-container');
    });
  }
  
  
  }
