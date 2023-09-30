import { Component } from '@angular/core';
import { MediaService } from '../media.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ToastrService } from 'ngx-toastr';
import { Media } from 'src/app/shared/models/Media';

@Component({
  selector: 'app-add-media',
  templateUrl: './add-media.component.html',
  styleUrls: ['./add-media.component.scss']
})
export class AddMediaComponent {
  errors: string[] | null = null;
  whitespace = "[a-zA-Z0-9][a-zA-Z0-9 ]+"
  mediaForm = new FormGroup({
    id: new FormControl(0),
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    fileUrl: new FormControl('', [Validators.required]),
  });
  media?: Media;

  constructor(private mediaService: MediaService, private router: Router, private toaster: ToastrService) { 
  }

  ngOnInit(): void {
  }

  addMedia(){
    this.mediaService.addMedia(this.mediaForm.value).subscribe({
      next: () => {
        this.router.navigateByUrl('/dashboard/Media');
        this.toaster.success('Media added successfully');
      },
      error: error => {
        this.errors = error.errors
      } 
    })
  }
}
