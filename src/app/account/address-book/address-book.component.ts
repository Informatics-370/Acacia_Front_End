import { Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
//my imports
import { UserParams } from 'src/app/shared/models/userParams';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'app-address-book',
  templateUrl: './address-book.component.html',
  styleUrls: ['./address-book.component.scss']
})

export class AddressBookComponent implements OnInit {
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
  addressForm = new FormGroup({
    streetAddress: new FormControl('',[Validators.required, Validators.pattern(this.whitespace)]),
    complexName: new FormControl('', [Validators.required, Validators.pattern(this.whitespace)]),
    suburb: new FormControl('', [Validators.required, Validators.pattern(this.whitespace)]),
    city: new FormControl('', [Validators.required, Validators.pattern(this.whitespace)]),
    province: new FormControl('', Validators.required),
    postalCode: new FormControl(0, [Validators.required, Validators.min(1), Validators.minLength(4), Validators.maxLength(4)]),
  });

  constructor(private accountService: AccountService, private router: Router, private toaster: ToastrService) { }
  ngOnInit(): void {
    this.getAddress();
  }

  getAddress(){
    this.accountService.GetUserAddress().subscribe({
      next: address => {
        address && this.addressForm.patchValue(address);
      }
    })
  }

  updateUsersAddress(){
    this.accountService.updateUserAddress(this.addressForm.value).subscribe({
      next: () => {
        this.toaster.success('Address updated');
        this.addressForm.reset(this.addressForm.value);
        this.router.navigateByUrl('/account');
      }
    })
  }

  onProvinceSelected(event: any){
    this.addressForm.value.province = event.target.value;
  }
}
