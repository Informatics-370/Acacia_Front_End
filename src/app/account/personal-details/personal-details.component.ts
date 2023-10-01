import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.scss']
})
export class PersonalDetailsComponent implements OnInit {
  errors: string[] | null = null;
  whitespace = "[a-zA-Z0-9][a-zA-Z0-9 ]+"
  formData = new FormData();
  DetailsForm = new FormGroup({
    displayName: new FormControl('', [ Validators.required, Validators.maxLength(20), Validators.minLength(3)]),
    email: new FormControl('', [Validators.email, Validators.maxLength(30)]),
    profilePicture: new FormControl('', Validators.required),
  });

  constructor(public accountService: AccountService, private formBuilder: FormBuilder, private toaster: ToastrService) { }
  ngOnInit(): void {
    this.getUser();
  }
  
  getUser(){
    this.accountService.currentUser$.subscribe({
      next: userDetails => {
        userDetails && this.DetailsForm.patchValue(userDetails);
      }
    })
  }

  uploadFile = (event: any) => {
    let fileToUpload = event.target.files[0];
    this.formData.append('profilePicture', fileToUpload);
  }

  updateUserDetails(){
    if(this.DetailsForm.valid)
    {
      const displayNameControl = this.DetailsForm.get('displayName')?.value;
      this.formData.append('displayName', this.DetailsForm.value.displayName!);
      this.formData.append('email', this.DetailsForm.value.email!);
      console.log(this.formData)
      console.log(this.DetailsForm.value)
      this.accountService.updateUser(this.formData).subscribe({
        next: () => {
          this.toaster.success('User Details updated');
          this.DetailsForm.reset(this.DetailsForm.value);
        },
        error: error => this.errors = error.errors
    })
    }
  }
}
