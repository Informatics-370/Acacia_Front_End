import { Component, ElementRef, ViewChild } from '@angular/core';
import { ReportParams } from 'src/app/shared/models/ReportParams';
import { ReportVM } from 'src/app/shared/models/ReportVM';
import { CompanyService } from '../company.service';
import { ReportsService } from '../report.service';
import { OrderService } from '../order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from 'src/app/shared/models/Order';
import { DashboardVM } from 'src/app/shared/models/dashboardVM';

@Component({
  selector: 'app-dashboard-screen',
  templateUrl: './dashboard-screen.component.html',
  styleUrls: ['./dashboard-screen.component.scss']
})
export class DashboardScreenComponent {
  orders: Order[] = [];
  dashboardData?: DashboardVM
  @ViewChild('content', { static: false }) el!: ElementRef;
  errors: string[] | null = null;
  Report?: ReportVM;
  salesParams: ReportParams = new ReportParams();
  Total = 0
  
  constructor(private reportService: ReportsService){}
  
  ngOnInit(): void {
    this.loadReport();
    this.getDashboardData()
  }

  loadReport() {
    this.reportService.getTrendsReport(this.salesParams).subscribe({
      next: report => {
        this.Report = report;
        this.Total = this.Report?.data.reduce((total, current) => total + current, 0)
        console.log(this.Report);
      },
      error: err => console.log(err)
    });
  }

  getDashboardData(){
    this.reportService.getDashboardData().subscribe({
      next: dashboardData => {
        this.dashboardData = dashboardData;
        this.orders = dashboardData.orders;
      },
      error: err => console.log(err)
    });
  }
}
