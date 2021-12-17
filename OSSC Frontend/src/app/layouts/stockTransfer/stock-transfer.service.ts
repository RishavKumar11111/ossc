import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockTransferService {

  constructor(private http: Http, private httpClient: HttpClient) { }

  getAllDistricts(spoCode): Observable<any> {
    return this.httpClient.get(`${environment.port}/spo/getAllDist/` + spoCode);
  }

  getAllGodowns(distSelected): Observable<any> {
    return this.httpClient.get(`${environment.port}/spo/getAllGodown/` + distSelected);
  }

  loadCrop(godownID): Observable<any> {
    return this.httpClient.get(`${environment.port}/spo/loadCrop/` + godownID)
  }

  loadVariety(godownIdForVarietyLoad, cropCode): Observable<any> {
    return this.httpClient.get(`${environment.port}/spo/loadVariety/` + godownIdForVarietyLoad + '/' + cropCode)
  }

  loadLot(godownId, cropCode, varietyCode): Observable<any> {
    return this.httpClient.get(`${environment.port}/spo/getAllLot/` + godownId + '/' + cropCode + '/' + varietyCode);
  }

  getAllSpo(): Observable<any> {
    return this.httpClient.get(`${environment.port}/spo/getAllSPOs`);
  }

  getAllSpoByIntra(spoCode): Observable<any> {
    return this.httpClient.get(`${environment.port}/spo/getAllSpoByIntra/` + spoCode)
  }

  getAllSpoByInter(spoCode): Observable<any> {
    return this.httpClient.get(`${environment.port}/spo/getAllSpoByInter/` + spoCode)

  }

  getSpoId(dist): Observable<any> {
    return this.httpClient.get(`${environment.port}/spo/getToSPOId/` + dist)
  }

  loadToGodown(dist): Observable<any> {
    return this.httpClient.get(`${environment.port}/spo/getAllToGowns/` + dist)
  }

  loadMaxBagNo(data): Observable<any> {
    return this.httpClient.post(`${environment.port}/spo/loadMaxBagNo`, data);
  }

  formTransferData(data, formDataForTrns, spoCode): Observable<any> {
    // var formData = {
    //   'fromDist': data.distSelected,
    //   'fromGodown': data.godownSelected.godown_ID,
    //   'fromLot': data.lotSelected.lot_Number,
    //   'noOfBags': data.noOfBagsEntered,
    //   'toSPO': data.spoSelected,
    //   'toDist': data.toDistSelected,
    //   'toGodown': data.toGodownSelected.godown_ID,
    //   'vehicleNo': data.vehicleNo,
    //   'sourceSPO': spoCode,
    //   'transferDate': data.transferDate
    // }
    var formData = []
    for (let i = 0; i < data.length; i++) {
      formData.push({
        'fromDist': formDataForTrns.distSelected,
        'fromGodown': formDataForTrns.godownSelected.godown_ID,
        'fromLot': data[i].lotSelected.lot_Number,
        'noOfBags': data[i].noOfBagsEntered,
        'toSPO': formDataForTrns.spoSelected,
        'toDist': formDataForTrns.toDistSelected,
        'toGodown': formDataForTrns.toGodownSelected.godown_ID,
        'vehicleNo': formDataForTrns.vehicleNo,
        'sourceSPO': spoCode,
        'transferDate': formDataForTrns.transferDate
      })
    }
    return this.httpClient.post(`${environment.port}/spo/stockTransData`, formData);
  }

  manualPrint(commonChallanNo:any){
    let data={
      commonChallanNo:commonChallanNo
    }
    return this.httpClient.post(`${environment.port}/spo/manualPrint`,data);
  }
}
