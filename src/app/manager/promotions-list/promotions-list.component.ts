import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PromotionListVM } from 'src/app/shared/models/PromotionListVM';
import { PromotionService } from '../promotion.service';
import { promoSpecParams } from 'src/app/shared/models/promotionSpecParams';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-promotions-list',
  templateUrl: './promotions-list.component.html',
  styleUrls: ['./promotions-list.component.scss']
})
export class PromotionsListComponent {
  constructor(private promoService: PromotionService, private activatedroute: ActivatedRoute, private router: Router, private modalService: BsModalService, private toaster: ToastrService){}
  ngOnInit(): void {
    this.getPromotions();
  }
  
  modalRef?: BsModalRef;
  @ViewChild('search') searchTerm?: ElementRef;
  promotions: PromotionListVM[] = [];
  specParams: promoSpecParams = new promoSpecParams();
  sortOptions = [
    {name: 'Alphabetical: A-Z', value: 'nameAsc'},
    {name: 'Alphabetical: Z-A', value: 'nameDesc'},
    {name: 'Percentage: Low to High', value: 'percentageAsc'},
    {name: 'Alphabetical: High to Low', value: 'percentageDesc'},
  ];
  totalCount = 0;
  
  getPromotions(){
    this.promoService.getPromotions(this.specParams).subscribe({
      next: response => {
        this.promotions = response.data;
        this.specParams.pageNumber = response.pageIndex;
        this.specParams.pageSize = response.pageSize;
        this.totalCount = response.count;
        console.log(this.promotions);
      },
      error: error => console.log(error)
    })
  }
  
  onSortSelected(event: any)
  {
    this.specParams.sort = event.target.value;
    this.getPromotions();
  }
  
  onSearch(){
    this.specParams.search = this.searchTerm?.nativeElement.value;
    this.specParams.pageNumber = 1;  
    this.getPromotions();
  }
  
  onReset(){
    if(this.searchTerm) this.searchTerm.nativeElement.value = '';
    this.specParams = new promoSpecParams();
    this.getPromotions();
  }
  
  onPageChanged(event: any)
  {
    if(this.specParams.pageNumber !== event)
    {
      this.specParams.pageNumber = event;
      this.getPromotions();
    }
  }
  
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    }
  
    deletePromotion(id: number){
    this.promoService.deletePromotion(id).subscribe({
      next: () => {
        this.modalRef?.hide(),
        this.router.navigateByUrl('/dashboard/promotions-list');
        this.toaster.success('Promotion Deleted');
        this.getPromotions()
      },
      error: error => console.log(error)
    })
  }
  
}
