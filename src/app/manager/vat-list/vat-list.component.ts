import { Component } from '@angular/core';
import { VatService } from '../vat.service';
import { Vat } from 'src/app/shared/models/Vat';
import { VatParams } from 'src/app/shared/models/vatParams';

@Component({
  selector: 'app-vat-list',
  templateUrl: './vat-list.component.html',
  styleUrls: ['./vat-list.component.scss']
})
export class VatListComponent {
  constructor(private vatService: VatService) { } 
  ngOnInit(): void {
    this.getVatList();
  }

  vatList: Vat[] = [];
  specParams: VatParams = new VatParams();
  sortOptions = [
    {name: 'Start Date: Ascending', value: 'startDateAsc'},
    {name: 'Start Date: Descending', value: 'startDateDesc'},
    {name: 'End Date: Ascending', value: 'endDateAsc'},
    {name: 'End Date: Descending', value: 'endDateDesc'},
  ];
  vatStatus = [
    {name: 'Active', value: true},
    {name: 'Inactive', value: false}
  ];
  totalCount = 0;

  getVatList(){
    this.vatService.getVatList(this.specParams).subscribe({
      next: response => {
        this.vatList = response.data;
        this.specParams.pageNumber = response.pageIndex;
        this.specParams.pageSize = response.pageSize;
        this.totalCount = response.count;
        console.log(this.vatList);
      },
      error: error => console.log(error)
    })
  }

  onSortSelected(event: any)
  {
    this.specParams.sort = event.target.value;
    this.getVatList();
  }

  onStatusSelected(event: any){
    this.specParams.IsActive = event.target.value;
    this.getVatList();
  }

  onReset(){
    this.specParams = new VatParams();
    this.getVatList();
  }

  onPageChanged(event: any)
  {
    if(this.specParams.pageNumber !== event)
    {
      this.specParams.pageNumber = event;
      this.getVatList();
    }
  }

}
