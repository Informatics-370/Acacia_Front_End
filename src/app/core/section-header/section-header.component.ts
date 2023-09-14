import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'app-section-header',
  templateUrl: './section-header.component.html',
  styleUrls: ['./section-header.component.scss']
})
export class SectionHeaderComponent {
constructor(public bcService: BreadcrumbService, private route: ActivatedRoute) { }

isDashboardRoute(): boolean {
  console.log(this.route.snapshot.routeConfig?.path?.startsWith('dashboard'))
  return this.route.snapshot.routeConfig?.path?.startsWith('dashboard') || false;
}

// hasDashboardLabel(breadcrumbs: any[]): boolean {
//   return breadcrumbs.some(breadcrumb => breadcrumb.label == 'dashboard' || breadcrumb.label === 'Home') || false
// }
}
