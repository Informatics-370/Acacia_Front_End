import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { ReviewService } from '../review.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductReview } from 'src/app/shared/models/ProductReview';
import { ReviewParams } from 'src/app/shared/models/ReviewParams';

@Component({
  selector: 'app-review-list',
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.scss']
})
export class ReviewListComponent {
  @ViewChild('search') searchTerm?: ElementRef;
  reviews: ProductReview[] = [];
  reviewParams: ReviewParams = new ReviewParams();
  sortOptions = [
    {name: 'Date: Low to High', value: 'dateAsc'},
    {name: 'Date: High to Low', value: 'dateDesc'},
    {name: 'Rating: Low to High', value: 'ratingAsc'},
    {name: 'Rating: High to Low', value: 'ratingDesc'},
  ];
  totalCount = 0;

  constructor(private reviewService: ReviewService, private router: Router, private toaster: ToastrService){}

  ngOnInit(): void {
    this.getReviews();
  }

  getReviews(){
    this.reviewService.getReviews(this.reviewParams).subscribe({
      next: response => {
        this.reviews = response.data;
        this.reviewParams.pageNumber = response.pageIndex;
        this.reviewParams.pageSize = response.pageSize;
        this.totalCount = response.count;
      },
      error: error => console.log(error)
    })
  }

  onSortSelected(event: any)
  {
    this.reviewParams.sort = event.target.value;
    this.getReviews();
  }

  onPageChanged(event: any)
  {
    if(this.reviewParams.pageNumber !== event)
    {
      this.reviewParams.pageNumber = event;
      this.getReviews();
    }
  }

  onSearch(){
    this.reviewParams.search = this.searchTerm?.nativeElement.value;
    this.reviewParams.pageNumber = 1;  
    this.getReviews();
  }

  onReset(){
    if(this.searchTerm) this.searchTerm.nativeElement.value = '';
    this.reviewParams = new ReviewParams();
    this.getReviews();
  }
}
