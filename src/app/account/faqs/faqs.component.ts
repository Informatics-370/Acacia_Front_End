import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FaqService } from 'src/app/manager/faq.service';
import { Faq } from 'src/app/shared/models/faq';
import { specParams } from 'src/app/shared/models/specParams';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.scss']
})

export class FaqsComponent {
  constructor(private faqService: FaqService, private toaster: ToastrService, private router: Router) { } 
  ngOnInit(): void {
    this.getFaqs();
  }

  modalRef?: BsModalRef;
  @ViewChild('search') searchTerm?: ElementRef;
  specParams: specParams = new specParams();
  sortOptions = [
    {name: 'Alphabetical: A-Z', value: 'AnsAsc'},
    {name: 'Alphabetical: Z-A', value: 'DescAns'},
  ];
  totalCount = 0;

  faqs: Faq[] = [];


  getFaqs(){
    this.faqService.getFaqs(this.specParams).subscribe({
      next: response => {
        this.faqs = response.data;
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

}
