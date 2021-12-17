import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginServiceService } from '../user-login/login-service.service';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { Http } from '@angular/http';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class LoginInterceptor implements HttpInterceptor {

  constructor(private http1: Http, private loginServ: LoginServiceService, private router: Router) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let token = localStorage.getItem('token')
    if (token) {
      let x = JSON.parse(token).token

      return this.http1.post(`${environment.port}/auth/checkToken`, { token: x }).pipe(
        switchMap(
          data => {
            if (data.json() == true) {
              return next.handle(request)
            }
            if (data.json() == false) {
              localStorage.clear();
              this.router.navigate(['/login'])
            }
          }
        )
      )
    }


  }
}
