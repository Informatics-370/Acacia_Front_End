import { Component, ElementRef, ViewChild } from '@angular/core';
import { ReportParams } from 'src/app/shared/models/ReportParams';
import { ReportsService } from '../report.service';
import { Chart } from 'chart.js';
import { SupplierReportVM } from 'src/app/shared/models/SupplierReport';
import { BsDatepickerConfig, BsDatepickerViewMode } from 'ngx-bootstrap/datepicker';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { User } from 'src/app/shared/models/user';
import { AccountService } from 'src/app/account/account.service';

@Component({
  selector: 'app-supplier-order-report',
  templateUrl: './supplier-order-report.component.html',
  styleUrls: ['./supplier-order-report.component.scss']
})
export class SupplierOrderReportComponent {
  myChart: Chart | undefined;
  errors: string[] | null = null;
  Report?: SupplierReportVM;
  User?: User | null
  salesParams: ReportParams = new ReportParams();
  dateForm = new FormGroup({
    startDate: new FormControl(''),
    endDate: new FormControl('')
  })

  constructor(private reportService: ReportsService, private accountService: AccountService) { 
  }

  ngOnInit(): void {
    this.loadReport();
    this.getUser();
  }

  getUser(){
    this.accountService.currentUser$.subscribe(user => {
      this.User = user;
      console.log(user)
    });
    console.log(this.User?.displayName)
  }

  loadReport() {
    this.reportService.getSupplierOrderReport(this.salesParams).subscribe({
      next: report => {
        this.Report = report;
        this.createChart();
        console.log(this.Report);
      },
      error: err => console.log(err)
    });
  }

  onDateSelected() {
    if(this.dateForm.value.startDate && this.dateForm.value.endDate){
      this.salesParams.startDate = new Date(this.dateForm.value.startDate);
      this.salesParams.endDate = new Date(this.dateForm.value.endDate); 
      this.loadReport();
    }
  }

  onReset(){
    this.salesParams = new ReportParams();
    this.loadReport();
  }

  createChart() {
    if (!this.Report) {
        return;
    }
    if (this.myChart) {
        this.myChart.data.labels = this.Report.data.map(supplier => supplier.supplierName);
        this.myChart.data.datasets[0].data = this.Report.data.map(supplier => supplier.total);
        this.myChart.update();
    } else {
        this.myChart = new Chart("myChart", {
            type: 'bar',
            data: {
                labels: this.Report.data.map(supplier => supplier.supplierName),
                datasets: [{
                    label: 'Supplier Report',
                    data: this.Report.data.map(supplier => supplier.total),
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
                        text: 'Suppliers'
                      }
                  }
                },
                plugins: {
                  title: {
                      display: true,
                      text: 'Supplier Orders per Supplier'
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
    PDF.text('SUPPLIER ORDERS REPORT', fileWidth / 20, 55, { align: 'left' });
      
    // Add printed by and date printed
    console.log(this.User?.displayName)
    const printedBy = 'PRINTED BY: ' + this.User?.displayName; 
    const datePrinted = `DATE PRINTED: ${new Date().toLocaleString()}`;
    PDF.setFontSize(8);
    PDF.text(printedBy, fileWidth - 198, 60, { align: 'left' });
    PDF.text(datePrinted, fileWidth - 10, 60, { align: 'right' });
    if(this.dateForm.value.startDate && this.dateForm.value.endDate){
      PDF.text("Order Date Range: " + this.dateForm.value.startDate + " - " + this.dateForm.value.endDate, fileWidth - 198, 65, { align: 'right' });
    }
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
    PDF.save('SupplierOrdersReport.pdf');
    });
  }
}
