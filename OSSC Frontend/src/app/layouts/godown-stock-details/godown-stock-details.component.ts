import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppService } from 'app/app.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { GodownStockService } from './godown-stock.service';


@Component({
  selector: 'app-godown-stock-details',
  templateUrl: './godown-stock-details.component.html',
  styleUrls: ['./godown-stock-details.component.css']
})
export class GodownStockDetailsComponent implements OnInit {

  constructor(public stockService: GodownStockService, private appService: AppService, private snakbar: MatSnackBar, private spinner: NgxSpinnerService) {
    stockService.getAllGodowns(this.spoId).subscribe(
      data => {
        this.godowns = data;
      }
    )
  }

  ngOnInit(): void {
  }

  spoId = this.appService.spoID
  //= [{ "id": "g1", "name": "Godown 1" }, { "id": "g2", "name": "Godown 2" }, { "id": "g3", "name": "Godown 3" }, { "id": "g4", "name": "Godown 4" }];
  godowns
  selected;
  cropSelect;
  showChkBox = false;
  tableShow = false;
  godownStockDetails;
  cropSelectedData = [];
  stockDispatchedData;
  stockAvailablePerLotData;
  tbodyForReceived = false;
  tbodyForDispatched = false;
  tbodyForTotal = false;
  allStocksForCrop;
  stocksForVariety;
  varietySelect;
  stocksForClass;
  selectedClass;
  selectedCircle;
  cropSelectAllOption = false;
  cropSelectAllData = false;
  varietySelectAllData = false;
  classSelectAllDataa = false;
  selectAll = "All";
  AllCircle = "All";
  InterCircle = 'Inter Circle';
  IntraCircle = "Intra Circle"
  godownName
  searchLot
  p: number = 1
  clearData: any;


  // New received
  cropSelectall;
  varietySelectall;
  classSelectall;


  allCrops(godownName) {
    

    this.godownName = godownName
    $('input[type=checkbox]').prop('checked', false);
    this.tbodyForReceived = false
    this.tbodyForDispatched = false
    this.tbodyForTotal = false
    this.stockService.allStock(this.selected).subscribe(
      data => {
        this.allStocksForCrop = data;
        

      }
    )
  }

  cropSelected(cropSelect) {
    

    this.selectedCircle = 'All'
    this.selectedClass = 'All'
    this.varietySelect = 'All'

    $('input[type=checkbox]').prop('checked', false);
    this.tbodyForReceived = false
    this.tbodyForDispatched = false
    this.tbodyForTotal = false
    this.cropSelectAllOption = false;
    var data = {
      croptype: cropSelect,
      godowntype: this.selected
    }

    this.stockService.stockAccoToCrop(data).subscribe(
      dataa => {
        this.stocksForVariety = dataa;
        //console.log(this.stocksForVariety);
        

      }
    );
  }

  cropSelectAll() {
    
    // received new
    //this.cropSelectall = 'All';
    this.selectedClass = "All"
    this.selectedCircle = 'All'
    this.varietySelect = 'All'
    this.cropSelectAllOption = true;
    this.cropSelectAllData = true;

    $('input[type=checkbox]').prop('checked', false);
    this.tbodyForReceived = false
    this.tbodyForDispatched = false
    this.tbodyForTotal = false
    this.stockService.stockAccCropSlctAll(this.selected).subscribe(
      data => {
        this.stocksForClass = data;
        

      }
    )
  }

  varietyClassSelectAll() {

    
    // new received
    //this.varietySelectall = 'All';

    $('input[type=checkbox]').prop('checked', false);
    this.tbodyForReceived = false
    this.tbodyForDispatched = false
    this.tbodyForTotal = false
    this.varietySelectAllData = true;
    this.stockService.dataAccVarietySelectAll(this.selected, this.cropSelect).subscribe(
      data => {
        //console.log(data);

        
        this.stocksForClass = data;
      }
    )
  }

  varietySelected(varietySelect) {
    

    $('input[type=checkbox]').prop('checked', false);
    this.tbodyForReceived = false
    this.tbodyForDispatched = false
    this.tbodyForTotal = false
    var godownId = this.selected
    var cropType = this.cropSelect
    this.stockService.stockAccoToVariety(godownId, cropType, varietySelect).subscribe(
      data => {

        
        this.stocksForClass = data;
        //console.log(this.stocksForClass);

      }
    )
  }

  classSelectAllData() {
    // new received
    //this.classSelectall = 'All'
    $('input[type=checkbox]').prop('checked', false);
    this.tbodyForReceived = false
    this.tbodyForDispatched = false
    this.tbodyForTotal = false
    this.classSelectAllDataa = true;
  }


  //------------------------------------- Received Seed data of received stock chechbox start------------------------------------------------
  receivedStock(ev) {
    

    this.godownStockDetails = this.clearData
    $(document).on('click', 'input[type="checkbox"]', function () {
      $('input[type="checkbox"]').not(this).prop('checked', false);
    });
    this.tbodyForDispatched = false
    this.tbodyForTotal = false
    if (this.tbodyForReceived == false) {
      this.tbodyForReceived = true;
    } else {
      this.tbodyForReceived = false;
    }

    if (ev == 'true') {
      let dataForRcv = {
        godownId: this.selected,
        cropSelectAllType: this.cropSelectall,
        varietySelectAllType: this.varietySelectall,
        classSelectAllType: this.classSelectall,
        cropType: this.cropSelect,
        varietyType: this.varietySelect,
        classType: this.selectedClass,
        selectedCircle: this.selectedCircle
      }
      this.stockService.receivedStockDetail(dataForRcv).subscribe(
        data => {
          
          if (data.error) {
            this.snakbar.open('Unexpected Error', 'error', {
              duration: 3000,
              horizontalPosition: "right",
              verticalPosition: "top"
            })
          } else {
            
            this.godownStockDetails = data;
          }
        }
      )
    } else {
      

    }

  }

  stockDispatched(ev) {
    
    this.stockDispatchedData = this.clearData
    this.tbodyForTotal = false
    this.tbodyForReceived = false

    $(document).on('click', 'input[type="checkbox"]', function () {
      $('input[type="checkbox"]').not(this).prop('checked', false);
    });

    if (this.tbodyForDispatched == false) {
      this.tbodyForDispatched = true;
    } else {
      this.tbodyForDispatched = false;
    }

    if (ev == 'true') {
      let dataForDisp = {
        godownId: this.selected,
        cropSelectAllType: this.cropSelectall,
        varietySelectAllType: this.varietySelectall,
        classSelectAllType: this.classSelectall,
        cropType: this.cropSelect,
        varietyType: this.varietySelect,
        classType: this.selectedClass,
        selectedCircle: this.selectedCircle
      }
      this.stockService.dispatchedStockDetail(dataForDisp).subscribe(
        data => {
          if (data.error) {
            this.snakbar.open('Unexpected Error', 'error', {
              duration: 3000,
              horizontalPosition: "right",
              verticalPosition: "top"
            })
            
          } else {
            this.stockDispatchedData = data;

            
          }
        }
      )
    }

  }

  totalStockAvailable(ev) {
    

    this.stockAvailablePerLotData = this.clearData
    this.tbodyForReceived = false
    this.tbodyForDispatched = false

    $(document).on('click', 'input[type="checkbox"]', function () {
      $('input[type="checkbox"]').not(this).prop('checked', false);
    });

    if (this.tbodyForTotal == false) {
      this.tbodyForTotal = true;
    } else {
      this.tbodyForTotal = false;
    }
    if (ev == 'true') {
      let totalStock = {
        godownId: this.selected,
        cropType: this.cropSelect,
        varietyType: this.varietySelect,
        classType: this.selectedClass,
        selectedCircle: this.selectedCircle
      }
      this.stockService.totalStockDetail(totalStock).subscribe(
        data => {

          if (data.error) {
            this.snakbar.open("Unexpected Error", 'error', {
              duration: 3000,
              horizontalPosition: "right",
              verticalPosition: "top"
            })
            
          } else {
            this.stockAvailablePerLotData = data;

            
          }
        }
      )
    }

  }


  showCheckBox() {
    this.showChkBox = true;
    this.godownStockDetails = [];
    this.stockDispatchedData = [];
  }

  tableShowHide() {
    this.tableShow = true;
  }

  sortByYearReceived() {
    this.godownStockDetails = this.godownStockDetails.sort((a, b) => a.year - b.year);
    //console.log(this.godownStockDetails);

  }

  sortByYearDispatched() {
    this.stockDispatchedData = this.stockDispatchedData.sort((a, b) => a.year - b.year);
  }


}
