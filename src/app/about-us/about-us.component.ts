import { Component, ElementRef, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { Media } from 'src/app/shared/models/Media';
import { specParams } from 'src/app/shared/models/specParams';
import { MediaService } from '../manager/media.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent {
  constructor(private mediaService: MediaService) { } 
  ngOnInit(): void {
    this.getMediaList();
  }

  modalRef?: BsModalRef;
  @ViewChild('search') searchTerm?: ElementRef;
  MediaList: Media[] = [];
  specParams: specParams = new specParams();
  sortOptions = [
    {name: 'Alphabetical: A-Z', value: 'AnsAsc'},
    {name: 'Alphabetical: Z-A', value: 'DescAns'},
  ];
  totalCount = 0;

  getMediaList(){
    this.mediaService.getMediaList(this.specParams).subscribe({
      next: response => {
        this.MediaList = response.data;
        this.specParams.pageNumber = response.pageIndex;
        this.specParams.pageSize = response.pageSize;
        this.totalCount = response.count;
        console.log(this.MediaList);
      },
      error: error => console.log(error)
    })
  }

  onSortSelected(event: any)
  {
    this.specParams.sort = event.target.value;
    this.getMediaList();
  }

  onSearch(){
    this.specParams.search = this.searchTerm?.nativeElement.value;
    this.specParams.pageNumber = 1;  
    this.getMediaList();
  }

  onReset(){
    if(this.searchTerm) this.searchTerm.nativeElement.value = '';
    this.specParams = new specParams();
    this.getMediaList();
  }

  onPageChanged(event: any)
  {
    if(this.specParams.pageNumber !== event)
    {
      this.specParams.pageNumber = event;
      this.getMediaList();
    }
  }
}
