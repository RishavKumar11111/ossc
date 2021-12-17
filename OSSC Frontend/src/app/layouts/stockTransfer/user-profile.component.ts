import { Component, OnInit, ViewChild } from "@angular/core";
import { StockTransferService } from "./stock-transfer.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AppService } from "app/app.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"],
})
export class UserProfileComponent implements OnInit {
  // After login spo code will be mapped to spoCode variable
  spoCode;

  allDistricts;
  distSelected;
  allGodowns;
  godownSelected;
  allLot;
  lotSelected;
  totalkgTrFl = false;
  totalkgTrF2 = false;
  totalKg;
  noOfBagsEntered;
  allSPOs;
  spoSelected;
  toDistricts;
  loadToGodowns;
  toGodownSelected;
  circleType;
  circleTypeShow = false;
  greaterKgValue = false;
  totalkgTrF3 = false;
  bagPerKgAtBagAvailable: any;
  printDataShow = false;
  dataForPrint: any;
  allCrop
  allVarieties
  godownId
  transferDataArray = []
  transferBagTotalItems
  godownIdForVarietyLoad
  // toTransferIntra = false

  constructor(
    private stockTrnsServ: StockTransferService,
    private appService: AppService,
    private snackBar: MatSnackBar,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {
    this.spoCode = appService.spoID;
    spinner.show()
    stockTrnsServ.getAllDistricts(this.spoCode).subscribe((data) => {
      spinner.hide()
      let obj = data.all_Spo.filter(o => o.spoCd == this.spoCode);
      this.allDistricts = obj;
    });

    stockTrnsServ.getAllSpo().subscribe((data) => {
      this.allSPOs = data;
    });
  }

  ngOnInit() {
    this.formDataForTransfer.controls["noOfBagsEntered"].reset();
    this.formDataForTransfer.controls["noOfBagsEntered"].disable();

  }

  @ViewChild("transferForm") transferForm;

  formDataForTransfer = new FormGroup({
    distSelected: new FormControl("", Validators.required),
    godownSelected: new FormControl("", Validators.required),
    lotSelected: new FormControl(""),
    noOfBagsEntered: new FormControl(),
    spoSelected: new FormControl("", Validators.required),
    toDistSelected: new FormControl("", Validators.required),
    toGodownSelected: new FormControl("", Validators.required),
    vehicleNo: new FormControl("Enter Vehicle No"),
    crop: new FormControl('', Validators.required),
    variety: new FormControl('', Validators.required),
    transferDate: new FormControl('', Validators.required)
    // intraCheck: new FormControl('', Validators.required),
    // interCheck: new FormControl('', Validators.required)
  });


  // ======================Stock transfer checkbox for To start====================================

  // toCheckForTrans() {
  //   let blnkData
  //   this.allSPOs = blnkData
  //   this.toDistricts = blnkData
  //   this.loadToGodowns = blnkData
  //   this.formDataForTransfer.setErrors({ invalid: true })

  //   if (this.formDataForTransfer.value.intraCheck == true && this.formDataForTransfer.value.interCheck == true) {
  //     this.stockTrnsServ.getAllSpo().subscribe(
  //       data => {
  //         if (this.toTransferIntra == true) {
  //           this.toTransferIntra = false
  //         } else {
  //           this.toTransferIntra = false
  //         }
  //         this.allSPOs = data;
  //       }
  //     )

  //   } else if (this.formDataForTransfer.value.intraCheck == true && this.formDataForTransfer.value.interCheck == false) {
  //     let blnkData2
  //     this.allSPOs = blnkData2
  //     this.toDistricts = blnkData2
  //     this.loadToGodowns = blnkData2
  //     this.formDataForTransfer.setErrors({ 'invalid': true })

  //     this.stockTrnsServ.getAllSpoByIntra(this.spoCode).subscribe(
  //       data => {
  //         if (this.toTransferIntra == true) {
  //           this.toTransferIntra = true;
  //         } else {
  //           this.toTransferIntra = true;
  //         }

  //         this.allSPOs = data
  //         this.formDataForTransfer.controls['spoSelected'].patchValue(this.allSPOs[0]);
  //         //  console.log(this.formDataForTransfer.value);

  //         this.loadToDist()
  //       }
  //     )
  //   } else if (this.formDataForTransfer.value.intraCheck == false && this.formDataForTransfer.value.interCheck == true) {
  //     let blnkData3
  //     this.allSPOs = blnkData3
  //     this.toDistricts = blnkData3
  //     this.loadToGodowns = blnkData3
  //     this.formDataForTransfer.setErrors({ invalid: true })

  //     this.stockTrnsServ.getAllSpoByInter(this.spoCode).subscribe(
  //       data => {
  //         if (this.toTransferIntra == true) {
  //           this.toTransferIntra = false
  //         } else {
  //           this.toTransferIntra = false
  //         }
  //         this.allSPOs = data
  //       }
  //     )
  //   } else {
  //     this.allSPOs = []
  //     this.toDistricts = []
  //     this.loadToGodowns = []
  //     this.formDataForTransfer.setErrors({ invalid: true })

  //   }

  // }
  // ======================Stock transfer checkbox for To end====================================

  loadGodown(distSelected) {
    this.spinner.show()
    this.formDataForTransfer.controls["noOfBagsEntered"].reset();
    this.formDataForTransfer.controls["godownSelected"].reset();
    this.formDataForTransfer.controls["lotSelected"].reset();
    this.formDataForTransfer.controls["crop"].reset();
    this.formDataForTransfer.controls["variety"].reset();
    this.formDataForTransfer.controls["noOfBagsEntered"].disable();

    this.totalkgTrF2 = false;
    this.totalkgTrFl = false;

    this.stockTrnsServ.getAllGodowns(distSelected).subscribe((data) => {
      this.allGodowns = data.all_Godowns;
      this.spinner.hide()
    });
  }

  loadCrop(godown) {
    this.spinner.show()
    this.formDataForTransfer.controls["noOfBagsEntered"].reset();
    this.formDataForTransfer.controls["crop"].reset();
    this.formDataForTransfer.controls["variety"].reset();
    this.formDataForTransfer.controls["lotSelected"].reset();
    this.formDataForTransfer.controls["noOfBagsEntered"].disable();

    this.totalkgTrF2 = false;
    this.totalkgTrFl = false;

    this.godownId = godown.godown_ID
    this.godownIdForVarietyLoad = godown.godown_ID
    this.stockTrnsServ.loadCrop(godown.godown_ID).subscribe(
      data => {
        if (data.length == 0) this.toastr.info('No crops available')
        this.allCrop = data
        this.spinner.hide()

      }
    )
  }

  loadVariety(cropCode) {
    this.spinner.show()
    this.formDataForTransfer.controls["noOfBagsEntered"].reset();
    this.formDataForTransfer.controls["variety"].reset();
    this.formDataForTransfer.controls["lotSelected"].reset();
    this.formDataForTransfer.controls["noOfBagsEntered"].disable();

    this.totalkgTrF2 = false;
    this.totalkgTrFl = false;

    this.stockTrnsServ.loadVariety(this.godownIdForVarietyLoad, cropCode.Crop_Code).subscribe(
      data => {
        this.allVarieties = data
        this.spinner.hide()

      }
    )
  }

  loadLot(variety) {
    this.spinner.show()
    this.formDataForTransfer.controls["noOfBagsEntered"].disable();
    this.formDataForTransfer.controls["noOfBagsEntered"].reset();
    this.formDataForTransfer.controls["lotSelected"].reset();

    this.totalkgTrF2 = false;
    this.totalkgTrFl = false;

    this.stockTrnsServ.loadLot(this.godownId, this.formDataForTransfer.value.crop, variety.Variety_Code).subscribe((data) => {
      this.allLot = data;
      if(data.length==0){
        this.toastr.warning('No Lot available')
      }
      this.spinner.hide()

    });
  }

  bagNoEntered(val) {
    if (val > this.totalKg) {
      this.formDataForTransfer.controls["noOfBagsEntered"].reset();
      this.totalkgTrF3 = true;
      this.totalkgTrF2 = false;
      this.totalkgTrFl = false;
      setTimeout(() => {
        this.totalkgTrF3 = false;
        this.totalkgTrFl = true;
      }, 2000);
    }
  }

  loadNoOfBags(variety) {
    this.spinner.show()
    this.formDataForTransfer.controls["noOfBagsEntered"].disable();
    this.formDataForTransfer.controls["noOfBagsEntered"].reset();

    this.totalkgTrF2 = false;
    this.totalkgTrFl = false;

    let obj = this.transferDataArray.filter(o => o.lotSelected.lot_Number == this.formDataForTransfer.value.lotSelected.lot_Number);

    let lotAddedBagSize = 0
    if (obj) {
      for (let i = 0; i < obj.length; i++) {
        lotAddedBagSize = lotAddedBagSize + obj[i].noOfBagsEntered
      }

    }

    var data = {
      godownId: this.formDataForTransfer.value.godownSelected.godown_ID,
      lotNo: this.formDataForTransfer.value.lotSelected.lot_Number,
      variety: variety,
      lotAddedBagSize: lotAddedBagSize
    };
    this.stockTrnsServ.loadMaxBagNo(data).subscribe((dataa) => {
      this.spinner.hide()

      this.totalkgTrFl = true;
      this.totalKg = dataa.availableBagg;
      this.bagPerKgAtBagAvailable = dataa.bagSizePerKg;
      if (this.totalKg < 1) {
        this.totalkgTrFl = false;
        this.totalkgTrF2 = true;
        this.formDataForTransfer.controls["noOfBagsEntered"].disable();
      } else {
        this.totalkgTrF2 = false;
        this.formDataForTransfer.controls["noOfBagsEntered"].enable();

      }
    });
  }

  loadToDist() {
    this.formDataForTransfer.controls["toGodownSelected"].reset();
    this.formDataForTransfer.controls["toDistSelected"].reset();

    this.toDistricts = this.formDataForTransfer.value.spoSelected.all_Spo;
  }

  loadToGodown(dist) {
    this.spinner.show()

    // ----------to get destination spo id while stock transfer start-------------------------
    // this.stockTrnsServ.getSpoId(dist).subscribe(
    //   data => {
    //     this.formDataForTransfer.controls['spoSelected'].setValue(data.toString());
    //   }
    // )
    // ----------to get destination spo id while stock transfer end-------------------------

    this.formDataForTransfer.controls["toGodownSelected"].reset();
    if (dist == this.formDataForTransfer.value.distSelected) {
      this.circleTypeShow = true;
      this.circleType = "Intra Circle Transfer";
    } else {
      this.circleTypeShow = true;
      this.circleType = "Inter Circle Transfer";
    }
    this.stockTrnsServ.loadToGodown(dist).subscribe((data) => {
      this.loadToGodowns = data.all_Godowns;
      this.spinner.hide()

    });
  }

  getTransferDataArray() {
    this.transferDataArray.push({ lotSelected: this.formDataForTransfer.value.lotSelected, noOfBagsEntered: this.formDataForTransfer.value.noOfBagsEntered })
    this.transferBagTotalItems = this.transferDataArray.length
    // this.transferForm.resetForm();
    this.toastr.success('Added')
    this.loadNoOfBags(this.formDataForTransfer.value.lotSelected.variety)
    this.formDataForTransfer.patchValue({
      noOfBagsEntered: 0
    })

  }

  deleteFromTransArray(i) {
    this.transferDataArray.splice(i)
    this.transferBagTotalItems = this.transferDataArray.length
    this.loadNoOfBags(this.formDataForTransfer.value.lotSelected.variety)
  }

  // onSubmit() {
  //   if (confirm("Are you sure for transfer ?")) {
  //     this.totalkgTrFl = false;
  //     this.greaterKgValue = false;
  //     this.stockTrnsServ
  //       .formTransferData(this.formDataForTransfer.value, this.spoCode)
  //       .subscribe(
  //         (result) => {
  //           if (result.status == 200 || result.status == 1) {
  //             this.toastr.success(
  //               "Transferred Sucessfully",
  //               "Go to transit status"
  //             );
  //             this.transferForm.resetForm();
  //             this.printDataShow = true;
  //             this.dataForPrint = result.dataForPrint;
  //             // console.log(this.dataForPrint);

  //             setTimeout(() => {
  //               this.print();
  //             }, 2000);
  //           } else if (result.status == "seedExpired") {
  //             this.toastr.warning("This lot has been expired", "Lot Expired");
  //             this.transferForm.resetForm();
  //           }
  //         },
  //         (error) => {
  //           this.toastr.error("Failed to transfer", "Error");
  //         }
  //       );
  //     //}
  //   }
  // }

  onSubmit() {
    if (confirm("Are you sure for transfer ?")) {
      this.spinner.show()

      this.totalkgTrFl = false;
      this.greaterKgValue = false;
      this.stockTrnsServ
        .formTransferData(this.transferDataArray, this.formDataForTransfer.value, this.spoCode)
        .subscribe(
          (result) => {
            if (result.status == 200 || result.status > 0) {
              this.toastr.success(
                "Transferred Sucessfully",
                "Go to transit status"
              );
              this.transferForm.resetForm();
              this.transferBagTotalItems = 0
              this.printDataShow = true;
              this.dataForPrint = result.dataForPrint;
              this.transferDataArray = []
              this.formDataForTransfer.controls["noOfBagsEntered"].disable();
              // console.log(this.dataForPrint);
              this.spinner.hide()

              setTimeout(() => {
                this.print();
              }, 2000);
            } else if (result.status == "seedExpired") {
              this.toastr.warning("This lot has been expired", "Lot Expired");
              this.spinner.hide()
              this.transferForm.resetForm();
            }
          },
          (error) => {
            this.spinner.hide()
            this.formDataForTransfer.controls["noOfBagsEntered"].disable();
            this.toastr.error("Failed to transfer", "Error");
          }
        );
      //}
    }
  }

  print() {
    let pageData = document.getElementById("printTable").innerHTML;
    var printWindow = window.open("", "", "");
    printWindow.document.write("<html><head>");
    printWindow.document.write(
      '<style type="text/css">body {margin: 0;font-family: tahoma;font-size: 14px;background-color: #ccc;}@page{size: auto;margin: 0;}.rightContent{text-align: center;}.maintbl tr td {border: 1px solid #ccc;border-collapse: collapse;padding: 6px 5px;border-top: none;border-bottom: none;text-align: center;border-bottom: 1px solid black;}.topHeadDiv{margin-left: 50%;text-align: center;}.innerTable{margin: 50px 20px;background: white;}.footerContent{border-right: 2px solid;}.maintbl tbody tr {height: 322px;}.maintbl th {border: 1px solid #ccc;line-height: 27px;}.wrapper {background: #fff  no-repeat;margin: 0 auto;width: 800px;padding: 50px 40px;}.content {color: #000;line-height: 25px;font-size: 16px;}.sub-heading {font-size: 18px;font-weight: 300;}.clearfix {clear: both;}</style>'
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

}
