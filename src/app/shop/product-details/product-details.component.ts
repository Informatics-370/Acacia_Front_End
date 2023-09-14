import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/shared/models/product';
import { ShopService } from '../shop.service';
import { BreadcrumbService } from 'xng-breadcrumb';
import { CartService } from 'src/app/cart/cart.service';
import { take } from 'rxjs';
import { WishlistService } from 'src/app/wishlist/wishlist.service';
import { ReviewParams } from 'src/app/shared/models/ReviewParams';
import { ProductReview } from 'src/app/shared/models/ProductReview';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountService } from 'src/app/account/account.service';
import { User } from 'src/app/shared/models/user';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
const Filter = require('bad-words');

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit{
  errors: string[] | null = null;
  product?: Product;
  quantity = 1;
  quantityInCart = 0;
  productInWishlist = false;
  user?: User | null
  whitespace = "[a-zA-Z0-9][a-zA-Z0-9 ]+"

  reviews: ProductReview[] = [];
  reviewParams: ReviewParams = new ReviewParams();

  modalRef?: BsModalRef;

  reviewForm = new FormGroup({
    title: new FormControl('', [Validators.required, this.validateProfanity, Validators.pattern(this.whitespace)]),
    description: new FormControl('', [Validators.required, this.validateProfanity, Validators.pattern(this.whitespace)]),
    rating: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(5)]),
    customerEmail: new FormControl('', Validators.email),
    productId: new FormControl(0),
    status: new FormControl(''),
  });


  constructor(private shopService: ShopService, private activatedRoute: ActivatedRoute, private bcService: BreadcrumbService, private cartService: CartService, private wishlistService: WishlistService, 
    private router: Router, private toaster: ToastrService, public accountService: AccountService, private modalService: BsModalService) { 
    this.bcService.set('@productDetails', '');
  }
  
  ngOnInit(): void {
    this.loadProducts();
    this.getReviews()
    this.accountService.currentUser$.subscribe({
      next: user => {
        this.user = user
      }
    })
  }

  createReview(){
    let rating = this.reviewForm.value.rating
    this.reviewForm.value.customerEmail = this.user?.email
    this.reviewForm.value.status = "Available"
    this.reviewForm.value.productId = this.product?.id
    if(rating && Number.isInteger(+rating) == false){
      this.errors = ["Only whole numbers up to 5 are accepted."]
      return
    }
    
    if(this.reviewForm.valid){
      this.shopService.createReview(this.reviewForm.value).subscribe({
        next: response => {
          this.router.navigateByUrl('/shop');
          this.toaster.success('Review posted');
        },
        error: error => this.errors = error.errors
      })
    }
  }

  getReviews(){
    this.reviewParams.productId = +this.activatedRoute.snapshot.paramMap.get('id')!;
    this.shopService.getReviews(this.reviewParams).subscribe({
      next: response => {
        this.reviews = response.data;
        this.reviewParams.pageNumber = response.pageIndex;
        this.reviewParams.pageSize = response.pageSize;
      },
      error: error => console.log(error)
    })
  }

  loadProducts(){
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) this.shopService.getProduct(+id).subscribe({
      next: product => {
        this.product = product,
        this.bcService.set('@productDetails', product.name);
        this.cartService.cartSource$.pipe(take(1)).subscribe({
          next: cart => {
            const item = cart?.items.find(i => i.id === +id);
            if (item) {
              this.quantity = item.quantity;
              this.quantityInCart = item.quantity;
            }
          }
        })
        this.wishlistService.wishlistSource$.pipe(take(1)).subscribe({
          next: wishlist => {
            const item = wishlist?.items.find(i => i.id === +id);
            if (item) {
              this.productInWishlist = true;
            }
          }
        })

      },
      error: err => console.log(err)
    })
  }

  incrementQuanity(){
    this.quantity++;
  }

  decrementQuanity(){
    this.quantity--;
  }

  updateCart(){
    if (this.product){
      if (this.quantity > this.quantityInCart){
        const itemsToAdd = this.quantity - this.quantityInCart;
        this.quantityInCart += itemsToAdd;
        this.cartService.addItemToCart(this.product, itemsToAdd);
      }else{
        const itemsToRemove = this.quantityInCart - this.quantity;
        this.quantityInCart -= itemsToRemove;
        this.cartService.removeItemFromCart(this.product.id, itemsToRemove);
      }
    }
  }

  validateProfanity(control: FormControl): { [key: string]: any } | null {
    const filter = new Filter();
    const value = control.value as string;
    if (filter.isProfane(value)) {
      return { profanity: true };
    }
    return null;
  }

  updateWishlist(){
    if (this.product){
      this.wishlistService.addItemToWishlist(this.product);
      this.productInWishlist = true
    }
  }

  get wishlistButtonText(){
    return this.productInWishlist === false ? 'Add to Wishlist' : 'Item in Wishlist';
  }

  get CartbuttonText(){
    return this.quantityInCart === 0 ? 'Add to Cart' : 'Update Cart';
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    }

}
