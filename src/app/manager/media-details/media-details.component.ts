import { Component } from '@angular/core';
import { MediaService } from '../media.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ToastrService } from 'ngx-toastr';
import { Media } from 'src/app/shared/models/Media';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-media-details',
  templateUrl: './media-details.component.html',
  styleUrls: ['./media-details.component.scss']
})
export class MediaDetailsComponent {
  errors: string[] | null = null;
  whitespace = "[a-zA-Z0-9][a-zA-Z0-9 ]+"
  mediaForm = new FormGroup({
    id: new FormControl(0),
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    fileUrl: new FormControl('', Validators.required),
  });
  media?: Media;

  
  constructor(private sanitizer: DomSanitizer, private mediaService: MediaService, private activatedRoute: ActivatedRoute, private bcService: BreadcrumbService, private router: Router, private toaster: ToastrService) { 
    this.bcService.set('@mediaDetails', '');
  }

  ngOnInit(): void {
    this.loadMedia();  
  }

  loadMedia(){
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) this.mediaService.getMedia(+id).subscribe({
      next: media => {
        media && this.mediaForm.patchValue(media);
        this.media = media,
        this.bcService.set('@mediaDetails', media.name);
        console.log(this.mediaForm.value);
      },
      error: err => console.log(err)
    })
  }

  getSafeFileUrl(mediaLink: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(mediaLink);
  }
  
  updateMedia(){
    this.mediaService.updateMedia(this.mediaForm.value).subscribe({
      next: () => {
        this.router.navigateByUrl('/dashboard/Media');
        this.toaster.success('Media updated');
      },
      error: error => {
        this.errors = error.errors
      } 
    })
  }
}
