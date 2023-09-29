import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';
import { InventoryService } from '../inventory.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LogReturn } from 'src/app/shared/models/LogReturn';
import { SupplierReturn } from 'src/app/shared/models/SupplierReturn';

@Component({
  selector: 'app-supplier-return-details',
  templateUrl: './supplier-return-details.component.html',
  styleUrls: ['./supplier-return-details.component.scss']
})
export class SupplierReturnDetailsComponent {
  id = this.activatedRoute.snapshot.paramMap.get('id');
  constructor(private inventoryService: InventoryService, private activatedRoute: ActivatedRoute, private bcService: BreadcrumbService) { 
    this.bcService.set('@returnDetails', '');
  }
  whitespace = "[a-zA-Z0-9][a-zA-Z0-9 ]+"
  returnForm = new FormGroup({
    supplierOrderId: new FormControl(0, Validators.required),
    managerEmail: new FormControl('', [Validators.required, Validators.email]),
    description: new FormControl('', [Validators.required]),
    date: new FormControl(),
    total: new FormControl(),
    returnItems: new FormControl(),
  });
  errors: string[] | null = null;
  supplierReturn?: SupplierReturn;

 ngOnInit(): void {
  this.loadReurn();
}

loadReurn(){
  if (this.id) this.inventoryService.getSupplierReturn(+this.id).subscribe({
    next: supplierReturn => {
      this.supplierReturn = supplierReturn,
      this.bcService.set('@orderDetails', "Supplier Order");
      this.returnForm.patchValue(supplierReturn)
      this.returnForm.disable()
    },
    error: err => console.log(err)
  })
}

}
