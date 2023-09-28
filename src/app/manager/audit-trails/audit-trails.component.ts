import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuditTrailService } from '../audit-trail.service';
import { AuditTrail } from 'src/app/shared/models/auditTrail';
import { AuditParams } from 'src/app/shared/models/auditParams';

@Component({
  selector: 'app-audit-trails',
  templateUrl: './audit-trails.component.html',
  styleUrls: ['./audit-trails.component.scss']
})
export class AuditTrailsComponent {

  @ViewChild('search') searchTerm?: ElementRef;
  errors: string[] = [];
  audits: AuditTrail[] = [];
  auditParams: AuditParams = new AuditParams();
  sortOptions = [
    {name: 'Price: Low to High', value: 'amountAsc'},
    {name: 'Price: High to Low', value: 'amountDesc'},
    {name: 'Quantity: Low to High', value: 'quantityAsc'},
    {name: 'Quantity: High to Low', value: 'quantityDesc'},
    {name: 'Date: Low to High', value: 'dateAsc'},
    {name: 'Date: High to Low', value: 'dateDesc'},
  ];
  AuditTypes = [
    {name: 'Sale Order', value: 'Sale Order'},
    {name: 'Supplier Order', value: 'Supplier Order'},
    {name: 'Sale Return', value: 'Sale Return'},
    {name: 'Supplier Return', value: 'Supplier Return'}, 
    {name: 'Write-Offs', value: 'Write Off'}
  ];
  totalCount = 0;


  constructor(private auditService: AuditTrailService){}

  ngOnInit(): void {
    this.getAuditTrail();
  }

  getAuditTrail(){
    this.auditService.getAuditTrail(this.auditParams).subscribe({
      next: response => {
        this.audits = response.data;
        this.auditParams.pageNumber = response.pageIndex;
        this.auditParams.pageSize = response.pageSize;
        this.totalCount = response.count;
      },
      error: error => console.log(error)
    })
  }

  onAuditTypeSelected(event: any){
    this.auditParams.auditType = event.target.value;
    this.auditParams.pageNumber = 1;
    this.getAuditTrail();
  }

  onSortSelected(sort: any){
    this.auditParams.sort = sort;
    this.getAuditTrail();
  }

  onPageChanged(event: any)
  {
    if(this.auditParams.pageNumber !== event)
    {
      this.auditParams.pageNumber = event;
      this.getAuditTrail();
    }
  }

  onSearch(){
    this.auditParams.search = this.searchTerm?.nativeElement.value;
    this.auditParams.pageNumber = 1;  
    this.getAuditTrail();
  }

  onReset(){
    if(this.searchTerm) this.searchTerm.nativeElement.value = '';
    this.auditParams = new AuditParams();
    this.getAuditTrail();
  }
}
