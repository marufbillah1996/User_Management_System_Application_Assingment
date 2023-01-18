import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/authentication/user';
import { ToastService } from 'src/app/services/shared/toast.service';
import { UserService } from 'src/app/services/user.service';
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'YYYY-MM-DD',
    monthYearA11yLabel: 'YYYY',
  },
};
@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class ProfileEditComponent implements OnInit{
  imagePath = 'http://localhost:5000/uploads';
  user: User = null!;
  profileForm = new FormGroup({
    username: new FormControl('', Validators.required),
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    fullname: new FormControl('', Validators.required),
    gender: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    birthdate: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required,Validators.email]),
    mobile: new FormControl('', [Validators.required, Validators.pattern(/^\d{5}[-]?\d{6}\r?$/)])
  })
  constructor(
    private userService: UserService,
    private toastService:ToastService,
    private activatedRoute: ActivatedRoute,
    private datePipe:DatePipe,
    private router:Router
  ) {}
  get f(){
    return this.profileForm.controls;
  }
  emailchange(event:any){
    
    if(this.f["email"].invalid) return;
    console.log(event);
    this.userService.checkEmail(event)
    .subscribe({
      next:r=>{
        if(r){
          console.log(r);
          this.profileForm.controls["email"].setErrors({
            notUnique: true
          })
        }
        else {
          this.profileForm.controls["email"].setErrors(null);
        }
      }
    })
  }
  onSubmit(){
    if(this.profileForm.invalid) return;
   
    Object.assign(this.user, this.profileForm.value);
   
    this.user.birthdate = new Date( <string>this.datePipe.transform(this.user.birthdate, "yyyy-MM-dd"));
    console.log(this.user)
    this.userService.update(this.user)
    .subscribe({
      next: r=>{
        console.log(r);
        this.toastService.notify('Data updated', 'DISMISS');
        
      },
      error: err=>(err.message || err)
    })
  }
  ngOnInit(): void {
    let id: number = this.activatedRoute.snapshot.params['id'];
    //console.log(username);
    this.userService.get(id).subscribe({
      next: (r) => {
        this.user = r;
        this.user.picture = this.user.picture ?? 'avatar-blank.jpg';
        //Object.assign(this.profileForm.value, this.user);
        this.f['username'].patchValue(this.user.username ?? '');
        this.f['username'].disable();
        this.f['firstname'].patchValue(this.user.firstname ?? '');
        this.f['lastname'].patchValue(this.user.lastname ?? '');
        this.f['fullname'].patchValue(this.user.fullname ?? '');
        this.f['gender'].patchValue(this.user.gender ?? '');
        this.f['address'].patchValue(this.user.address ?? '');
        this.f['birthdate'].patchValue(this.user.birthdate?.toString() ?? null);
        this.f['email'].patchValue(this.user.email ?? '');
        this.f['mobile'].patchValue(this.user.mobile ?? '');
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
