import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppService } from 'app/app.service';
import { ToastrService } from 'ngx-toastr';
import { StockForReceiptService } from './stock-for-receipt.service';

@Component({
  selector: 'app-stock-for-receipt',
  templateUrl: './stock-for-receipt.component.html',
  styleUrls: ['./stock-for-receipt.component.css']
})
export class StockForReceiptComponent implements OnInit {
  ref_No: any;
  showCard = false;
  spoCode = this.appService.spoID
  showCardData1
  transitDataForReceive
  dataToUpdate
  showCardData = false
  progBar = true
  noDataShow = false
  noData
  indexForStack
  bagSize
  bagSizeError = false;


  constructor(private stockReceiptServ: StockForReceiptService, private appService: AppService, private snackBar: MatSnackBar, private toastr: ToastrService) {
    this.transitDataReceive();
  }

  ngOnInit(): void {
  }


  transitDataReceive() {
    this.showCard = true
    this.stockReceiptServ.transitDataForReceive(this.spoCode).subscribe(
      data => {
        if (data.message == 'No Data') {
          this.noData = data.message
          this.progBar = false
          this.showCardData1 = false
          this.noDataShow = true
        } else {
          this.progBar = false
          this.showCardData1 = true
          this.transitDataForReceive = data
        }

      }
    )
  }

  bagsEnteredOnPopup(enteredNo) {

    if (0 > enteredNo || 0 == enteredNo || enteredNo > this.transitDataForReceive[this.indexForStack].no_of_Bag) {
      let x
      this.bagSize = x
      this.bagSizeError = true
    } else {
      this.bagSizeError = false
    }
  }


  receiveAction(rcvBagNo, remark) {
    let dataRcv = this.transitDataForReceive[this.indexForStack]
    //if (confirm('Are you sure to receive')) {
    this.dataToUpdate = {
      lot_No: dataRcv.lot_Number,
      receiverId: dataRcv.receiver_ID,
      bagsToBeReceived: rcvBagNo,
      status: dataRcv.transitStatus,
      // stackName: stackName,
      remark: remark,
      ref_No: this.ref_No
    }

    this.stockReceiptServ.receiveSeed(this.dataToUpdate).subscribe(
      dataa => {
        if (dataa.status == 1) {
          this.toastr.success('Received', 'Success')

          setTimeout(() => {
            (<any>$('#exampleModal')).modal('hide')
          }, 1000);

          this.stockReceiptServ.transitDataForReceive(this.spoCode).subscribe(
            data => {
              if (data.message == 'No Data') {
                this.noData = data.message
                this.progBar = false
                this.showCardData1 = false
                this.noDataShow = true
              } else {
                this.progBar = false
                this.showCardData1 = true
                this.transitDataForReceive = data
              }

            }
          )
        } else {
          this.toastr.warning('Unsuccess', 'Error')
        }

      },
      err => {
        // this.snackBar.open('Failed to receive', 'error', {
        //   duration: 3000,
        //   horizontalPosition: "right",
        //   verticalPosition: "top"
        // })
        this.toastr.error('Failed to receive', 'error')

      }
    )
    //}

  }

  receiveModal(i, ref_No) {
    let y
    this.bagSize = y
    this.bagSizeError = false
    this.ref_No = ref_No
    this.indexForStack = i
  }

}
