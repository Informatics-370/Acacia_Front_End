import { Component, TemplateRef } from '@angular/core';
import { AccountService } from './account.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent {

  modalRef?: BsModalRef;
  menuItemIndex = 0;
  
  constructor(public accountService: AccountService, private modalService: BsModalService, private toaster: ToastrService) { }

  onMenuItemClick(index: number){
        this.menuItemIndex = index;
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  deleteUser(){
    this.accountService.deleteUser().subscribe({
      next: () => {
        this.modalRef?.hide(),
        this.accountService.logout(),
        this.toaster.success('Account Deleted')
      },
      error: error => console.log(error)
    })
  }
}
