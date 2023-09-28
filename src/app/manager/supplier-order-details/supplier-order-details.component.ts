import { Component, TemplateRef } from '@angular/core';
import { SupplierordersService } from '../supplierorders.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SupplierOrder, SupplierOrderItem } from 'src/app/shared/models/SupplierOrder';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-supplier-order-details',
  templateUrl: './supplier-order-details.component.html',
  styleUrls: ['./supplier-order-details.component.scss']
})
export class SupplierOrderDetailsComponent {
  errors: string[] = ["Note** PDF files are only accepted."];
  order?: SupplierOrder;
  orderItems?: SupplierOrderItem[];
  modalRef?: BsModalRef;
  fileNameUploaded = ''
  formData = new FormData();

  documentationForm = new FormGroup({
    supplierId: new FormControl(0, Validators.required),
    invoiceUrl: new FormControl('', Validators.required),
    proofOfPaymentUrl: new FormControl('', Validators.required),
  });

  QuantityForm = new FormGroup({
    quantity: new FormControl(0, [Validators.required, Validators.min(0)]),
  });
  
  id = this.activatedRoute.snapshot.paramMap.get('id');
  constructor(private orderService: SupplierordersService, private router: Router, private activatedRoute: ActivatedRoute, private bcService: BreadcrumbService, private toaster: ToastrService, private modalService: BsModalService, private fb: FormBuilder) { 
    this.bcService.set('@orderDetails', '');
  }
  
  ngOnInit(): void {
    this.loadOrder(); 
  }

  loadOrder(){
    if (this.id) this.orderService.getSupplierOrder(+this.id).subscribe({
      next: order => {
        this.order = order,
        this.orderItems = JSON.parse(JSON.stringify(order.orderItems));
        this.formData.append('supplierId', order.id.toString());
        this.documentationForm.value.supplierId = order.id,
        this.bcService.set('@orderDetails', order.supplier.name);
      },
      error: err => console.log(err)
    })
  }

  cancelOrder(){
    if (this.order) this.orderService.CancelOrder(this.order.id).subscribe({
      next: () => {
        this.modalRef?.hide(),
        this.router.navigateByUrl('/dashboard/SupplierOrders');
        this.toaster.success('Supplier Order Cancelled')
      },
      error: error => console.log(error)
    })
  }
  
  uploadDocumentation(){  
    if(this.order){
      this.orderService.ConfirmPayment(this.order.id, this.formData).subscribe(
        () => {
          this.modalRef?.hide(),
          this.router.navigateByUrl('/dashboard/SupplierOrders');
          this.toaster.success('Documentation uploaded successfully');
        },
        error => {
          this.errors = error.errors;
        }
      ); 
    }
  }

  confirmOrderDelivery(){
    if (this.order) {
      this.orderService.ConfirmOrderDelivery(this.order.id, {supplierId: this.order.supplier.id, orderItems: this.order.orderItems}).subscribe({
        next: () => {
          this.modalRef?.hide(),
          this.router.navigateByUrl('/dashboard/SupplierOrders');
          this.toaster.success('Order Delivery Confirmed')
        },
        error: error => console.log(error)
      })
    }
  }

  printInvoice() {
    this.orderService.getInvoice(this.order!.id).subscribe({
      next: res => {
        let myfile = res.body as Blob;
        let url = window.URL.createObjectURL(myfile);
        window.open(url);
      },
      error: err => console.log(err)
    });
  }

  printPOP(){
    this.orderService.getProofOfPayment(this.order!.id).subscribe({
      next: res => {
        let myfile = res.body as Blob;
        let url = window.URL.createObjectURL(myfile);
        window.open(url);
      },
      error: err => console.log(err)
    });
  }

  editQuantity(orderItem: SupplierOrderItem, quantity: number) {
    if (!this.order || !this.orderItems) {
      return;
    }

    const existingItem = this.order.orderItems.find(item => item.productId == orderItem.productId);
    const currentItem = this.orderItems.find(item => item.productId == orderItem.productId);
    if (existingItem && currentItem && quantity > currentItem.quantity) {
      this.toaster.warning('Please select a quantity lower than the current value.');
    } else if (existingItem) {
      existingItem.quantity = quantity;
    }
  
    this.modalRef?.hide();
  }
  

  uploadInvoice = (event: any) => {
    let fileToUpload = event.target.files[0];
    this.formData.append('invoiceUrl', fileToUpload, fileToUpload.name);
  }
  uploadPOP = (event: any) => {
    let fileToUpload = event.target.files[0];
    this.formData.append('proofOfPaymentUrl', fileToUpload, fileToUpload.name);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
}
