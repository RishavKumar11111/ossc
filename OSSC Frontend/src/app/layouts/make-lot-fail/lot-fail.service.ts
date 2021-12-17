import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LotFailService {

  constructor(private http: Http) { }

  failALot(lotNo) {
    return this.http.get(`${environment.port}/lotFail/makeLotFail/`+lotNo)
  }

}
