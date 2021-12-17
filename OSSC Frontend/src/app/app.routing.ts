import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';

const routes: Routes =[
  {
    path:'',
    loadChildren:'./auth/auth.module#AuthModule'
  },
  {
    path:'dashboard',
    redirectTo:'dashboard',
    pathMatch:'full'
  },
  // {
  //   path: 'user',
  //   redirectTo: '/dashboard',
  //   pathMatch: 'full',
  // }, 
  {
    path: 'user',
    component: AdminLayoutComponent,
    children: [{
      path: '',
      loadChildren: './layouts/admin-layout/admin-layout.module#AdminLayoutModule'
    }]
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes,{
      //onSameUrlNavigation:'reload'
      useHash:true
    })
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
