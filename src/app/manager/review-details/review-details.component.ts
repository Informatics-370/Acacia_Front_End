import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/account/account.service';
import { ProductReview } from 'src/app/shared/models/ProductReview';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ReviewService } from '../review.service';

@Component({
  selector: 'app-review-details',
  templateUrl: './review-details.component.html',
  styleUrls: ['./review-details.component.scss']
})
export class ReviewDetailsComponent {
  errors: string[] | null = null;

  reviewForm = new FormGroup({
    id: new FormControl(0),
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    customerEmail: new FormControl({value: '', disabled: true}, Validators.required),
    product: new FormControl({value: '', disabled: true}, Validators.required),
    date: new FormControl({value: '', disabled: true}, Validators.required),
    rating: new FormControl(0, Validators.required),
    status: new FormControl({value: '', disabled: true}, Validators.required),
  });

  review?: ProductReview;

  constructor(private reviewService: ReviewService, private activatedRoute: ActivatedRoute, private bcService: BreadcrumbService, private router: Router, private toaster: ToastrService) { 
    this.bcService.set('@reviewDetails', '');
  }

  ngOnInit(): void {
    this.loadReview();  
    this.reviewForm.disable()
  }

  loadReview(){
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) this.reviewService.getReview(+id).subscribe({
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
    this.reviewService.updateReview(this.reviewForm.value).subscribe({
      next: () => {
        this.router.navigateByUrl('/dashboard/reviews');
        this.toaster.success('Review updated');
      },
      error: error => {
        this.errors = error.errors
      } 
    })
  }

  FlagReview(){
    this.reviewService.flagReview(this.review?.id).subscribe({
      next: () => {
        this.router.navigateByUrl('/dashboard/reviews');
        this.toaster.success('Review has been Flagged');
      },
      error: error => {
        this.errors = error.errors
      } 
    })
  }

  UnFlagReview(){
    this.reviewService.unFlagReview(this.review?.id).subscribe({
      next: () => {
        this.router.navigateByUrl('/dashboard/reviews');
        this.toaster.success('Review has been made Available');
      },
      error: error => {
        this.errors = error.errors
      } 
    })
  }

}
