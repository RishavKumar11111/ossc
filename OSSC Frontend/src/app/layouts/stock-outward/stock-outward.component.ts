import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'app/app.service';
import { LoginServiceService } from 'app/auth/user-login/login-service.service';
import { ToastrService } from 'ngx-toastr';
import { StockTransferService } from '../stockTransfer/stock-transfer.service';
import { StockOutwardService } from './stock-outward.service';

@Component({
  selector: 'app-stock-outward',
  templateUrl: './stock-outward.component.html',
  styleUrls: ['./stock-outward.component.css']
})
export class StockOutwardComponent implements OnInit {

  allSPOs
  selected
  selectedDist
  allDistricts: any;
  distData: any;
  tableShow = false
  searchLot
  allDataForReport: any;
  p: number = 1
  zoneName: any;
  date: Date;
  fullDate: any;
  rcvZoneName: any;
  searchBtnDsbld = true
  userRole
  disableSpoDrpdn = false
  spoCode

  constructor(private stockTrnsServ: StockTransferService, private appService: AppService, private loginServ: LoginServiceService,private service: StockOutwardService, private router: Router, private toastr: ToastrService) {
    let token = localStorage.getItem('token')
    loginServ.roleBasedLoginSidebar(token).subscribe(
      data => {
        this.userRole = data.role
        if (this.userRole == 'admin') {
          this.loadSpoForAdmin()
          this.disableSpoDrpdn = false
        }
        if (this.userRole == 'spo') {
          this.disableSpoDrpdn = true
          this.spoCode = appService.spoID
          this.loadDistrictsForSpo()
        }
      },
      error => {
        this.toastr.error('Unexpected Error')

      }
    )
  }

  ngOnInit(): void {
  }

  loadSpoForAdmin() {
    this.service.getAllSpo().subscribe(
      data => {
        this.allSPOs = data

      }
    )
  }

  loadDistrictsForSpo() {
    this.searchBtnDsbld = true
    this.stockTrnsServ.getAllDistricts(this.spoCode).subscribe(
      data => {
        this.allDistricts = data.all_Spo;
      });
  }

  loadDistricts(spoData) {
    this.searchBtnDsbld = true
    this.zoneName = spoData.spo_Name
    this.allDistricts = spoData.all_Spo
  }

  getDistData(dist) {
    this.searchBtnDsbld = false
    this.distData = dist
  }

  loadAllData() {
    let clearData: any
    this.tableShow = true
    this.allDataForReport = clearData

    this.service.loadAllData(this.allDistricts, this.distData).subscribe(
      data => {
        if (data.json()) {
          this.rcvZoneName = this.zoneName
          this.allDataForReport = data.json()
          this.tableShow = true

        }


      }
    )
  }

  navToReturnedSale(data) {
    // this.router.navigate(['/report','/returned-after-sale'])
    this.router.navigateByUrl('user/report/returned-after-sale?instrumentNo=' + data)
  }



  deleteSaleData(saleDataDelete) {
    if (confirm('Are you sure you want to delete ?')) {
      this.service.deleteSaleData(saleDataDelete).subscribe(
        data => {
          if (data.status == 1) {
            this.toastr.success('Deleted', "Success")
            this.loadAllData()
          } else {
            this.toastr.error('Deletion Unsuccessful', 'Error')
          }

        },
        error => {
          this.toastr.error('Deletion Unsuccessful', 'Unexpected Error')
        }
      )
    }


  }




  exportAsXLSX() {
    let dataa = []
    for (let i = 0; i < this.allDataForReport.length; i++) {
      let x = {
        'SL. No': i + 1,
        'Date Of Receipt': this.allDataForReport[i].doc.date_Intake,
        'Zonal Office': this.zoneName,
        'Godown Name': this.allDataForReport[i].doc.destinGodownName,
        'Source Zonal Office': this.allDataForReport[i].sourceZone,
        'Source Godown Name': this.allDataForReport[i].doc.sourceGodownName,
        'Party Name': 'Party Name',
        'Instrument No': this.allDataForReport[i].doc.pr_Number,
        'Instrument Date': 'Instrument Date',
        'Group': this.allDataForReport[i].doc.CropCatg_ID,
        'Crop': this.allDataForReport[i].doc.crop,
        'Variety': this.allDataForReport[i].doc.variety,
        'Class': this.allDataForReport[i].doc.class,
        'Qty. Received': this.allDataForReport[i].QuantReceived,
        'Qty. Dispateched': this.allDataForReport[i].QuantDisp,
        'Circle': this.allDataForReport[i].circle,
        'Source Type': this.allDataForReport[i].doc.SourceType
      }
      dataa.push(x)

    }
    if (dataa.length == this.allDataForReport.length) {
      this.service.exportAsExcelFile(dataa, 'stockInward');

    }

  }

  printTable(data) {
    this.date = new Date()
    this.fullDate = this.date.getDate() + '/' + this.date.getMonth() + '/' + this.date.getFullYear()
    console.log(this.fullDate);

    var html = document.getElementById(data).innerHTML;
    var head = document.getElementById('headPrint').innerHTML;
    var printWin = window.open('', 'Print', 'height=400,width=600');
    printWin.document.write('<html><head><title>OSSC</title><meta name="username" content="print">');
    printWin.document.write('<link href="./receipt.component.css">');
    printWin.document.write('</head><body >');
    printWin.document.write(head);
    printWin.document.write(html);
    printWin.document.write('</body></html>');
    printWin.document.close();
    setTimeout(() => {
      printWin.focus();
      printWin.print();
      printWin.close();
    }, 1000);
  }

}
