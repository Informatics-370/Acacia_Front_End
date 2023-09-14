import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users.service';
import { User_Role } from 'src/app/shared/models/User_Role';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/shared/models/user';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit{
  roles: User_Role[] = [];
  errors: string[] = [];
  user?: User;
  userForm = new FormGroup({
    displayName: new FormControl({value: '', disabled: true}, Validators.required),
    profilePicture: new FormControl({value: '', disabled: true}, Validators.required),
    email: new FormControl({value: '', disabled: true}, Validators.required),
    roles: new FormControl([''], Validators.required),
    token: new FormControl({value: '', disabled: true}, Validators.required)
  })

  email = this.activatedRoute.snapshot.paramMap.get('email');

  constructor(private userService: UsersService, private activatedRoute: ActivatedRoute, private bcService: BreadcrumbService, private router: Router, private toaster: ToastrService){
    this.bcService.set('@userDetails', '');
  }

  ngOnInit(): void {
      this.getUser();
      this.getRoles();
  }

  getRoles(){
    this.userService.getUserRoles().subscribe({
      next: response => {
        this.roles = [...response];
      },
      error: error => {
        this.errors = error.errors;
      }
    })
  }

  getUser(){
    this.userService.getUser(this.email).subscribe({
      next: user => {
        user && this.userForm.patchValue(user);
        this.user = user;
        this.bcService.set('@userDetails', user.displayName);
      },
      error: errors => {
          this.errors = errors.errors;
      }
    })
  }

  onRoleSelected(event: any){
    this.userForm.value.roles = [event.target.value];
    this.user?.roles.pop() 
    this.user?.roles.push(event.target.value)
  }

  updateUser(){
    console.log(this.user)
    this.userService.updateUserRole(this.user).subscribe({
      next: response => {
        this.router.navigateByUrl('/dashboard/user-list');
        this.toaster.success('User Role successfully update');
      },
      error: errors => {

      }
    })
  }

}
