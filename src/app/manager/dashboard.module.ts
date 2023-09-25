import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ProductsListComponent } from './products-list/products-list.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { DashboardComponent } from './dashboard.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AddProductComponent } from './add-product/add-product.component';
import { ProductCategoryListComponent } from './product-category-list/product-category-list.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { FormsModule } from '@angular/forms';
import { AddProductCategoryComponent } from './add-product-category/add-product-category.component';
import { UpdateProductCategoryComponent } from './update-product-category/update-product-category.component';
import { ProductTypeListComponent } from './product-type-list/product-type-list.component';
import { UpdateProductTypeComponent } from './update-product-type/update-product-type.component';
import { AddProductTypeComponent } from './add-product-type/add-product-type.component';
import { CoreModule } from "../core/core.module";
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
import { AddSupplierComponent } from './add-supplier/add-supplier.component';
import { SupplierDetailsComponent } from './supplier-details/supplier-details.component';
import { VatListComponent } from './vat-list/vat-list.component';
import { AddVatComponent } from './add-vat/add-vat.component';
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
import { ReviewListComponent } from './review-list/review-list.component';
import { ReviewDetailsComponent } from './review-details/review-details.component';
import { SalesReportComponent } from './sales-report/sales-report.component';
import { PromotionsReportComponent } from './promotions-report/promotions-report.component';
import { ProductsTrendsReportComponent } from './products-trends-report/products-trends-report.component';
import { SupplierListReportComponent } from './supplier-list-report/supplier-list-report.component';
import { ProductListReportComponent } from './product-list-report/product-list-report.component';
import { UserListReportComponent } from './user-list-report/user-list-report.component';
import { MakeSupplierOrderComponent } from './make-supplier-order/make-supplier-order.component';
import { MakeSupplierOrderDetailsComponent } from './make-supplier-order-details/make-supplier-order-details.component';
import { SupplierOrdersComponent } from './supplier-orders/supplier-orders.component';
import { SupplierOrderDetailsComponent } from './supplier-order-details/supplier-order-details.component';
import { ApproveSupplierOrderComponent } from './approve-supplier-order/approve-supplier-order.component';
import { SupplierReturnLogComponent } from './supplier-return-log/supplier-return-log.component';
import { SupplierReturnDetailsComponent } from './supplier-return-details/supplier-return-details.component';
import { AddSupplierReturnComponent } from './add-supplier-return/add-supplier-return.component';
import { SupplierOrderReportComponent } from './supplier-order-report/supplier-order-report.component';
import { ProfitabilityReportComponent } from './profitability-report/profitability-report.component';
import { DeliveryMethodListComponent } from './delivery-method-list/delivery-method-list.component';
import { DeliveryMethodDetailsComponent } from './delivery-method-details/delivery-method-details.component';
import { AddDeliveryMethodComponent } from './add-delivery-method/add-delivery-method.component';
import { QRCodeModule } from 'angularx-qrcode';
import { MediaListComponent } from './media-list/media-list.component';
import { MediaDetailsComponent } from './media-details/media-details.component';
import { AddMediaComponent } from './add-media/add-media.component';
import { AuditTrailsComponent } from './audit-trails/audit-trails.component';
import { DashboardScreenComponent } from './dashboard-screen/dashboard-screen.component';
import { BackupsComponent } from './backups/backups.component';




@NgModule({
    declarations: [
        ProductsListComponent,
        ProductDetailsComponent,
        AddProductComponent,
        ProductCategoryListComponent,
        AddProductCategoryComponent,
        UpdateProductCategoryComponent,
        ProductTypeListComponent,
        UpdateProductTypeComponent,
        AddProductTypeComponent,
        UserListsComponent,
        UserDetailsComponent,
        FaqListComponent,
        FaqDetailsComponent,
        AddFaqComponent,
        CompanyDetailsComponent,
        GiftboxListComponent,
        GiftboxDetailsComponent,
        AddGiftboxComponent,
        SupplierListComponent,
        AddSupplierComponent,
        SupplierDetailsComponent,
        VatListComponent,
        AddVatComponent,
        PromotionsListComponent,
        AddPromotionComponent,
        PromotionDetailsComponent,
        OrdersListComponent,
        OrderDetailsComponent,
        WriteoffLogComponent,
        AddWriteoffComponent,
        ReturnLogComponent,
        AddReturnComponent,
        ReturnDetailsComponent,
        ReviewListComponent,
        ReviewDetailsComponent,
        SalesReportComponent,
        PromotionsReportComponent,
        ProductsTrendsReportComponent,
        SupplierListReportComponent,
        ProductListReportComponent,
        UserListReportComponent,
        MakeSupplierOrderComponent,
        MakeSupplierOrderDetailsComponent,
        SupplierOrdersComponent,
        SupplierOrderDetailsComponent,
        ApproveSupplierOrderComponent,
        SupplierReturnLogComponent,
        SupplierReturnDetailsComponent,
        AddSupplierReturnComponent,
        SupplierOrderReportComponent,
        ProfitabilityReportComponent,
        DeliveryMethodListComponent,
        DeliveryMethodDetailsComponent,
        AddDeliveryMethodComponent,
        MediaListComponent,
        MediaDetailsComponent,
        AddMediaComponent,
        AuditTrailsComponent,
        DashboardScreenComponent,
        BackupsComponent
    ],
    imports: [
        CommonModule,
        DashboardRoutingModule,
        FormsModule,
        ModalModule.forRoot(),
        SharedModule,
        CoreModule,
        QRCodeModule,
        ProgressbarModule.forRoot()
    ]
})
export class DashboardModule { }
