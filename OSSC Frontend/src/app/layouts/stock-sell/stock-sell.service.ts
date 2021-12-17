import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockSellService {

  constructor(private http: Http, private httpClient: HttpClient) { }

  getLotAccSPO(spoId): Observable<any> {
    return this.httpClient.get(`${environment.port}/stockSell/getLotAccSPO/` + spoId)
  }

  getDataAccLot(lotNumber, spoId): Observable<any> {
    let data = {
      lotNumber: lotNumber,
      spoId: spoId
    }
    return this.http.get(`${environment.port}/stockSell/getDataAccLot`, { params: { authenticationType: 'application/json', data: data } })
  }

  finalSubmit(submittedData, lotSelectedData): Observable<any> {
    let data = {
      submittedData: submittedData,
      lotSelectedData: lotSelectedData
    }
    return this.httpClient.post(`${environment.port}/stockSell/finalSubmit`, data)
  }


  // getAvailableBags(lotDetails){
  //   return this.http.get(`${environment.port}/stockSell/getAvailableBags`,{params:{authenticationType:'application/json',data:lotDetails}})
  // }
}
