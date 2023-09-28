import { Component } from '@angular/core';
import { AccountService } from '../account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductReview } from 'src/app/shared/models/ProductReview';

@Component({
  selector: 'app-product-review-details',
  templateUrl: './product-review-details.component.html',
  styleUrls: ['./product-review-details.component.scss']
})
export class ProductReviewDetailsComponent {
  errors: string[] | null = null;
  whitespace = "[a-zA-Z0-9][a-zA-Z0-9 ]+"

  reviewForm = new FormGroup({
    id: new FormControl(0),
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    customerEmail: new FormControl({value: '', disabled: true}, Validators.required),
    product: new FormControl({value: '', disabled: true}, Validators.required),
    date: new FormControl({value: '', disabled: true}, Validators.required),
    rating: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(5)]),
    status: new FormControl({value: '', disabled: true}, Validators.required),
  });

  review?: ProductReview;

  constructor(private accountService: AccountService, private activatedRoute: ActivatedRoute, private bcService: BreadcrumbService, private router: Router, private toaster: ToastrService) { 
    this.bcService.set('@reviewDetails', '');
  }

  ngOnInit(): void {
    this.loadReview();  
  }

  loadReview(){
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) this.accountService.getReview(+id).subscribe({
      next: review => {
        review && this.reviewForm.patchValue(review);
        this.review = review,
        this.bcService.set('@reviewDetails', review.title);
        console.log(this.reviewForm.value);
      },
      error: err => console.log(err)
    })
  }
  
  updateReview(){
    this.accountService.updateReview(this.reviewForm.value).subscribe({
      next: () => {
        this.router.navigateByUrl('/account/reviews');
        this.toaster.success('Review updated');
      },
      error: error => {
        this.errors = error.errors
      } 
    })
  }
}
