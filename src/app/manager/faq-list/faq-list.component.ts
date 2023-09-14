import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { FaqService } from '../faq.service';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { Faq } from 'src/app/shared/models/faq';
import { specParams } from 'src/app/shared/models/specParams';

@Component({
  selector: 'app-faq-list',
  templateUrl: './faq-list.component.html',
  styleUrls: ['./faq-list.component.scss']
})
export class FaqListComponent {
  constructor(private faqService: FaqService, private toaster: ToastrService, private modalService: BsModalService, private router: Router) { } 
  ngOnInit(): void {
    this.getFaqs();
  }

  modalRef?: BsModalRef;
  @ViewChild('search') searchTerm?: ElementRef;
  faqs: Faq[] = [];
  specParams: specParams = new specParams();
  sortOptions = [
    {name: 'Alphabetical: A-Z', value: 'AnsAsc'},
    {name: 'Alphabetical: Z-A', value: 'DescAns'},
  ];
  totalCount = 0;

  getFaqs(){
    this.faqService.getFaqs(this.specParams).subscribe({
      next: response => {
        this.faqs = response.data;
        this.specParams.pageNumber = response.pageIndex;
        this.specParams.pageSize = response.pageSize;
        this.totalCount = response.count;
        console.log(this.faqs);
      },
      error: error => console.log(error)
    })
  }

  onSortSelected(event: any)
  {
    this.specParams.sort = event.target.value;
    this.getFaqs();
  }

  onSearch(){
    this.specParams.search = this.searchTerm?.nativeElement.value;
    this.specParams.pageNumber = 1;  
    this.getFaqs();
  }

  onReset(){
    if(this.searchTerm) this.searchTerm.nativeElement.value = '';
    this.specParams = new specParams();
    this.getFaqs();
  }

  onPageChanged(event: any)
  {
    if(this.specParams.pageNumber !== event)
    {
      this.specParams.pageNumber = event;
      this.getFaqs();
    }
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    }

  deleteFaq(id: number){
    this.faqService.deleteFaq(id).subscribe({
      next: () => {
        this.modalRef?.hide(),
        this.router.navigateByUrl('/dashboard/faq-list');
        this.toaster.success('FAQ Deleted');
        this.getFaqs()
      },
      error: error => console.log(error)
    })
  }
}
