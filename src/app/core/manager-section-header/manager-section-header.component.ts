import { Component } from '@angular/core';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'app-manager-section-header',
  templateUrl: './manager-section-header.component.html',
  styleUrls: ['./manager-section-header.component.scss']
})
export class ManagerSectionHeaderComponent {
  constructor(public bcService: BreadcrumbService) { }
}
