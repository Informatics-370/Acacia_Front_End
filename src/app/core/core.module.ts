import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { RouterModule } from '@angular/router';
import { TestErrorComponent } from './test-error/test-error.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ServerErrorComponent } from './server-error/server-error.component';
import { ToastrModule } from 'ngx-toastr';
import { SectionHeaderComponent } from './section-header/section-header.component';
import { BreadcrumbModule } from 'xng-breadcrumb';
import {  NgxSpinnerModule } from 'ngx-spinner';
import { SharedModule } from '../shared/shared.module';
import { FooterComponent } from './footer/footer.component';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { ManagerSectionHeaderComponent } from './manager-section-header/manager-section-header.component';
import { CollapseModule } from 'ngx-bootstrap/collapse';



@NgModule({
  declarations: [
    NavBarComponent,
    TestErrorComponent,
    NotFoundComponent,
    ServerErrorComponent,
    SectionHeaderComponent,
    ManagerSectionHeaderComponent,
    FooterComponent,
    SideMenuComponent,
    ManagerSectionHeaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      preventDuplicates: true
    }),
    BreadcrumbModule,
    NgxSpinnerModule,
    CollapseModule,
    SharedModule
  ],
  exports: [
    NavBarComponent,
    SectionHeaderComponent,
    ManagerSectionHeaderComponent,
    NgxSpinnerModule,
    FooterComponent,
    SideMenuComponent
  ]
})
export class CoreModule { }
