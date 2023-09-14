import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { UsersService } from '../users.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { UserParams } from 'src/app/shared/models/userParams';
import { User } from 'src/app/shared/models/user';
import { User_Role } from 'src/app/shared/models/User_Role';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-user-lists',
  templateUrl: './user-lists.component.html',
  styleUrls: ['./user-lists.component.scss']
})
export class UserListsComponent implements OnInit {
  constructor(private userService: UsersService, private toaster: ToastrService, private modalService: BsModalService, private router: Router) { } 
  ngOnInit(): void {
    this.getUsers();
    this.getRoles();
  }
  totalCount = 0
  modalRef?: BsModalRef;
  @ViewChild('search') searchTerm?: ElementRef;
  users: User[] = [];
  roles: User_Role[] = [];
  userParams: UserParams = new UserParams();
  sortOptions = [
    {name: 'Alphabetical: A-Z', value: 'nameAsc'},
    {name: 'Alphabetical: Z-A', value: 'nameDesc'},
  ];

  getUsers(){
    this.userService.getUsers(this.userParams).subscribe({
      next: response => {
        this.users = response.data;
        this.userParams.pageNumber = response.pageIndex;
        this.userParams.pageSize = response.pageSize;
        this.totalCount = response.count;
        console.log(this.users);
      },
      error: error => console.log(error)
    })
  }

  getRoles(){
    this.userService.getUserRoles().subscribe({
      next: response => this.roles = [...response],
      error: error => console.log(error)
    })
  }

  onRoleSelected(role: string){
    this.userParams.userRole = role;
    this.userParams.pageNumber = 1;
    this.getUsers();
  }

  onSortSelected(event: any)
  {
    this.userParams.sort = event.target.value;
    this.getUsers();
    this.getRoles();
  }

  onSearch(){
    this.userParams.search = this.searchTerm?.nativeElement.value;
    this.userParams.pageNumber = 1;  
    this.getUsers();
  }

  onReset(){
    if(this.searchTerm) this.searchTerm.nativeElement.value = '';
    this.userParams = new UserParams();
    this.getUsers();
  }

  onPageChanged(event: any)
  {
    if(this.userParams.pageNumber !== event)
    {
      this.userParams.pageNumber = event;
      this.getUsers();
    }
  }
}
