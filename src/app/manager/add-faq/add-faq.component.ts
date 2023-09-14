import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BreadcrumbService } from 'xng-breadcrumb';
import { FaqService } from '../faq.service';
const Filter = require('bad-words');
@Component({
  selector: 'app-add-faq',
  templateUrl: './add-faq.component.html',
  styleUrls: ['./add-faq.component.scss']
})
export class AddFaqComponent {
  errors: string[] | null = null;
  whitespace = "[a-zA-Z0-9][a-zA-Z0-9 ]+"
  FaqForm = new FormGroup({
    id: new FormControl(0),
    question: new FormControl('', {
      validators: [Validators.required, this.validateProfanity, Validators.pattern(this.whitespace)],
    }),
    answer: new FormControl('', {
      validators: [Validators.required, this.validateProfanity, Validators.pattern(this.whitespace)],
    })
  });


  constructor(private faqService: FaqService, private router: Router, private toaster: ToastrService) { 
  }

  addFaq(){
    console.log(this.FaqForm.value);
    this.faqService.addFaq(this.FaqForm.value).subscribe({
      next: () => {
        this.router.navigateByUrl('dashboard/faq-list');
        this.toaster.success('FAQ added successfully');
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
