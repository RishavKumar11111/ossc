import { Component, OnInit } from '@angular/core';
import { LoginServiceService } from 'app/auth/user-login/login-service.service';
import { data } from 'jquery';
import { ToastrService } from 'ngx-toastr';

declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  // { path: '/user/dashboard', title: 'Dashboard', icon: 'dashboard', class: '' },
   { path: '/user/stock-transfer', title: 'Stock Transfer', icon: 'flight_takeoff', class: '' },
  { path: '/user/stock-for-receipt', title: "Stocks For Receipt", icon: "call_received", class: '' },
  {path:'/user/stock-deficit',title:'Stock Deficit',icon:'call_received',class:''},
  {path:'/user/stock-sell',title:'Stock Sell',icon:'local_shipping',class:''},
  {path:'/user/sale-return',title:'Sale Return',icon:'keyboard_return',class:''},
  {path:'/user/purchase-return',title:'Purchase Return',icon:'published_with_changes',class:''}
  
  // { path: '/app-receipt', title: "Receipt", icon: "", class: '' }

];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  userRole

  constructor(private loginServ:LoginServiceService,private toastr:ToastrService) { 
    let token=localStorage.getItem('token')
    loginServ.roleBasedLoginSidebar(token).subscribe(
      data=>{
        this.userRole=data.role
      },
      error=>{
        this.toastr.error('Unexpected Error')
      }
    )
  }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }

  reportDropdown(){
      $('ul li .rprtShow').toggleClass("show")
      $('li span').toggleClass('spin')
      $('ul li .reportButton').toggleClass('clr')
    
    
  }

  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  };
}
