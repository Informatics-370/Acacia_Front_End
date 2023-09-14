import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  errors: string[] | null = null;

  complexPassword = "(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$"

  passwordForm = new FormGroup({
    oldPassword: new FormControl('', Validators.required),
    newPassword: new FormControl('', [Validators.required, Validators.pattern(this.complexPassword)]),
  });
  
  constructor(public accountService: AccountService, private formBuilder: FormBuilder, private router: Router, private toaster: ToastrService) { }

  resetPassword(){
    const oldPasswordControl = this.passwordForm.get('oldPassword');
    const newPasswordControl = this.passwordForm.get('newPassword');
    if (oldPasswordControl?.value === newPasswordControl?.value) {
      this.toaster.error('New password cannot be the same as the current password.');
      return;
    }

    this.accountService.resetPassword(this.passwordForm.value).subscribe({
      next: () => {
        this.toaster.success('Password updated');
        this.passwordForm.reset();
      },
      error: error => this.errors = error.errors
    })
  }
}
