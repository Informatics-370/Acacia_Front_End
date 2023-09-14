import { Component } from '@angular/core';
import { FaqService } from '../faq.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Faq } from 'src/app/shared/models/faq';
const Filter = require('bad-words');

@Component({
  selector: 'app-faq-details',
  templateUrl: './faq-details.component.html',
  styleUrls: ['./faq-details.component.scss']
})
export class FaqDetailsComponent {
  errors: string[] | null = null;
  whitespace = "[a-zA-Z0-9][a-zA-Z0-9 ]+"

  faqForm = new FormGroup({
    id: new FormControl(0),
    question: new FormControl('', {
      validators: [Validators.required, this.validateProfanity, Validators.pattern(this.whitespace)],
    }),
    answer: new FormControl('', {
      validators: [Validators.required, this.validateProfanity, Validators.pattern(this.whitespace)],
    })
  });

  faq?: Faq;

  constructor(private faqService: FaqService, private activatedRoute: ActivatedRoute, private bcService: BreadcrumbService, private router: Router, private toaster: ToastrService) { 
    this.bcService.set('@faqDetails', '');
  }

  ngOnInit(): void {
    this.loadFaq();  
  }

  loadFaq(){
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) this.faqService.getFaq(+id).subscribe({
      next: faq => {
        faq && this.faqForm.patchValue(faq);
        this.faq = faq,
        this.bcService.set('@faqDetails', faq.question);
        console.log(this.faqForm.value);
      },
      error: err => console.log(err)
    })
  }
  
  updateFaq(){
    this.faqService.updateFaq(this.faqForm.value).subscribe({
      next: () => {
        this.router.navigateByUrl('/dashboard/faq-list');
        this.toaster.success('Faq updated');
      },
      error: error => {
        this.errors = error.errors
      } 
    })
  }

  validateProfanity(control: FormControl): { [key: string]: any } | null {
    const filter = new Filter();
    const value = control.value as string;

    if (filter.isProfane(value)) {
      return { profanity: true };
    }

    return null;
  }

}
