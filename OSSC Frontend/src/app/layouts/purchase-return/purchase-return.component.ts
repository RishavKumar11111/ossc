import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppService } from 'app/app.service';
import { ToastrService } from 'ngx-toastr';
import { SaleReturnService } from '../sale-return/sale-return.service';

@Component({
  selector: 'app-purchase-return',
  templateUrl: './purchase-return.component.html',
  styleUrls: ['./purchase-return.component.css']
})
export class PurchaseReturnComponent implements OnInit {
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
  allSaleReturnData: any;
  allSaleReturnTableShow: boolean;
  referSPO: any;
  showReferSpo: boolean;
  availableBag: number;
  totalBagsReturned = 0;
  constructor(private service: SaleReturnService, private snakbar: MatSnackBar, private spoServ: AppService, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  @ViewChild('purchaseReturnFormm') purchaseReturnFormm

  purchaseReturnForm = new FormGroup({
    returnQuan: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    challan_No: new FormControl('', Validators.required)
  })



  onSubmit() {
    let clearData
    this.saleReturnData = clearData
    this.purchaseReturnForm.reset()
    // this.purchaseReturnFormm.resetForm()

    this.service.purchaseReturnGetDataAccInstrumentNo(this.instrumentNo, this.spoServ.spoID).subscribe(
      data => {
        if (data.noData == true) {
          // this.snakbar.open('No Data', '', {
          //   duration: 3000
          // })
          this.tableShow=false
          this.toastr.warning('The instrument number entered seems to be incorrect')
        } else if (data.referSPO) {
          this.tableShow = false
          this.referSPO = data.referSPO[0].spo_Name
          this.showReferSpo = true
        } else {
          this.saleReturnData = clearData
          this.tableShow = true
          this.referSPO=false
          this.saleReturnData = data

          let date = this.saleReturnData.date_Intake
          this.maxDate = new Date();
          this.minDate=new Date(date)
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


    this.service.getPurchaseReturnData(this.instrumentNo).subscribe(
      data => {
        this.totalBagsReturned = 0
        if (data.json().length > 0) {
          this.allSaleReturnData = data.json()
          for (let i = 0; i < this.allSaleReturnData.length; i++) {
            this.totalBagsReturned = this.totalBagsReturned + this.allSaleReturnData[i].no_of_Bag
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
    let returnedBag = 0
    for (let i = 0; i < this.allSaleReturnData.length; i++) {
      returnedBag = returnedBag + this.allSaleReturnData[i].no_of_Bag
    }

    this.availableBag = this.saleReturnData.no_of_Bag - returnedBag

    if (quant > 0 && quant <= (this.saleReturnData.no_of_Bag - returnedBag)) {
      this.errMsg = false
    } else {
      // this.buttonActivate = false
      this.errMsg = true
      this.purchaseReturnForm.controls['returnQuan'].reset();
    }
  }

  finalSubmit() {
    if (confirm('Are you sure to receive ?')) {
      this.service.finalPurchaseReturnSubmit(this.saleReturnData, this.returnedQuan, this.selectedDate, this.challan_No, this.instrumentNo).subscribe(
        data => {
          if (data.json().msg == 'Success') {

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
            this.purchaseReturnForm.reset()
          } else {
            // this.snakbar.open('Unexpected Error', 'Error', {
            //   duration: 3000
            // })
            this.toastr.error('Unexpected Error', 'Error')
            this.purchaseReturnForm.reset()

          }
        },
        error => {
          // this.snakbar.open('Unexpected Error', 'Error', {
          //   duration: 3000
          // })
          this.toastr.error('Unexpected Error', 'Error')
          this.purchaseReturnForm.reset()

        }
      )
    }

  }


}
