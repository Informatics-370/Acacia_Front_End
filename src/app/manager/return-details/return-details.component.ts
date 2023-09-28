import { Component } from '@angular/core';
import { InventoryService } from '../inventory.service';
import { Product } from 'src/app/shared/models/product';
import { LogReturn } from 'src/app/shared/models/LogReturn';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-return-details',
  templateUrl: './return-details.component.html',
  styleUrls: ['./return-details.component.scss']
})
export class ReturnDetailsComponent {
  id = this.activatedRoute.snapshot.paramMap.get('id');
  constructor(private inventoryService: InventoryService, private activatedRoute: ActivatedRoute, private bcService: BreadcrumbService) { 
    this.bcService.set('@returnDetails', '');
  }
  whitespace = "[a-zA-Z0-9][a-zA-Z0-9 ]+"
  returnForm = new FormGroup({
    orderId: new FormControl(0, Validators.required),
    customerEmail: new FormControl('', [Validators.required, Validators.email]),
    description: new FormControl('', [Validators.required]),
    returnItems: new FormControl(),
    date: new FormControl(),
    total: new FormControl(),
  });

  errors: string[] | null = null;
  CustReturn?: LogReturn;

 ngOnInit(): void {
  this.loadReurn();
}

loadReurn(){
  if (this.id) this.inventoryService.getReturn(+this.id).subscribe({
    next: CustReturn => {
      this.CustReturn = CustReturn,
      this.bcService.set('@orderDetails', CustReturn.customerEmail);
      this.returnForm.patchValue(CustReturn)
      this.returnForm.disable()
    },
    error: err => console.log(err)
  })
}

}
