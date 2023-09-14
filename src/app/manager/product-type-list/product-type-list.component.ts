import { Component, TemplateRef } from '@angular/core';
import { ProductService } from '../product.service';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { ShopParams } from 'src/app/shared/models/shopParams';
import { Type } from 'src/app/shared/models/type';

@Component({
  selector: 'app-product-type-list',
  templateUrl: './product-type-list.component.html',
  styleUrls: ['./product-type-list.component.scss']
})
export class ProductTypeListComponent {
  modalRef?: BsModalRef;
  menuItemIndex = 0;
  searchTerm: string = '';
  types: Type[] = [];
  shopParams: ShopParams = new ShopParams();
  totalCount = 0;
  pageSize = 10;
  pageNumber = 1;

  constructor(private productService: ProductService, private toaster: ToastrService, private modalService: BsModalService, private router: Router){}

  ngOnInit(): void {
    this.getTypes();
  }


  getTypes(){
    this.productService.getTypes().subscribe({
      next: response => this.types = [...response],
      error: error => console.log(error)
    })
  }

  get filteredData(): Type[] {
    this.totalCount = this.types.filter(item => item.name.toLowerCase().includes(this.searchTerm.toLowerCase())).length;
    return this.types.filter(item => item.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

  onReset(){
    this.searchTerm = '';
    this.totalCount = this.types.length;
  }

    onMenuItemClick(index: number){
    this.menuItemIndex = index;
  }

  openModal(template: TemplateRef<any>) {
  this.modalRef = this.modalService.show(template);
  }

  deleteProductType(id: any){
    this.productService.deleteProductType(id).subscribe({
      next: () => {
        this.modalRef?.hide(),
        this.router.navigateByUrl('dashboard/product-type-list');
        this.toaster.success('Product Type Deleted')
        this.getTypes();
      },
      error: error => console.log(error)
    })
  }


}
