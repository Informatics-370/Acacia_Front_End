import { Component, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(private accountService: AccountService, private router: Router, private activatedRoute: ActivatedRoute, private modalService: BsModalService, private toaster: ToastrService) { 
    this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/shop';
  }

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  forgotPasswordForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  modalRef?: BsModalRef;
  returnUrl: string;

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    }

  forgotPassword(){
    console.log(this.forgotPasswordForm.value.email)
    this.accountService.sendForgotPasswordRequest(this.forgotPasswordForm.value.email).subscribe({
      next: () => {
        this.modalService.hide()
        this.toaster.success("If a matching account was found, you will receive an email that will allow you to reset your password.")
      }
    })
  }

  onSubmit(){
    this.accountService.login(this.loginForm.value).subscribe({
      next: user => this.router.navigateByUrl(this.returnUrl),
    });
  }
}
