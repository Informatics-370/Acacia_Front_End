import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { resetPassword } from 'src/app/shared/models/ResetPassword';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  errors: string[] | null = null;
  resetpassword?: resetPassword;


  complexPassword = "(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$"

  passwordForm = new FormGroup({
    oldPassword: new FormControl('', Validators.required),
    newPassword: new FormControl('', [Validators.required, Validators.pattern(this.complexPassword)]),
    userid: new FormControl(''),
    token: new FormControl(''),
  });
  
  constructor(public accountService: AccountService, private router: Router, private toaster: ToastrService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
  }

  // resetPassword(){
  //   this.activatedRoute.queryParams.subscribe(params => {
  //     this.passwordForm.value.token = params['token'];
  //     this.passwordForm.value.userid = params['id'];
  //   });
  //   this.accountService.resetForgottenPassword(this.passwordForm.value).subscribe({
  //     next: () => {
  //       this.router.navigateByUrl("account/login");
  //       this.toaster.success('Password updated');
  //     },
  //     error: error => this.errors = error.errors
  //   })
  // }

  resetPassword() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.passwordForm.value.token = params['token'];
      this.passwordForm.value.userid = params['id'];
    });
  
    this.accountService.resetForgottenPassword(this.passwordForm.value).subscribe(
      response => {
        this.router.navigateByUrl("account/login");
        this.toaster.success(response.message);
      },
      error => {
        this.errors = error.errors;
        this.toaster.error('Failed to reset password');
      }
    );
  }
  
}
