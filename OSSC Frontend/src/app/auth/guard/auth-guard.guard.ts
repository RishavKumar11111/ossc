import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { LoginServiceService } from '../user-login/login-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {
  constructor(private serv: LoginServiceService, private route: Router, private http1: HttpClient, private router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    let token = localStorage.getItem('token')
    if (token) {
      let x = JSON.parse(token).token
      return this.http1.post(`${environment.port}/auth/checkToken`, { token: x }).pipe(
        map(
          data => {
            if (data == true) {
              return true
            }
            if (data == false) {
              localStorage.clear();
              this.router.navigate(['/login'])
            }
          }
        )
      )
    }

    // var condi=this.serv.loggedIn()
    // console.log(condi);

  }

}
