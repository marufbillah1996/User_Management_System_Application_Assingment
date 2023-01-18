import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/authentication/login/login.component';
import { RegisterComponent } from './components/authentication/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { ForgotComponent } from './components/user/forgot/forgot.component';
import { ProfileEditComponent } from './components/user/profile/profile-edit/profile-edit.component';
import { ProfileComponent } from './components/user/profile/profile.component';
import { UserListComponent } from './components/user/user-list/user-list.component';
import { AuthGuard } from './guards/auth-guard.guard';


const routes: Routes = [
  {path:"", component:HomeComponent},
  {path:"home", component:HomeComponent},
  {path:"profile/:name", component:ProfileComponent, canActivate:[AuthGuard]},
  {path:"profile/edit/:id", component:ProfileEditComponent, canActivate:[AuthGuard]},
  {path:"users", component:UserListComponent, canActivate:[AuthGuard]},
  {path:"forgot", component:ForgotComponent},
  {path:'login', component:LoginComponent},
  {path:'register', component:RegisterComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
