import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class SaleReturnService {

  constructor(private http:Http,private httpClient:HttpClient) { }

  getDataAccInstrumentNo(instrumentNo,spoId):Observable<any>{
    let data={instrumentNo:instrumentNo,
      spoId:spoId
    }
    return this.httpClient.post(`${environment.port}/getSellData/sellData`,data)
  }

  finalSellReturnSubmit(saleData,rtrnQnt,date,challan_No,instrumentNo):Observable<any>{
    saleData.returnedQuan=parseInt(rtrnQnt)
    saleData.date_Intake=date
    saleData.challan_Number=challan_No
    saleData.pr_Number=instrumentNo
     return this.httpClient.post(`${environment.port}/getSellData/sellReturnSubmit`,saleData)
  }


  getSaleReturnData(instrumentNo){
    let data={
      instrumentNo:instrumentNo
    }
    return this.http.get(`${environment.port}/getSellData/getSaleReturnData`,{params:{authenticationType:'application/json',resbody:data}});
  }


  purchaseReturnGetDataAccInstrumentNo(instrumentNo,spoId):Observable<any>{
    let data={instrumentNo:instrumentNo,
      spoId:spoId
    }
    return this.httpClient.post(`${environment.port}/getSellData/sellDataForPurchaseReturn`,data)
  }


  finalPurchaseReturnSubmit(saleData,rtrnQnt,date,challan_No,instrumentNo):Observable<any>{
    saleData.returnedQuan=parseInt(rtrnQnt)
    saleData.date_return=date
    saleData.challan_Number=challan_No
    saleData.pr_Number=instrumentNo
     return this.httpClient.post(`${environment.port}/getSellData/purchaseReturnSubmit`,saleData)
  }

  getPurchaseReturnData(instrumentNo){
    let data={
      instrumentNo:instrumentNo
    }
    return this.http.get(`${environment.port}/getSellData/getPurchaseReturnData`,{params:{authenticationType:'application/json',resbody:data}});
  }

}
