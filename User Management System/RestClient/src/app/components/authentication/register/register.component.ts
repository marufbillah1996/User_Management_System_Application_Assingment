import { identifierName } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/authentication/user';
import { UserService } from 'src/app/services/user.service';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
import { DatePipe } from '@angular/common';
import { ToastService } from 'src/app/services/shared/toast.service';
import { Router } from '@angular/router';
import { matchValidator } from 'src/app/validators/confirmpassword';
// tslint:disable-next-line:no-duplicate-imports
const moment = _moment;
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
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class RegisterComponent implements OnInit {
  user:User = {};
  
  registerForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/)]),
    confirmpassword:new FormControl('', [Validators.required, matchValidator('password')]),
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    fullname: new FormControl('', Validators.required),
    gender: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    birthdate: new FormControl(undefined, Validators.required),
    email: new FormControl('', [Validators.required,Validators.email]),
    mobile: new FormControl('', [Validators.required, Validators.pattern(/^\d{5}[-]?\d{6}\r?$/)])
  })
  constructor(
    private userService:UserService,
    private toastService:ToastService,
    private datePipe:DatePipe,
    private router:Router
  ){}
  get f(){
    return this.registerForm.controls;
  }
  onSubmit(){
    if(this.registerForm.invalid) return;
   
    Object.assign(this.user, this.registerForm.value);
   
    this.user.birthdate = new Date( <string>this.datePipe.transform(this.user.birthdate, "yyyy-MM-dd"));
    console.log(this.user)
    this.userService.register(this.user)
    .subscribe({
      next: r=>{
        console.log(r);
        this.toastService.notify(r, 'DISMISS');
        this.router.navigateByUrl('/login');
      },
      error: err=>console.log(err.message || err)
    })
  }
  usernamechange(event:any){
    //console.log(event)
    //if(!event) return;
    if(this.f["username"].invalid) return;
    this.userService.checkUsername(event)
    .subscribe({
      next:r=> {
       
        if(r){
          this.registerForm.controls['username'].setErrors({
            notUnique: true
          })
        }
        else{
          this.registerForm.controls['username'].setErrors(null);
        }
      },
      error:err=> console.log(err.message||err)
    })
  }
  ngOnInit(): void {
    
  }
  emailchange(event:any){
    
    if(this.f["email"].invalid) return;
    console.log(event);
    this.userService.checkEmail(event)
    .subscribe({
      next:r=>{
        if(r){
          console.log(r);
          this.registerForm.controls["email"].setErrors({
            notUnique: true
          })
        }
        else {
          this.registerForm.controls["email"].setErrors(null);
        }
      }
    })
  }
  
}
