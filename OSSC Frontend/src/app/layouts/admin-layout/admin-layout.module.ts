import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { UserProfileComponent } from '../stockTransfer/user-profile.component';
import { GodownStockService } from 'app/layouts/godown-stock-details/godown-stock.service';


import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { GodownStockDetailsComponent } from 'app/layouts/godown-stock-details/godown-stock-details.component';
import { StockTransferService } from 'app/layouts/stockTransfer/stock-transfer.service';
import { TransitStatusService } from 'app/layouts/in-transit-Status/transit-status.service';
import { ReceiptComponent } from 'app/layouts/in-transit-Status/receipt.component';
import { StockForReceiptService } from 'app/layouts/stock-for-receipt/stock-for-receipt.service';
import { StockForReceiptComponent } from 'app/layouts/stock-for-receipt/stock-for-receipt.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { QuintalsPipe } from '../godown-stock-details/quintals.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { StockInwardComponent } from '../stock-inward/stock-inward.component';
import { GroupNamePipe } from '../stock-inward/group-name.pipe';
import { StockOutwardComponent } from '../stock-outward/stock-outward.component';
import { CirclePipe } from '../stock-inward/circle.pipe';
import { StockSellComponent } from '../stock-sell/stock-sell.component';
import { SaleReturnComponent } from '../sale-return/sale-return.component';
import { PurchaseReturnComponent } from '../purchase-return/purchase-return.component';
import { ReturnedAfterSellComponent } from '../returned-after-sell/returned-after-sell.component';
import { ReturnedAfterPurchaseComponent } from '../returned-after-purchase/returned-after-purchase.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginInterceptor } from 'app/auth/interceptor/login.interceptor';
import { MakeStockFailComponent } from '../make-lot-fail/make-stock-fail.component';
import { NgxSpinnerModule } from 'ngx-spinner';



@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatSortModule,
    MatDialogModule,
    MatSnackBarModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxSpinnerModule
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    GodownStockDetailsComponent,
    ReceiptComponent,
    StockForReceiptComponent,
    QuintalsPipe,
    StockInwardComponent,
    GroupNamePipe,
    StockOutwardComponent,
    CirclePipe,
    StockSellComponent,
    SaleReturnComponent,
    PurchaseReturnComponent,
    ReturnedAfterSellComponent,
    ReturnedAfterPurchaseComponent,
    MakeStockFailComponent
  ],
  providers: [GodownStockService, StockTransferService, TransitStatusService, StockForReceiptService, GroupNamePipe]
})

export class AdminLayoutModule { }
