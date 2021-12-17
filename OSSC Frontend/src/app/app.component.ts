import { Renderer2 } from '@angular/core';
import { Component } from '@angular/core';
import { LoginServiceService } from './auth/user-login/login-service.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private renderer: Renderer2, private authserv: LoginServiceService) { }
  ngAfterViewInit() {
    let loader = this.renderer.selectRootElement('#loader');
    this.renderer.setStyle(loader, 'display', $('#loader').fadeOut('slow'));
  }

}
