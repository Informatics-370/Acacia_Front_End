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
    displayName: new FormControl('', [ Validators.required]),
    email: new FormControl(''),
    profilePicture: new FormControl('', Validators.required),
  });

  constructor(public accountService: AccountService, private toaster: ToastrService, private router: Router) { }
  ngOnInit(): void {
    this.getUser();
  }
  
  getUser(){
    this.accountService.currentUser$.subscribe({
      next: userDetails => {
        userDetails && this.DetailsForm.patchValue(userDetails);
      }
    })
    this.DetailsForm?.get('email')?.disable();
  }

  uploadFile = (event: any) => {
    let fileToUpload = event.target.files[0];
    this.formData.append('profilePicture', fileToUpload);
  }

  updateUserDetails(){
    if(this.DetailsForm.valid)
    {
      this.DetailsForm?.get('email')?.enable();
      this.formData.append('displayName', this.DetailsForm.value.displayName!);
      this.formData.append('email',  "mzamogamin@gmail.com");
      console.log(this.formData)
      console.log(this.DetailsForm.value)
      this.accountService.updateUser(this.formData).subscribe({
        next: () => {
          this.toaster.success('User Details updated');
          window.location.reload();
        },
        error: error => this.errors = error.errors
    })
    }
  }
}
