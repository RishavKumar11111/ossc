import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'app/app.service';
import { LoginServiceService } from 'app/auth/user-login/login-service.service';
import { ToastrService } from 'ngx-toastr';
import { StockTransferService } from '../stockTransfer/stock-transfer.service';
import { GroupNamePipe } from './group-name.pipe';
import { StockInwardService } from './stock-inward.service';

@Component({
  selector: 'app-stock-inward',
  templateUrl: './stock-inward.component.html',
  styleUrls: ['./stock-inward.component.css']
})
export class StockInwardComponent implements OnInit {

  allSPOs
  selected
  selectedDist
  allDistricts: any;
  distData: any;
  tableShow = false
  searchLot
  allDataForReport;
  p: number = 1
  zoneName: any;
  date: Date;
  fullDate: any;
  rcvZoneName: any;
  searchBtnDsbld = true
  userRole
  disableSpoDrpdn = false
  spoCode


  constructor(private stockTrnsServ: StockTransferService, private appService: AppService, private loginServ: LoginServiceService, private service: StockInwardService, private router: Router, private toastr: ToastrService, private groupNamePipe: GroupNamePipe) {
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

  loadDistricts(spoData) {
    this.searchBtnDsbld = true
    this.zoneName = spoData.spo_Name
    this.allDistricts = spoData.all_Spo
  }

  loadDistrictsForSpo() {
    this.searchBtnDsbld = true
    this.stockTrnsServ.getAllDistricts(this.spoCode).subscribe(
      data => {
        this.allDistricts = data.all_Spo;
      });
  }

  getDistData(dist) {
    this.searchBtnDsbld = false
    this.distData = dist
  }

  loadAllData() {
    let x
    this.allDataForReport = x;
    this.tableShow = true

    this.service.loadAllData(this.allDistricts, this.distData).subscribe(
      data => {
        if (data) {
          this.rcvZoneName = this.zoneName
          this.allDataForReport = data
          this.tableShow = true

        }
      },
      error => {
        this.toastr.error('Unexpected Error', "Error")
      }
    )
  }

  navToReturnedSale(data) {
    // this.router.navigate(['/report','/returned-after-sale'])
    this.router.navigateByUrl('user/report/returned-after-purchase?instrumentNo=' + data)
  }

  deletePurchaseData(saleDataDelete) {
    if (confirm('Are you sure you want to delete ?')) {
      this.service.deletePurchaseData(saleDataDelete).subscribe(
        data => {
          if (data.status == 1) {
            this.toastr.success('Deleted', "Success")
            this.loadAllData()
          } else if (data.status == 'not applicable') {
            this.toastr.warning('Not Applicable', "Warning")

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
        "Lot Number": this.allDataForReport[i].doc.lot_Number,
        'Source Zonal Office': this.allDataForReport[i].sourceZone,
        'Source Godown Name': this.allDataForReport[i].doc.sourceGodownName,
        'Party Name': this.allDataForReport[i].doc.farmerName || this.allDataForReport[i].doc.agencyName,
        'Instrument No': this.allDataForReport[i].doc.pr_Number,
        'Instrument Date': this.allDataForReport[i].doc.prInstrumentDate,
        'Group': this.groupNamePipe.transform(this.allDataForReport[i].doc.CropCatg_ID),
        'Crop': this.allDataForReport[i].doc.cropName,
        'Variety': this.allDataForReport[i].doc.varietyName,
        'Class': this.allDataForReport[i].doc.class,
        'Qty. Dispateched': this.allDataForReport[i].QuantDispatched ? this.allDataForReport[i].QuantDispatched : 0,
        'Qty. Received': this.allDataForReport[i].QuantDispatched - (this.allDataForReport[i].QuantReturned ? this.allDataForReport[i].QuantReturned : 0),
        "Purchase Return": this.allDataForReport[i].QuantReturned ? this.allDataForReport[i].QuantReturned : 0,
        "Kg Per Bag": this.allDataForReport[i].doc.qty_Per_Bag_Kg,
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
