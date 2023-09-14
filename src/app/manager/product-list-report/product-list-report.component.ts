import { Component, ElementRef, ViewChild } from '@angular/core';
import { ReportsService } from '../report.service';
import { Product } from 'src/app/shared/models/product';
import { ReportParams } from 'src/app/shared/models/ReportParams';
import jsPDF from 'jspdf';
import { User } from 'src/app/shared/models/user';
import { AccountService } from 'src/app/account/account.service';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-product-list-report',
  templateUrl: './product-list-report.component.html',
  styleUrls: ['./product-list-report.component.scss']
})
export class ProductListReportComponent {
  products: Product[] = [];
  User?: User | null
  specParams: ReportParams = new ReportParams();
  sortOptions = [
    {name: 'Price: Low to High', value: 'priceAsc'},
    {name: 'Price: High to Low', value: 'priceDesc'},
    {name: 'Name: Low to High', value: 'nameAsc'},
    {name: 'Name: High to Low', value: 'nameDesc'},
  ];

  constructor(private reportService: ReportsService, private accountService: AccountService){}
  ngOnInit(): void {
    this.getProducts();
    this.getUser();
  }

  onSortSelected(event: any){
    this.specParams.sort = event.target.value;
    this.getProducts();
  }

  getProducts(){
    this.reportService.getProductListReport(this.specParams).subscribe({
      next: response => {
        this.products = response;
      },
      error: error => console.log(error)
    })
  }

  getUser(){
    this.accountService.currentUser$.subscribe(user =>{
        this.User = user;
    });
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
    PDF.text('PRODUCTS LIST REPORT', fileWidth / 20, 55, { align: 'left' });
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

    // ... (repeat the process of adding content and page numbering as needed on the new page)
  }
    PDF.save('ProductsListReport.pdf');
    });
  }
}
