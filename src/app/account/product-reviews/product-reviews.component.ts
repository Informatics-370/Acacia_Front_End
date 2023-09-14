import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { AccountService } from '../account.service';
import { ProductReview } from 'src/app/shared/models/ProductReview';
import { ReviewParams } from 'src/app/shared/models/ReviewParams';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-reviews',
  templateUrl: './product-reviews.component.html',
  styleUrls: ['./product-reviews.component.scss']
})
export class ProductReviewsComponent {
  @ViewChild('search') searchTerm?: ElementRef;
  reviews: ProductReview[] = [];
  modalRef?: BsModalRef;
  reviewParams: ReviewParams = new ReviewParams();
  sortOptions = [
    {name: 'Date: Low to High', value: 'dateAsc'},
    {name: 'Date: High to Low', value: 'dateDesc'},
    {name: 'Rating: Low to High', value: 'ratingAsc'},
    {name: 'Rating: High to Low', value: 'ratingDesc'},
  ];
  totalCount = 0;

  constructor(private accountService: AccountService, private router: Router, private modalService: BsModalService, private toaster: ToastrService){}

  ngOnInit(): void {
    this.getReviews();
  }

  getReviews(){
    this.accountService.getReviews(this.reviewParams).subscribe({
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

  deleteReview(id: number){
    this.accountService.deleteReview(id).subscribe({
      next: () => {
        this.modalRef?.hide(),
        this.router.navigateByUrl('/dashboard/reviews');
        this.toaster.success('Review Deleted');
        this.getReviews()
      },
      error: error => console.log(error)
    })
  }
  
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    }
}
