import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { LayoutModule } from '@angular/cdk/layout';
import { HomeComponent } from './components/home/home.component';
import { MatImportModule } from './modules/mat-import/mat-import.module';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { UserService } from './services/user.service';
import { ProfileComponent } from './components/user/profile/profile.component';
import { LoginComponent } from './components/authentication/login/login.component';
import { RegisterComponent } from './components/authentication/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { ToastService } from './services/shared/toast.service';
import { DatePipe } from '@angular/common';
import { LoginService } from './services/auth/login.service';
import { LoginStatusService } from './services/auth/login-status.service';
import { HttpInterceptorInterceptor } from './interceptors/http-interceptor.interceptor';
import { ProfileEditComponent } from './components/user/profile/profile-edit/profile-edit.component';
import { ForgotComponent } from './components/user/forgot/forgot.component';
import { UserListComponent } from './components/user/user-list/user-list.component';








@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    HomeComponent,
    ProfileComponent,
    LoginComponent,
    RegisterComponent,
    ProfileEditComponent,
    ForgotComponent,
    UserListComponent
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatImportModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MatNativeDateModule
    
  ],
  providers: [DatePipe, HttpClient, UserService, ToastService, LoginService, LoginStatusService,
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
