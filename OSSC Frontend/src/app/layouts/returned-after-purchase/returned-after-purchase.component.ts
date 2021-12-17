import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { AppService } from 'app/app.service';
import { SaleReturnService } from '../sale-return/sale-return.service';

@Component({
  selector: 'app-returned-after-purchase',
  templateUrl: './returned-after-purchase.component.html',
  styleUrls: ['./returned-after-purchase.component.css']
})
export class ReturnedAfterPurchaseComponent implements OnInit {

  instrumentNo
  saleReturnData: any;
  tableShow: boolean;
  allSaleReturnData: any;
  allSaleReturnTableShow: boolean;
  topHeadDisable=false

  constructor(private snakbar:MatSnackBar,private service:SaleReturnService,private spoServ:AppService,private activatedRoute:ActivatedRoute) { 
    activatedRoute.queryParams.subscribe(params => {
      this.instrumentNo = params.instrumentNo;
      if(this.instrumentNo){
        this.topHeadDisable=true
        this.onSubmit()
      }
      
    });
  }

  ngOnInit(): void {
  }


  onSubmit() {
    let clearData
    this.saleReturnData = clearData
    this.tableShow=false

    this.service.getPurchaseReturnData(this.instrumentNo).subscribe(
      data=>{
        
        if(data.json().length>0){
          this.tableShow=true
          this.allSaleReturnData=data.json()
          this.allSaleReturnTableShow=true
        }else{
          this.allSaleReturnTableShow=false
        }
      },
      error=>{
        this.snakbar.open('Unexpected Error', 'Error', {
          duration: 3000
        })
      }
    )
  }


}
