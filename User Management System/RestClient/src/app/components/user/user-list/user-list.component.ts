import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { throwError } from 'rxjs';
import { User } from 'src/app/models/authentication/user';
import { ToastService } from 'src/app/services/shared/toast.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit{
  
  users:User[] =[];
  dataSource:MatTableDataSource<User>= new MatTableDataSource(this.users);
  columnList=['username','firstname','lastname', 'fullname','gender','address', 'birthdate', 'email', 'mobile'];
  @ViewChild(MatPaginator, {static:false}) paginator!: MatPaginator;
  @ViewChild(MatSort,{static:false}) sort!: MatSort;
  constructor(
    private userService:UserService,
    private toastService:ToastService
  ){

  }
  ngOnInit(): void {
    this.userService.getAll()
    .subscribe({
      next:r=>{
        this.users=r;
        this.dataSource.data=this.users;
        this.dataSource.sort= this.sort;
        this.dataSource.paginator = this.paginator
      },
      error:err=>{
        this.toastService.notify("Failed to load user data", "DISMISS");
        throwError(()=> err);
      }
    });
  }
}
