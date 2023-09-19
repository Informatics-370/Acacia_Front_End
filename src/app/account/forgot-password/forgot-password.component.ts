import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { resetPassword } from 'src/app/shared/models/ResetPassword';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  errors: string[] | null = null;
  resetpassword?: resetPassword;
  modalRef?: BsModalRef;
  userId = "";

  complexPassword = "(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$"

  passwordForm = new FormGroup({
    oldPassword: new FormControl('', [Validators.required, Validators.pattern(this.complexPassword)]),
    newPassword: new FormControl('', [Validators.required, Validators.pattern(this.complexPassword)]),
    userid: new FormControl(''),
    token: new FormControl(''),
    twoFactorCode: new FormControl(''),
  });

  twoFactorForm = new FormGroup({
    twoFactorCode: new FormControl('', Validators.required),
  });
  
  constructor(public accountService: AccountService, private router: Router, private toaster: ToastrService, private activatedRoute: ActivatedRoute, private modalService: BsModalService,) { }

  ngOnInit(): void { 
    this.activatedRoute.queryParams.subscribe(params => {
      this.userId = params['id'];
    });
  }

  resetPassword() {
    const oldPasswordControl = this.passwordForm.get('oldPassword');
    const newPasswordControl = this.passwordForm.get('newPassword');
    if (oldPasswordControl?.value !== newPasswordControl?.value) {
      this.toaster.error('The passwords dont match.');
      return;
    }


    if(this.twoFactorForm.value.twoFactorCode){
      this.passwordForm.value.twoFactorCode = this.twoFactorForm.value.twoFactorCode.trim();
    }
    this.activatedRoute.queryParams.subscribe(params => {
      this.passwordForm.value.token = params['token'];
      this.passwordForm.value.userid = params['id'];
    });

    console.log(this.passwordForm.value)

    if(this.passwordForm.valid){
      this.accountService.resetForgottenPassword(this.passwordForm.value).subscribe(
        response => {
          this.router.navigateByUrl("account/login");
          this.toaster.success(response.message);
          this.modalService.hide();
        },
        error => {
          this.errors = error.errors;
          this.toaster.error('Failed to reset password');
        }
      );
    }
  }

  resendOTP(){
    console.log(this.userId)
    this.accountService.resendForgotPasswordRequest(this.userId).subscribe({
      next: () => {
        this.modalService.hide()
        this.toaster.success("We have sent a new OTP to your email.")
      }
    })
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
}
