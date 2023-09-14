import { Component, ElementRef, ViewChild } from '@angular/core';
import { InventoryService } from '../inventory.service';
import { WriteOff } from 'src/app/shared/models/WriteOff';
import { writeOffParams } from 'src/app/shared/models/writeOffParams';

@Component({
  selector: 'app-writeoff-log',
  templateUrl: './writeoff-log.component.html',
  styleUrls: ['./writeoff-log.component.scss']
})
export class WriteoffLogComponent {
  constructor(private inventoryService: InventoryService) { } 
  ngOnInit(): void {
    this.getWriteOffs();
  }
  @ViewChild('search') searchTerm?: ElementRef;
  writeOffs: WriteOff[] = [];
  specParams: writeOffParams = new writeOffParams();
  sortOptions = [
    {name: 'Date: Ascending', value: 'dateAsc'},
    {name: 'Date: Descending', value: 'dateDesc'},
    {name: 'Quantity: Ascending', value: 'quantityAsc'},
    {name: 'Quantity: Descending', value: 'quantityDesc'},
  ];
  Reasons = [
    {value: "Damaged"},
    {value: "Theft"},
    {value: "Obsolete"},
    {value: "Losted"},
    {value: "Other"},
  ];
  totalCount = 0;

  getWriteOffs(){
    this.inventoryService.getWriteOffs(this.specParams).subscribe({
      next: response => {
        this.writeOffs = response.data;
        this.specParams.pageNumber = response.pageIndex;
        this.specParams.pageSize = response.pageSize;
        this.totalCount = response.count;
        console.log(this.writeOffs);
      },
      error: error => console.log(error)
    })
  }

  onSortSelected(event: any)
  {
    this.specParams.sort = event.target.value;
    this.getWriteOffs();
  }

  onReasonSelected(event: any){
    // this.specParams.reason = event.target.value;
    this.getWriteOffs();
  }

  onSearch(){
    this.specParams.search = this.searchTerm?.nativeElement.value;
    this.specParams.pageNumber = 1;  
    this.getWriteOffs();
  }

  onReset(){
    this.specParams = new writeOffParams();
    this.getWriteOffs();
  }

  onPageChanged(event: any)
  {
    if(this.specParams.pageNumber !== event)
    {
      this.specParams.pageNumber = event;
      this.getWriteOffs();
    }
  }
}
