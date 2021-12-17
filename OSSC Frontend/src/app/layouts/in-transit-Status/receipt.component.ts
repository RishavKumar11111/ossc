import { Component, OnInit, ViewChild } from '@angular/core';
import { TransitStatusService } from './transit-status.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { quantity } from 'chartist';
import { AppService } from 'app/app.service';
import * as html2pdf from 'html2pdf-fix-jspdf'
import { StockTransferService } from '../stockTransfer/stock-transfer.service';


@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.css']
})
export class ReceiptComponent implements OnInit {

  constructor(private transitServ: TransitStatusService, private appService: AppService, private stockTrnsServ: StockTransferService) {

  }

  ngOnInit(): void {
    this.transitDataDispatch();
  }
  spoCode = this.appService.spoID
  showCard = false;
  showCardData = false
  transitData;
  transitDataForm;
  showCardData1
  transitDataForReceive
  dataToUpdate
  date
  progBar = true
  noDataShow = false
  noData
  printData = true
  headPrintShow = false

  // // Below is for mat table
  //   listData: MatTableDataSource<any>
  //   displayedColumn: string[] = ['Year', 'Season', 'crop', 'variety', 'class', 'lot_Number', 'sourceGodownName', 'receiverGodownName', 'stockTrnsDate', 'no_of_Bag', 'qty_Per_Bag_Kg',
  //     'pr_Number', 'transitStatus'];
  //     @ViewChild(MatSort) sort:MatSort

  data = []
  transitDataDispatch() {
    this.showCard = true
    this.transitServ.transitDataForDispatch(this.spoCode).subscribe(
      data => {
        if (data.message == 'No Data') {
          this.noData = data.message;
          this.noDataShow = true
          this.progBar = false
        } else {
          this.progBar = false
          this.showCardData = true
          this.transitData = data;

          this.data = this.transitData
          // // For mat table
          // this.listData = new MatTableDataSource(this.transitData)
          // this.listData.sort=this.sort

        }
      }
    )

  }

  exportAsXLSX(): void {
    //let xlsxData=[{'Lot No':'33333',"class":"c1","certify status":"pass"}]
    this.transitServ.exportAsExcelFile(this.data, 'inTransitData');
  }

  printAction(data) {

    // var htmlData = document.getElementById('headPrint').innerHTML;
    // htmlData += document.getElementById('printData').innerHTML
    // var opt = {
    //   margin: 1,
    //   filename: 'myfile.pdf',
    //   image: { type: 'jpeg', quality: 0.98 },
    //   html2canvas: { scale: 2 },
    //   jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    // };
    // html2pdf().from(htmlData).set(opt).save();

    //this.printData=false;
    var html = document.getElementById(data).innerHTML;
    var head = document.getElementById('headPrint').innerHTML;
    // html += document.getElementById(data).innerHTML;

    // html += "</html>";

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
  back() {
    this.printData = true
  }


  printDataShow = false;
  dataForPrint: any;
  manualPrint(commonChallanNo: any) {
    this.stockTrnsServ.manualPrint(commonChallanNo).subscribe(
      data => {
        this.printDataShow = true;
        this.dataForPrint = data;
        setTimeout(() => {
          this.print();
        }, 2000);
      }
    )
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
