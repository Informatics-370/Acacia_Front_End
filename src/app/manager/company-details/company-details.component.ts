import { Component } from '@angular/core';
import { CompanyService } from '../company.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.scss']
})
export class CompanyDetailsComponent {
  errors: string[] | null = null;
  provinceList = [
    {name: 'Free State', value: 'Free State'},
    {name: 'Mpumalanga', value: 'Mpumalanga'},
    {name: 'Northen Province', value: 'Northen Province'},
    {name: 'Eastern Cape', value: 'Eastern Cape'},
    {name: 'Limpopo', value: 'Limpopo'},
    {name: 'North West Province', value: 'North West Province'},
    {name: 'KwaZulu-Natal', value: 'KwaZulu-Natal'},
    {name: 'Gauteng', value: 'Gauteng'},
  ];
  whitespace = "[a-zA-Z0-9][a-zA-Z0-9 ]+"
  companyForm = new FormGroup({
    vatNumber: new FormControl(0,[Validators.required, Validators.min(1)]),
    addressLine1: new FormControl('', [Validators.required]),
    addressLine2: new FormControl(''),
    suburb: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    province: new FormControl('', Validators.required),
    postalCode: new FormControl(0, [Validators.required, Validators.min(1), Validators.minLength(4), Validators.maxLength(4)]),
    id: new FormControl(0, Validators.required)
  });

  constructor(public companyService: CompanyService, private router: Router, private toaster: ToastrService, private fb: FormBuilder, private bcService: BreadcrumbService,) {
    this.bcService.set('@companyDetails', 'Company Details');
   }
  ngOnInit(): void {
    this.getCompany();
  }
  
  getCompany(){
    this.companyService.loadCompany(1).subscribe();
    this.companyService.company$.subscribe({
      next: companyDetails => {
        companyDetails && this.companyForm.patchValue(companyDetails);
        console.log(this.companyForm.value)
        console.log(this.companyService.company$);
      }
    })
  }

  updateCompany(){
    this.companyService.updateCompany(this.companyForm.value).subscribe({
      next: () => {
        this.router.navigateByUrl('/dashboard/company-details/1');
        this.toaster.success('Company updated successfully');
        this.companyForm.reset(this.companyForm.value);
      },
      error: error => {
        this.errors = error.errors
      } 
    })
  }

  onProvinceSelected(event: any){
    this.companyForm.value.province = event.target.value;
  }
}
