import { Component, ElementRef, ViewChild } from '@angular/core';
import { CompanyService } from './company.service';
import { ReportsService } from './report.service';
import { ReportVM } from '../shared/models/ReportVM';
import { ReportParams } from '../shared/models/ReportParams';
import jsPDF from 'jspdf';
import { Chart } from 'chart.js';
import { OrderService } from './order.service';
import { orderParams } from '../shared/models/orderParams';
import { Order } from '../shared/models/Order';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
orders: Order[] = [];
orderParams: orderParams = new orderParams();
totalCount = 0;
@ViewChild('content', { static: false }) el!: ElementRef;
errors: string[] | null = null;
  Report?: ReportVM;
  salesParams: ReportParams = new ReportParams();
  sortOptions = [
    {name: "Top"},
    {name: "Bottom"},
  ]

constructor(private companyService: CompanyService, private reportService: ReportsService, private orderService: OrderService, private router: Router, private activatedRoute: ActivatedRoute){}

  ngOnInit(): void {
    this.loadReport();
    this.getOrders();

  }
  loadCompany(){
    this.companyService.loadCompany(1).subscribe();
  }

  onSortSelected(event: any) {
    this.salesParams.sort = event.target.value;
    this.loadReport();
  }

  getOrders(){
    this.orderService.getOrders(this.orderParams).subscribe({
      next: response => {
        this.orders = response.data;
        this.orderParams.pageNumber = response.pageIndex;
        this.orderParams.pageSize = response.pageSize;
        this.totalCount = response.count;
      },
      error: error => console.log(error)
    })
  }

  loadReport() {
    this.reportService.getTrendsReport(this.salesParams).subscribe({
      next: report => {
        this.Report = report;
        console.log(this.Report);
        this.createChart();
      },
      error: err => console.log(err)
    });
  }

  createChart() {
    if (!this.Report) {
      return;
    }

    var myChart = new Chart("myChart", {
      type: 'pie',
      data: {
        labels: this.Report.labels,
        datasets: [{
          label: 'Sales Report',
          data: this.Report.data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  printPdf() {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt', // Use points as the unit for precise dimensions
      format: 'a4'
    });
    const content = this.el.nativeElement;
    const fontSize = 12;
    pdf.setFontSize(fontSize);

    const options = {
      width: pdf.internal.pageSize.getWidth(),
      height: pdf.internal.pageSize.getHeight() 
    };

    pdf.html(content, options).then(() => {
      pdf.save('SalesReport.pdf');
    });
  }
}
