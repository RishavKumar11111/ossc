import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GodownStockService {

  constructor(private http: Http,private httpClient:HttpClient) { }

  getAllGodowns(spoId):Observable<any> {
    return this.httpClient.get(`${environment.port}/godownStock/loadGodown/` + spoId);
  }

  allStock(id):Observable<any> {
    return this.httpClient.get(`${environment.port}/godownStock/allStockForSeed/` + id);
  }

  stockAccoToCrop(data):Observable<any> {
    return this.httpClient.get(`${environment.port}/godownStock/allStockForVariety/` + data.croptype + "/" + data.godowntype);
  }

  stockAccCropSlctAll(gId):Observable<any> {
    return this.httpClient.get(`${environment.port}/godownStock/classOfCropSelectAll/` + gId)
  }

  stockAccSelectAllAndClass(gid, classdata):Observable<any> {
    return this.httpClient.get(`${environment.port}/godownStock/stockAccCropSltAllClass/` + gid + "/" + classdata);
  }

  stockAccoToVariety(gID, cType, variety):Observable<any> {
    //console.log(variety);

    return this.httpClient.get(`${environment.port}/godownStock/allStockForClass/` + gID + "/" + cType + "/" + variety);
  }

  dataAccVarietySelectAll(gid, ct):Observable<any> {
    return this.httpClient.get(`${environment.port}/godownStock/dataAccVarietySelectAll/` + gid + "/" + ct);
  }

  receivedStockDetail(data):Observable<any>{
    return this.httpClient.post(`${environment.port}/godownStock/receivedStockDetail`,data);
  }

  dispatchedStockDetail(data):Observable<any> {
    return this.httpClient.post(`${environment.port}/godownStock/dispatchedStockDetail`,data)
  }


  totalStockDetail(data):Observable<any> {
     return this.httpClient.post(`${environment.port}/godownStock/totalStockDetail`,data);
    }

}
