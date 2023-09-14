import { Component, ElementRef, ViewChild } from '@angular/core';
import { InventoryService } from '../inventory.service';
import { specParams } from 'src/app/shared/models/specParams';
import { CustomerReturn } from 'src/app/shared/models/CustomerReturn';

@Component({
  selector: 'app-return-log',
  templateUrl: './return-log.component.html',
  styleUrls: ['./return-log.component.scss']
})
export class ReturnLogComponent {
  constructor(private inventoryService: InventoryService) { } 
  ngOnInit(): void {
    this.getReturns();
  }

  @ViewChild('search') searchTerm?: ElementRef;
  custReturns: CustomerReturn[] = [];
  specParams: specParams = new specParams();
  sortOptions = [
    {name: 'Date: Low to High', value: 'dateAsc'},
    {name: 'Date: High to Low', value: 'dateDesc'},
    {name: 'Total: Low to High', value: 'totalAsc'},
    {name: 'Total: High to Low', value: 'totalDesc'},
  ];
  totalCount = 0;

  getReturns(){
    this.inventoryService.getReturns(this.specParams).subscribe({
      next: response => {
        this.custReturns = response.data;
        this.specParams.pageNumber = response.pageIndex;
        this.specParams.pageSize = response.pageSize;
        this.totalCount = response.count;
        console.log(this.custReturns);
      },
      error: error => console.log(error)
    })
  }

  onSortSelected(event: any)
  {
    this.specParams.sort = event.target.value;
    this.getReturns();
  }

  onSearch(){
    this.specParams.search = this.searchTerm?.nativeElement.value;
    this.specParams.pageNumber = 1;  
    this.getReturns();
  }

  onReset(){
    if(this.searchTerm) this.searchTerm.nativeElement.value = '';
    this.specParams = new specParams();
    this.getReturns();
  }

  onPageChanged(event: any)
  {
    if(this.specParams.pageNumber !== event)
    {
      this.specParams.pageNumber = event;
      this.getReturns();
    }
  }
}
