import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { AppService } from 'app/app.service';
import { ToastrService } from 'ngx-toastr';
import { SaleReturnService } from './sale-return.service';

@Component({
  selector: 'app-sale-return',
  templateUrl: './sale-return.component.html',
  styleUrls: ['./sale-return.component.css']
  // ,
  // encapsulation: ViewEncapsulation.None 
})
export class SaleReturnComponent implements OnInit {
  instrumentNo: any;
  tableShow = false;
  saleReturnData: any;
  returnedQuan: any;
  buttonActivate: boolean;
  errMsg = false;
  dateSelected: any;
  minDate: Date;
  maxDate: Date;
  selectedDate
  challan_No
  referSPO: any;
  showReferSpo = false;
  allSaleReturnData: any;
  allSaleReturnTableShow: boolean;
  totalBagsReturned=0;
  constructor(private service: SaleReturnService, private snakbar: MatSnackBar, private spoServ: AppService, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  // @ViewChild('sellReturnForm') sellReturnFormm;

  sellReturnForm = new FormGroup({
    returnQuan: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    challan_No: new FormControl('', Validators.required)
  })


  onSubmit() {
    let clearData
    this.saleReturnData = clearData
    this.showReferSpo = false
    this.tableShow = false
    // this.sellReturnFormm.resetForm()
    this.sellReturnForm.reset()

    this.service.getDataAccInstrumentNo(this.instrumentNo, this.spoServ.spoID).subscribe(
      data => {
        if (data.noData == true) {
          // this.snakbar.open('No Data', '', {
          //   duration: 3000
          // })
          this.toastr.warning('The instrument number entered seems to be incorrect')

        } else if (data.referSPO) {
          this.tableShow = false
          this.referSPO = data.referSPO[0].spo_Name
          this.showReferSpo = true
        } else {
          this.saleReturnData = clearData
          this.tableShow = true
          this.saleReturnData = data
          let date1=new Date(this.saleReturnData.date_Sale)
          console.log(123,this.saleReturnData);
          
          // let date = this.saleReturnData.date_sale.split("/")
          this.maxDate = new Date();
          this.minDate=date1
          // if (date.length > 0) {
          //   let d = date[0];
          //   let m = parseInt(date[1]) - 1;
          //   let y = date[2];
          //   if (parseInt(d) > 0) {
          //     this.minDate = new Date(y, m, d);
          //   }
          // }


        }

      },
      error => {
        // this.snakbar.open('Unexpected Error', 'Error', {
        //   duration: 3000
        // })
        this.toastr.error('Unexpected Error', 'Error')
      }
    )

    this.service.getSaleReturnData(this.instrumentNo).subscribe(
      data => {
        // console.log(data);
        
        this.totalBagsReturned=0
        
        if (data.json()) {
          this.allSaleReturnData = data.json()
          
          for(let i=0;i<this.allSaleReturnData.length;i++){
            this.totalBagsReturned=this.totalBagsReturned+this.allSaleReturnData[i].no_of_Bag
          }
          
          this.allSaleReturnTableShow = true
        } else {
          this.allSaleReturnTableShow = false
        }
      },
      error => {
        // this.snakbar.open('Unexpected Error', 'Error', {
        //   duration: 3000
        // })
        this.toastr.error('Unexpected Error', 'Error')
      }
    )
  }

  quanCheck(quant) {
    if (quant > 0 && quant <= this.saleReturnData.no_of_Bag-this.totalBagsReturned) {
      this.errMsg = false
    } else {
      // this.buttonActivate = false
      this.errMsg = true
      this.sellReturnForm.controls['returnQuan'].reset()
    }
  }

  finalSubmit() {
    if (confirm('Are you sure to receive ?')) {
      this.service.finalSellReturnSubmit(this.saleReturnData, this.returnedQuan, this.selectedDate, this.challan_No, this.instrumentNo).subscribe(
        data => {
          if (data.msg == 'Success') {

            // config.panelClass = addExtraClass ? ['test'] : undefined;
            // this.snakbar.open('Received', 'Success', {
            //   duration: 3000,
            //   panelClass: ['test']
            // })
            this.toastr.success('Received', 'Success')
            this.instrumentNo = ''
            this.returnedQuan = ''
            this.tableShow = false
            this.selectedDate = ''
            this.challan_No = ''
          } else {
            // this.snakbar.open('Unexpected Error', 'Error', {
            //   duration: 3000
            // })
            this.toastr.error('Unexpected Error', 'Error')

          }
        },
        error => {
          // this.snakbar.open('Unexpected Error', 'Error', {
          //   duration: 3000
          // })
          this.toastr.error('Unexpected Error', 'Error')

        }
      )
    }

  }

}
