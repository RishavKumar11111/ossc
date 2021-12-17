import { Component, OnInit } from '@angular/core';
import { AppService } from 'app/app.service';
import { StockForReceiptService } from '../stock-for-receipt/stock-for-receipt.service';

@Component({
  selector: 'app-stock-deficit',
  templateUrl: './stock-deficit.component.html',
  styleUrls: ['./stock-deficit.component.css']
})
export class StockDeficitComponent implements OnInit {


  deficitData
  spoCode = this.appService.spoID
  noDataShow = false
  noData
  progBar = true
  showCardData1
  showCard = false;


  constructor(private appService:AppService,private stockReceiptServ:StockForReceiptService) { }

  ngOnInit(): void {
    this.deficitDataFetch()
  }

  deficitDataFetch() {
    this.showCard = true
    this.stockReceiptServ.deficitDataFetch(this.spoCode).subscribe(
      data => {
        if (data.message == 'No Data') {
          this.noData = data.message
          this.progBar = false
          this.showCardData1 = false
          this.noDataShow = true
        } else {
          this.progBar = false
          this.showCardData1 = true
          this.deficitData = data
        }

      }
    )
  }

}
