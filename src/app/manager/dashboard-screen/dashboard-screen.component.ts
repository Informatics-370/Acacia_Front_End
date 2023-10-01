import { Component, ElementRef, ViewChild } from '@angular/core';
import { ReportParams } from 'src/app/shared/models/ReportParams';
import { ReportVM } from 'src/app/shared/models/ReportVM';
import { ReportsService } from '../report.service';
import { Chart } from 'chart.js';
import { Order } from 'src/app/shared/models/Order';
import { DashboardVM } from 'src/app/shared/models/dashboardVM';

@Component({
  selector: 'app-dashboard-screen',
  templateUrl: './dashboard-screen.component.html',
  styleUrls: ['./dashboard-screen.component.scss']
})
export class DashboardScreenComponent {
  orders: Order[] = [];
  myChart: Chart | undefined;
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
        this.createChart();
      },
      error: err => console.log(err)
    });
  }

  createChart() {
    if (!this.dashboardData) {
        return;
    }
    if (this.myChart) {
        this.myChart.data.labels = this.dashboardData.orders.map(report => new Date(report.orderDate).toDateString());
        this.myChart.data.datasets[0].data = this.dashboardData.orders.map(report => report.total);
        this.myChart.update();
    } else {
        this.myChart = new Chart("myChart", {
            type: 'bar',
            data: {
                labels: this.dashboardData.orders.map(report => new Date(report.orderDate).toDateString()),
                datasets: [{
                    label: 'Dispatch Report',
                    data: this.dashboardData.orders.map(report => report.total),
                    backgroundColor: [
                      'rgba(66, 107, 105, 0.7)',
                      'rgba(139, 177, 116, 0.7)',
                      'rgba(34, 46, 80, 0.7)',
                      'rgba(181, 202, 141, 0.7)',
                      'rgba(42, 72, 73, 0.7)',
                      'rgba(169, 146, 125, 0.7)'
                    ],
                    borderColor: [
                      'rgba(66, 107, 105, 1)',
                      'rgba(139, 177, 116, 1)',
                      'rgba(34, 46, 80, 1)',
                      'rgba(181, 202, 141, 1)',
                      'rgba(42, 72, 73, 1)',
                      'rgba(169, 146, 125, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: 'Total Orders (R)'
                        }
                    },
                    x: {
                      title: {
                        display: true,
                        text: 'Order Dates'
                      }
                  }
                },
                plugins: {
                  title: {
                      display: true,
                      text: 'Sale Orders to be dispatched'
                  }
              }
      
            }
        });
    }
  }
}
