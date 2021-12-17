import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { Http } from '@angular/http';
import { AuthHttp, AuthConfig, JwtHelper } from 'angular2-jwt'
import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {
  helper = new JwtHelper()
  constructor(private http: HttpClient, private http1: Http, private router: Router, private toastr: ToastrService) { }



  loginUser(logindata) {
    localStorage.clear();

    this.http1.post(`${environment.port}/auth/login`, logindata).subscribe(res => {

      if (res.json().token != 'invalid') {
        localStorage.setItem('token', JSON.stringify(res.json()));
        this.router.navigate(["/user/dashboard"])
      } else {
        this.toastr.warning('UserId or Password is incorrect')
      }

    })
  }


  sisSystemLogin(token): Observable<any> {
    return this.http.post(`${environment.port}/auth/varifyTokenn`, { token: token })
  }

  roleBasedLoginSidebar(token):Observable<any>{
    return this.http.post(`${environment.port}/auth/roleBasedLogin`, { token: token })
  }

  loggedIn() {
    var tokenVar = localStorage.getItem('token')
    var x = JSON.parse(tokenVar)
    if (tokenVar) {
      if (this.helper.isTokenExpired(tokenVar)) {
        return false
      } else {
        return true
      }
    } else {
      return false
    }
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login'])
  }

}
