import { Component, ElementRef, ViewChild } from '@angular/core';
import { ReportParams } from 'src/app/shared/models/ReportParams';
import { ReportVM } from 'src/app/shared/models/ReportVM';
import { ReportsService } from '../report.service';
import { Chart, registerables } from 'chart.js';
import jsPDF from 'jspdf';
import { ProductService } from '../product.service';
import { Category } from 'src/app/shared/models/category';
import { AccountService } from 'src/app/account/account.service';
import { User } from 'src/app/shared/models/user';
import html2canvas from 'html2canvas';
Chart.register(... registerables)

@Component({
  selector: 'app-products-trends-report',
  templateUrl: './products-trends-report.component.html',
  styleUrls: ['./products-trends-report.component.scss']
})
export class ProductsTrendsReportComponent {
  errors: string[] | null = null;
  Report?: ReportVM;
  myChart: Chart | undefined;
  User?: User | null
  categories: Category[] = [];
  salesParams: ReportParams = new ReportParams();
  Total = 0

  constructor(private reportService: ReportsService, private productService: ProductService, private accountService: AccountService) { }

  ngOnInit(): void {
    this.loadReport();
    this.getCategories();
    this.getUser();
  }

  loadReport() {
    this.reportService.getTrendsReport(this.salesParams).subscribe({
      next: report => {
        this.Report = report;
        this.Total = this.Report?.data.reduce((total, current) => total + current, 0)
        console.log(this.Report);
        this.createChart();
      },
      error: err => console.log(err)
    });
  }

  getUser(){
    this.accountService.currentUser$.subscribe(user => {
      this.User = user;
      console.log(user)
    });
    console.log(this.User?.displayName)
  }

  onReset(){
    this.salesParams = new ReportParams();
    this.loadReport();
  }

  getCategories(){
    this.productService.getCategories().subscribe({
      next: response => this.categories = [{id: 0, name: 'All'}, ...response],
      error: error => console.log(error)
    })
  }

  onCategorySelected(categoryId: number){
    this.salesParams.categoryId = categoryId;
    this.loadReport();
  }

  createChart() {
    if (!this.Report) {
        return;
    }
    if (this.myChart) {
        this.myChart.data.labels = this.Report.labels,
        this.myChart.data.datasets[0].data = this.Report.data,
        this.myChart.update();
    } else {
        this.myChart = new Chart("myChart", {
            type: 'bar',
            data: {
                labels: this.Report.labels,
                datasets: [{
                    label: 'Products Trend Report',
                    data: this.Report.data,
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
                        text: 'Products'
                      }
                  }
                },
                plugins: {
                  title: {
                      display: true,
                      text: 'Popular product purchases'
                  }
              }
            }
        });
    }
  }

  public printPdf(): void {
    let DATA: any = document.getElementById('content');
    let logo = new Image();
    logo.src = 'assets/images/logo2.png'; // Update the path to your logo image
    html2canvas(DATA).then((canvas) => {
      //let fileWidth = 208;
      
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');//jspdf instance
      const fileWidth = PDF.internal.pageSize.width; // pdf page width
      const fileHeight = (canvas.height * fileWidth) / canvas.width;

      PDF.setFont('helvetica', 'normal');
      PDF.setFontSize(14);

    // Add logo to the top left corner
    PDF.addImage(logo, 'PNG', 10, 10, 39, 10);
        
    // Add store address on top right
    const storeAddress =  '46 Ingersol Road' + '\n' +
                          'Lynnwood Glen'    + '\n' + 
                          'Pretoria, 0081' + '\n' + 
                          'Gauteng, South Africa' + '\n' + 
                          'Tel: 012 470 2200' + '\n' +
                          'E-mail: info@epiuse.com';
    PDF.setFontSize(10);
    PDF.text(storeAddress, 160, 10);
    // Add report title
    PDF.setFontSize(18);
    PDF.text('PRODUCT TRENDS REPORT', fileWidth / 20, 55, { align: 'left' });
      
    // Add printed by and date printed
    console.log(this.User?.displayName)
    const printedBy = 'PRINTED BY: ' + this.User?.displayName; 
    const datePrinted = `DATE PRINTED: ${new Date().toLocaleString()}`;
    PDF.setFontSize(8);
    PDF.text(printedBy, fileWidth - 198, 60, { align: 'left' });
    PDF.text(datePrinted, fileWidth - 10, 60, { align: 'right' });
    let startY = 80; // Y-coordinate for starting content
    let currentPage = 1;
    // Add the HTML table as an image
    PDF.addImage(FILEURI, 'PNG', 10, startY, fileWidth - 20, fileHeight);
  // Add end of report
  PDF.setFontSize(10);
  PDF.text('***END OF REPORT***', fileWidth / 2, startY + fileHeight + 10, { align: 'center' });

  // Add page numbering
  for (let i = 1; i <= currentPage; i++) {
    PDF.setPage(i);
    PDF.setFontSize(8);
    PDF.text(`Page ${i} of ${currentPage}`, fileWidth / 2, fileHeight + startY + 15, { align: 'center' });
  }

  // Check if content needs to continue on the next page
  if (startY + fileHeight + 30 > PDF.internal.pageSize.height) {
    PDF.addPage();
    currentPage++;
    startY = 10;
  }
    PDF.save('ProductTrendsReport.pdf');
    });
  }
}
