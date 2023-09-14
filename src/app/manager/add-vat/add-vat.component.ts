import { Component, TemplateRef } from '@angular/core';
import { VatService } from '../vat.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-add-vat',
  templateUrl: './add-vat.component.html',
  styleUrls: ['./add-vat.component.scss']
})
export class AddVatComponent {
  errors: string[] | null = null;
  modalRef?: BsModalRef;
  VatForm = new FormGroup({
    vatPercentage: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(99)])
  });
  constructor(private vatService: VatService, private router: Router, private toaster: ToastrService, private modalService: BsModalService,) { 
  }

  addVat(){
    console.log(this.VatForm.value);
    console.log(this.VatForm.value.vatPercentage);
    this.modalRef?.hide()
    this.vatService.addVat(this.VatForm.value.vatPercentage).subscribe({
      next: () => {
        this.router.navigateByUrl('dashboard/vat-list');
        this.toaster.success('VAT added successfully');
      },
      error: error => {
        this.errors = error.errors
      } 
    })
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    }

}
