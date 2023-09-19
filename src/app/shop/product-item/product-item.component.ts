import { Component, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { CartService } from 'src/app/cart/cart.service';
import { Product } from 'src/app/shared/models/product';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss']
})
export class ProductItemComponent {
  @Input () product?: Product;
  quantity = 1;
  quantityInCart = 0;

  constructor(private cartService: CartService, private toaster: ToastrService) { }

  ngOnInit(): void{
    if(this.product){
      this.cartService.cartSource$.pipe(take(1)).subscribe({
        next: cart => {
          const item = cart?.items.find(i => i.id === this.product?.id);
          if (item) {
            this.quantity = item.quantity;
            this.quantityInCart = item.quantity;
          }
        }
      })
    }
  }

  addItemToCart(){
    if (this.product && this.product.quantity > 0 && this.product.quantity >=  (this.quantityInCart + 1)){
      this.cartService.addItemToCart(this.product);
    }else{
      this.toaster.warning("Sorry, there is not enough stock.")
    }
  }
}


