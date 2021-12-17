import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LotFailService } from './lot-fail.service';

@Component({
  selector: 'app-make-stock-fail',
  templateUrl: './make-stock-fail.component.html',
  styleUrls: ['./make-stock-fail.component.css']
})
export class MakeStockFailComponent implements OnInit {

  constructor(private lotFailServ: LotFailService, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  lotNo

  onSubmit() {
    if(confirm("Are you sure you want to fail the Lot ?")){
      this.lotFailServ.failALot(this.lotNo).subscribe(
        data => {
          if (data.json().result == 'success') {
            this.toastr.success('Updated Successfully', 'Success')
            this.lotNo = ''
          } else if (data.json().result == 'No Data') {
            this.toastr.warning("Lot Number not available", 'Warning')
          } else {
            this.toastr.error("Error")
          }
        },
        error => {
          this.toastr.error("Unexpected error", 'Error')
        }
      )
    }
    
  }

}
