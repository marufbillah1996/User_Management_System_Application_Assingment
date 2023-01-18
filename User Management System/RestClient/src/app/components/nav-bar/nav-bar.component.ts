import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { LoginStatusService } from 'src/app/services/auth/login-status.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private loginStatusService:LoginStatusService,
    private router:Router
    ) {}
    get isLoggedIn(){
      return this.loginStatusService.isLoggedIn;
    }
    get username(){
      return this.loginStatusService.username;
    }
    logout(){
      this.loginStatusService.logout();
      this.router.navigate(['/home']);
    }
}
