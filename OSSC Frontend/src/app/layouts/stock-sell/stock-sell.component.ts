import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AppService } from 'app/app.service';
import { data } from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { StockSellService } from './stock-sell.service';
import { DateAdapter } from '@angular/material/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-stock-sell',
  templateUrl: './stock-sell.component.html',
  styleUrls: ['./stock-sell.component.css']
})
export class StockSellComponent implements OnInit {


  lotNumbers
  selectedLotDetails
  showCardData1 = false
  bagsAvailable: any;
  lotDetails: any;
  errMsg = false;
  maxDate: Date;
  minDate: Date;
  sellInputShow = false;
  printDataShow = false;
  dataForPrint=[]


  @ViewChild('formForSale') formForSale;

  constructor(private loader: NgxSpinnerService, private dateAdapter: DateAdapter<Date>, private service: StockSellService, private rootServ: AppService, private toastr: ToastrService) {
    this.loader.show()
    service.getLotAccSPO(rootServ.spoID).subscribe(
      data => {
        this.lotNumbers = data
        this.loader.hide()
      }
    )
    this.dateAdapter.setLocale('en-GB');//dd/mm/yy
  }

  ngOnInit(): void {
  }

  formDataForSale = new FormGroup({
    toWhomSale: new FormControl('', Validators.required),
    idNumber: new FormControl('', Validators.required),
    idType: new FormControl('', Validators.required),
    NameOfParty: new FormControl('', Validators.required),
    lotNumber: new FormControl('', Validators.required),
    qtySold: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    perQuintalPrice:new FormControl('',Validators.required),
    duNoForChallan:new FormControl('',Validators.required),
    addressOfParty:new FormControl('',Validators.required),
    remarkForChallan:new FormControl('',Validators.required)
  })


  toWhomSale = [{ name: 'Farmer' }, { name: "Agency" }]
  idTypes = ['Aadhar Card', "PAN Card", 'Voter ID', 'Farmer ID']

  showLotDetails() {
    // this.selectedLotDetails=lotDetails
    
    this.sellInputShow = false
    this.service.getDataAccLot(this.formDataForSale.value.lotNumber, this.rootServ.spoID).subscribe(
      data => {
        if (data.json().status == 'seedExpired') {
          this.toastr.warning('Seed has expired')
          this.showCardData1 = false

        } else {
          this.showCardData1 = true
          this.lotDetails = data.json()
          // console.log(data);
        }
      },
      error => {
        this.toastr.error("Unexpected Error", 'Error')
      }
    )
  }

  sellButtonClick(lotDetail) {
    this.selectedLotDetails = lotDetail

    this.sellInputShow = true

    // let date = this.selectedLotDetails.date_Intake.split("-")
    this.maxDate = new Date();
    this.minDate=this.selectedLotDetails.date_Intake
    // if (date.length > 0) {
    //   let d = date[0];
    //   let m = parseInt(date[1]) - 1;
    //   let y = date[2];
    //   if (parseInt(d) > 0) {
    //     this.minDate = new Date(y, m, d);
    //   }
    // }

  }

  quanCheck(quant) {
    if (quant > 0 && quant <= this.selectedLotDetails.availableBags) {
      this.errMsg = false

    } else {
      // this.buttonActivate = false
      this.formDataForSale.controls['qtySold'].reset();
      this.errMsg = true
    }
  }

  onSubmit() {
    if (confirm('Are you sure you want to sale ?')) {
      this.dataForPrint=[]
      this.service.finalSubmit(this.formDataForSale.value, this.selectedLotDetails).subscribe(
        data => {
          if (data.status == 'success') {
            this.toastr.success("Product Sold", "Success")
            this.formForSale.resetForm()
            this.sellInputShow = false
            this.showCardData1 = false
            this.printDataShow = true;
            console.log(5555,data.response);
            this.dataForPrint.push(data.response)
            setTimeout(() => {
              this.print();
            }, 2000);
            
          }
          if (data.status == 'Unsuccessful') {
            this.toastr.warning('Unable to sale', 'Failed')
          }
        },
        error => {
          this.toastr.warning('Unexpected Error', "Error")
        }
      )
    }
  }

  print() {
    let pageData = document.getElementById("printTable").innerHTML;
    var printWindow = window.open("", "", "");
    printWindow.document.write("<html><head>");
    printWindow.document.write(
      '<style type="text/css">body {margin: 25px;font-family: tahoma;font-size: 14px;background-color: white;}@page{size: auto;margin: 0;}.rightContent{text-align: center;}.maintbl tr td {border: 1px solid #ccc;border-collapse: collapse;padding: 6px 5px;border-top: none;border-bottom: none;text-align: center;border-bottom: 1px solid black;}.topHeadDiv{margin-left: 50%;text-align: center;}.innerTable{width: 100%;background: white;}.footerContent{border-right: 2px solid;}.maintbl tbody tr {height: 322px;}.maintbl th {border: 1px solid #ccc;line-height: 27px;}.wrapper {background: #fff  no-repeat;margin: 0 auto;width: 800px;padding: 50px 40px;}.content {color: #000;line-height: 25px;font-size: 16px;}.sub-heading {text-align: center;font-size: 18px;font-weight: 300;}.bottom .footer{text-align:center;margin-top: 38px;}.head p{text-align: center;margin:0}.mainHead{font-weight: bold;font-size: xx-large;}.subHead{font-weight: 700;}.head .phNo{float:left;margin-left: 14px;margin-top:14px}.head .gstNo{float:right;margin-right: 14px;margin-top:14px}.clearfix {clear: both;}</style>'
    );
    printWindow.document.write("</head><body >");
    printWindow.document.write(pageData);
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    setTimeout(function () {
      printWindow.print();
    }, 200);
    return false;
  }

  // getAvailableBags(lotDetails){
  //   this.service.getAvailableBags(lotDetails).subscribe(
  //     data => {
  //       this.bagsAvailable = data.availableBags
  //     }
  //   )
  // }

}
