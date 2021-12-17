import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, MinLengthValidator } from '@angular/forms';
import { Route } from '@angular/compiler/src/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginServiceService } from './login-service.service';
import { data } from 'jquery';
import { AppService } from 'app/app.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {
  token: any;
  
  constructor(private route: Router,private toastr:ToastrService, private loginService: LoginServiceService, private appServ: AppService, private activatedRoute: ActivatedRoute) {
    activatedRoute.queryParams.subscribe(token => {
      this.token = token.token
      if (this.token) {
        localStorage.setItem('token', JSON.stringify(token));
        loginService.sisSystemLogin(this.token).subscribe(
          data => {
            if (data.spoCode) {
              appServ.spoID = data.spoCode
              this.route.navigate(["/user/dashboard"])
            }else{
              toastr.error('Unexpected Error','Error')
            }
          },
          error=>{
            toastr.error('Server Error','Error')
          }
        )

      }

    })
  }

  ngOnInit(): void {
  }

  loginForm = new FormGroup({
    userName: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })
  get userName() {
    return this.loginForm.get('userName');
  }
  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    // if(this.loginForm.value.userName==this.user && this.loginForm.value.password==this.pass){
    //   this.route.navigate(['/dashboard'])

    // }
    this.loginService.loginUser(this.loginForm.value)

  }

}
