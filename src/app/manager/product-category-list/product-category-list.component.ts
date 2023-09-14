import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { ProductService } from '../product.service';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { Product } from 'src/app/shared/models/product';
import { Category } from 'src/app/shared/models/category';
import { ShopParams } from 'src/app/shared/models/shopParams';
import { Type } from 'src/app/shared/models/type';

@Component({
  selector: 'app-product-category-list',
  templateUrl: './product-category-list.component.html',
  styleUrls: ['./product-category-list.component.scss']
})
export class ProductCategoryListComponent {
  modalRef?: BsModalRef;
  menuItemIndex = 0;
  searchTerm: string = '';
  categories: Category[] = [];


  shopParams: ShopParams = new ShopParams();
  totalCount = 0;
  pageSize = 10;
  pageNumber = 1;

  constructor(private productService: ProductService, private toaster: ToastrService, private modalService: BsModalService, private router: Router){}

  ngOnInit(): void {
    this.getCategories();
  }


  getCategories(){
    this.productService.getCategories().subscribe({
      next: response => this.categories = [...response],
      error: error => console.log(error)
    })
  }

  get filteredData(): Category[] {
    this.totalCount = this.categories.filter(item => item.name.toLowerCase().includes(this.searchTerm.toLowerCase())).length;
    return this.categories.filter(item => item.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

  onReset(){
    this.searchTerm = '';
    this.totalCount = this.categories.length;
  }

    onMenuItemClick(index: number){
    this.menuItemIndex = index;
  }

  openModal(template: TemplateRef<any>) {
  this.modalRef = this.modalService.show(template);
  }

  deleteProductCategory(id: any){
    this.productService.deleteProductCategory(id).subscribe({
      next: () => {
        this.modalRef?.hide(),
        this.router.navigateByUrl('dashboard/product-category-list');
        this.toaster.success('Product Category Deleted');
        this.getCategories();
      },
      error: error => console.log(error)
    })
  }
}
