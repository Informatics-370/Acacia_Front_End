import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FaqService } from 'src/app/manager/faq.service';
import { Faq } from 'src/app/shared/models/faq';
import { specParams } from 'src/app/shared/models/specParams';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.scss']
})

// @Component({
//   // eslint-disable-next-line @angular-eslint/component-selector
//   selector: 'demo-accordion-animation',
//   templateUrl: './animated.html'
// })
export class FaqsComponent {
  constructor(private faqService: FaqService, private toaster: ToastrService, private router: Router) { } 
  ngOnInit(): void {
    this.getFaqs();
  }

  faqs: Faq[] = [];
  specParams: specParams = new specParams();

  getFaqs(){
    this.faqService.getFaqs(this.specParams).subscribe({
      next: response => {
        this.faqs = response.data;
        console.log(this.faqs);
      },
      error: error => console.log(error)
    })
  }
}
