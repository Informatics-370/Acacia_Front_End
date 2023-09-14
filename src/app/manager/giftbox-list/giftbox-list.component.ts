import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { GiftboxService } from '../giftbox.service';
import { ActivatedRoute, Router } from '@angular/router';
import { specParams } from 'src/app/shared/models/specParams';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { GiftBox } from 'src/app/shared/models/GiftBox';
import { ToastrService } from 'ngx-toastr';
import { GiftBoxListVM } from 'src/app/shared/models/GiftBoxListVM';

@Component({
  selector: 'app-giftbox-list',
  templateUrl: './giftbox-list.component.html',
  styleUrls: ['./giftbox-list.component.scss']
})
export class GiftboxListComponent {
constructor(private gbService: GiftboxService, private activatedroute: ActivatedRoute, private router: Router, private modalService: BsModalService, private toaster: ToastrService){}
ngOnInit(): void {
  this.getGiftBoxes();
}

modalRef?: BsModalRef;
@ViewChild('search') searchTerm?: ElementRef;
giftboxes: GiftBoxListVM[] = [];
specParams: specParams = new specParams();
sortOptions = [
  {name: 'Alphabetical: A-Z', value: 'AnsAsc'},
  {name: 'Alphabetical: Z-A', value: 'DescAns'},
];
totalCount = 0;

getGiftBoxes(){
  this.gbService.getGiftboxes(this.specParams).subscribe({
    next: response => {
      this.giftboxes = response.data;
      this.specParams.pageNumber = response.pageIndex;
      this.specParams.pageSize = response.pageSize;
      this.totalCount = response.count;
      console.log(this.giftboxes);
    },
    error: error => console.log(error)
  })
}

onSortSelected(event: any)
{
  this.specParams.sort = event.target.value;
  this.getGiftBoxes();
}

onSearch(){
  this.specParams.search = this.searchTerm?.nativeElement.value;
  this.specParams.pageNumber = 1;  
  this.getGiftBoxes();
}

onReset(){
  if(this.searchTerm) this.searchTerm.nativeElement.value = '';
  this.specParams = new specParams();
  this.getGiftBoxes();
}

onPageChanged(event: any)
{
  if(this.specParams.pageNumber !== event)
  {
    this.specParams.pageNumber = event;
    this.getGiftBoxes();
  }
}

openModal(template: TemplateRef<any>) {
  this.modalRef = this.modalService.show(template);
  }

deleteGiftbox(id: number){
  this.gbService.deleteGiftBox(id).subscribe({
    next: () => {
      this.modalRef?.hide(),
      this.router.navigateByUrl('/dashboard/giftbox-list');
      this.toaster.success('GiftBox Deleted');
      this.getGiftBoxes()
    },
    error: error => console.log(error)
  })
}

}
