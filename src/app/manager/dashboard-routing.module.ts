import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductsListComponent } from './products-list/products-list.component';
import { AddProductComponent } from './add-product/add-product.component';
import { ProductCategoryListComponent } from './product-category-list/product-category-list.component';
import { AddProductCategoryComponent } from './add-product-category/add-product-category.component';
import { UpdateProductCategoryComponent } from './update-product-category/update-product-category.component';
import { AddProductTypeComponent } from './add-product-type/add-product-type.component';
import { UpdateProductTypeComponent } from './update-product-type/update-product-type.component';
import { ProductTypeListComponent } from './product-type-list/product-type-list.component';
import { UserListsComponent } from './user-lists/user-lists.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { FaqListComponent } from './faq-list/faq-list.component';
import { FaqDetailsComponent } from './faq-details/faq-details.component';
import { AddFaqComponent } from './add-faq/add-faq.component';
import { CompanyDetailsComponent } from './company-details/company-details.component';
import { GiftboxListComponent } from './giftbox-list/giftbox-list.component';
import { GiftboxDetailsComponent } from './giftbox-details/giftbox-details.component';
import { AddGiftboxComponent } from './add-giftbox/add-giftbox.component';
import { SupplierListComponent } from './supplier-list/supplier-list.component';
import { SupplierDetailsComponent } from './supplier-details/supplier-details.component';
import { AddSupplierComponent } from './add-supplier/add-supplier.component';
import { AddVatComponent } from './add-vat/add-vat.component';
import { VatListComponent } from './vat-list/vat-list.component';
import { PromotionsListComponent } from './promotions-list/promotions-list.component';
import { AddPromotionComponent } from './add-promotion/add-promotion.component';
import { PromotionDetailsComponent } from './promotion-details/promotion-details.component';
import { OrdersListComponent } from './orders-list/orders-list.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { WriteoffLogComponent } from './writeoff-log/writeoff-log.component';
import { AddWriteoffComponent } from './add-writeoff/add-writeoff.component';
import { ReturnLogComponent } from './return-log/return-log.component';
import { AddReturnComponent } from './add-return/add-return.component';
import { ReturnDetailsComponent } from './return-details/return-details.component';
import { ReviewDetailsComponent } from './review-details/review-details.component';
import { ReviewListComponent } from './review-list/review-list.component';
import { SalesReportComponent } from './sales-report/sales-report.component';
import { PromotionsReportComponent } from './promotions-report/promotions-report.component';
import { ProductsTrendsReportComponent } from './products-trends-report/products-trends-report.component';
import { UserListReportComponent } from './user-list-report/user-list-report.component';
import { ProductListReportComponent } from './product-list-report/product-list-report.component';
import { SupplierListReportComponent } from './supplier-list-report/supplier-list-report.component';
import { MakeSupplierOrderComponent } from './make-supplier-order/make-supplier-order.component';
import { MakeSupplierOrderDetailsComponent } from './make-supplier-order-details/make-supplier-order-details.component';
import { SupplierOrdersComponent } from './supplier-orders/supplier-orders.component';
import { SupplierOrderDetailsComponent } from './supplier-order-details/supplier-order-details.component';
import { ApproveSupplierOrderComponent } from './approve-supplier-order/approve-supplier-order.component';
import { SupplierReturnLogComponent } from './supplier-return-log/supplier-return-log.component';
import { AddSupplierReturnComponent } from './add-supplier-return/add-supplier-return.component';
import { SupplierReturnDetailsComponent } from './supplier-return-details/supplier-return-details.component';
import { SupplierOrderReportComponent } from './supplier-order-report/supplier-order-report.component';
import { ProfitabilityReportComponent } from './profitability-report/profitability-report.component';
import { DeliveryMethodListComponent } from './delivery-method-list/delivery-method-list.component';
import { AddDeliveryMethodComponent } from './add-delivery-method/add-delivery-method.component';
import { DeliveryMethodDetailsComponent } from './delivery-method-details/delivery-method-details.component';
import { MediaDetailsComponent } from './media-details/media-details.component';
import { AddMediaComponent } from './add-media/add-media.component';
import { MediaListComponent } from './media-list/media-list.component';
import { AuditTrailsComponent } from './audit-trails/audit-trails.component';


const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {path: 'products-list', component: ProductsListComponent},
      {path: 'add-product', component: AddProductComponent},
      {path: 'product-details/:id', component: ProductDetailsComponent, data: {breadcrumb: {alias: 'productDetails'}}},
      {path: 'product-category-list', component: ProductCategoryListComponent},
      {path: 'product-type-list', component: ProductTypeListComponent},
      {path: 'add-product-category', component: AddProductCategoryComponent},
      {path: 'add-product-type', component: AddProductTypeComponent},
      {path: 'update-product-category/:id', component: UpdateProductCategoryComponent, data: {breadcrumb: {alias: 'categoryDetails'}}},
      {path: 'update-product-type/:id', component: UpdateProductTypeComponent, data: {breadcrumb: {alias: 'typeDetails'}}},
      {path: 'user-list', component: UserListsComponent},
      {path: 'user-details/:email', component: UserDetailsComponent, data: {breadcrumb: {alias: 'userDetails'}}},
      {path: 'faq-list', component: FaqListComponent},
      {path: 'faq-details/:id', component: FaqDetailsComponent, data: {breadcrumb: {alias: 'faqDetails'}}},
      {path: 'add-faq', component: AddFaqComponent},
      {path: 'company-details/:id', component: CompanyDetailsComponent, data: {breadcrumb: {alias: 'companyDetails'}}},
      {path: 'giftbox-list', component: GiftboxListComponent},
      {path: 'giftbox-details/:id', component: GiftboxDetailsComponent, data: {breadcrumb: {alias: 'giftboxDetails'}}},
      {path: 'add-giftbox', component: AddGiftboxComponent},
      {path: 'supplier-list', component: SupplierListComponent},
      {path: 'supplier-details/:id', component: SupplierDetailsComponent, data: {breadcrumb: {alias: 'supplierDetails'}}},
      {path: 'add-supplier', component: AddSupplierComponent},
      {path: 'add-vat', component: AddVatComponent},
      {path: 'vat-list', component: VatListComponent},
      {path: 'promotions-list', component: PromotionsListComponent},
      {path: 'add-promotion', component: AddPromotionComponent},
      {path: 'promotion-details/:id', component: PromotionDetailsComponent, data: {breadcrumb: {alias: 'promoDetails'}}},
      {path: 'orders', component: OrdersListComponent},
      {path: 'orders/:id', component: OrderDetailsComponent, data: {breadcrumb: {alias: 'orderDetails'}}},
      {path: 'writeoffs', component: WriteoffLogComponent},
      {path: 'writeoffs/add', component: AddWriteoffComponent},
      {path: 'returns', component: ReturnLogComponent},
      {path: 'returns/add', component: AddReturnComponent},
      {path: 'returns/:id', component: ReturnDetailsComponent, data: {breadcrumb: {alias: 'returnDetails'}}},
      {path: 'reviews', component: ReviewListComponent},
      {path: 'reviews/:id', component: ReviewDetailsComponent, data: {breadcrumb: {alias: 'reviewDetails'}}},
      {path: 'SalesReport', component: SalesReportComponent},
      {path: 'PromotionsReport', component: PromotionsReportComponent},
      {path: 'TrendsReport', component: ProductsTrendsReportComponent},
      {path: 'supplierReport', component: SupplierListReportComponent},
      {path: 'ProductReport', component: ProductListReportComponent},
      {path: 'UserReport', component: UserListReportComponent},
      {path: 'SupplierOrderReport', component: SupplierOrderReportComponent},
      {path: 'ProfitabilityReport', component: ProfitabilityReportComponent},
      {path: 'MakeSupplierOrder', component: MakeSupplierOrderComponent},
      {path: 'MakeSupplierOrder/:id', component: MakeSupplierOrderDetailsComponent, data: {breadcrumb: {alias: 'orderDetails'}}},
      {path: 'SupplierOrders', component: SupplierOrdersComponent},
      {path: 'SupplierOrders/:id', component: SupplierOrderDetailsComponent, data: {breadcrumb: {alias: 'orderDetails'}}},
      {path: 'ApproveSupplierOrder/:id', component: ApproveSupplierOrderComponent, data: {breadcrumb: {alias: 'orderDetails'}}},
      {path: 'SupplierReturns', component: SupplierReturnLogComponent},
      {path: 'SupplierReturns/add', component: AddSupplierReturnComponent},
      {path: 'SupplierReturns/:id', component: SupplierReturnDetailsComponent, data: {breadcrumb: {alias: 'returnDetails'}}},
      {path: 'DeliveryMethods', component: DeliveryMethodListComponent},
      {path: 'DeliveryMethods/add', component: AddDeliveryMethodComponent},
      {path: 'DeliveryMethods/:id', component: DeliveryMethodDetailsComponent, data: {breadcrumb: {alias: 'deliveryDetails'}}},
      {path: 'Media', component: MediaListComponent},
      {path: 'Media/add', component: AddMediaComponent},
      {path: 'Media/:id', component: MediaDetailsComponent, data: {breadcrumb: {alias: 'mediaDetails'}}},
      {path: 'AuditTrail', component: AuditTrailsComponent}
    ]
  }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }