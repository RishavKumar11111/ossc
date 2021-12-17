import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from 'environments/environment';

import * as FileSaver from 'file-saver';
import { Observable } from 'rxjs/Observable';
import * as XLSX from 'xlsx'

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class StockInwardService {

  constructor(private http:Http,private httpClient:HttpClient) { }

  getAllSpo():Observable<any>{
    return this.httpClient.get(`${environment.port}/report/getAllSpos`)
  }


  loadAllData(allDist,distData):Observable<any>{
   let data={
     spoData:allDist,
     distData:distData

   }
    return this.httpClient.post(`${environment.port}/report/loadAllData`,data)
  }

  deletePurchaseData(purchaseDataDelete):Observable<any>{
    return this.httpClient.post(`${environment.port}/report/purchaseDataDelete`,purchaseDataDelete)
  }

  // For export as excel
  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }


}
