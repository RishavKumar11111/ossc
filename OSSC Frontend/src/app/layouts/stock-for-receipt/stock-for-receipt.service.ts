import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockForReceiptService {

  constructor(private http:Http,private httpClient:HttpClient) { }

  transitDataForReceive(spoCode):Observable<any>{
    
    return this.httpClient.get(`${environment.port}/transit/transitDataForReceive/`+spoCode);
  }

  receiveSeed(dataToUpdate):Observable<any>{
    return this.httpClient.post(`${environment.port}/transit/updateTransitStatus`,dataToUpdate);
  }

  deficitDataFetch(spoCode):Observable<any>{
    return this.httpClient.get(`${environment.port}/transit/deficitDataFetch/`+spoCode);

  }

}
