import { Routes } from '@angular/router';

import { DashboardComponent } from '../dashboard/dashboard.component';
import { UserProfileComponent } from '../stockTransfer/user-profile.component';
import { GodownStockDetailsComponent } from 'app/layouts/godown-stock-details/godown-stock-details.component';
import { ReceiptComponent } from 'app/layouts/in-transit-Status/receipt.component';
import { StockForReceiptComponent } from 'app/layouts/stock-for-receipt/stock-for-receipt.component';
import { StockInwardComponent } from '../stock-inward/stock-inward.component';
import { StockOutwardComponent } from '../stock-outward/stock-outward.component';
import { StockSellComponent } from '../stock-sell/stock-sell.component';
import { SaleReturnComponent } from '../sale-return/sale-return.component';
import { PurchaseReturnComponent } from '../purchase-return/purchase-return.component';
import { ReturnedAfterSellComponent } from '../returned-after-sell/returned-after-sell.component';
import { ReturnedAfterPurchaseComponent } from '../returned-after-purchase/returned-after-purchase.component';
import { AuthGuardGuard } from 'app/auth/guard/auth-guard.guard';
import { StockDeficitComponent } from '../stock-deficit/stock-deficit.component';
import { MakeStockFailComponent } from '../make-lot-fail/make-stock-fail.component';

export const AdminLayoutRoutes: Routes = [

    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardGuard] },
    { path: 'stock-transfer', component: UserProfileComponent, canActivate: [AuthGuardGuard] },
    { path: 'stock-for-receipt', component: StockForReceiptComponent, canActivate: [AuthGuardGuard] },
    { path: 'stock-deficit', component: StockDeficitComponent, canActivate: [AuthGuardGuard] },
    { path: 'stock-sell', component: StockSellComponent, canActivate: [AuthGuardGuard] },
    { path: 'sale-return', component: SaleReturnComponent, canActivate: [AuthGuardGuard] },
    { path: 'purchase-return', component: PurchaseReturnComponent, canActivate: [AuthGuardGuard] },
    { path: 'lot-fail', component: MakeStockFailComponent, canActivate: [AuthGuardGuard] },
    {
        path: 'report',
        children: [{
            path: 'godown-stock-details',
            component: GodownStockDetailsComponent, canActivate: [AuthGuardGuard]
        }]
    },
    {
        path: 'report',
        children: [{
            path: 'stock-in-transit',
            component: ReceiptComponent, canActivate: [AuthGuardGuard]
        },
        {
            path: 'stock-inward-statement',
            component: StockInwardComponent, canActivate: [AuthGuardGuard]
        },
        {
            path: 'stock-outward-statement',
            component: StockOutwardComponent, canActivate: [AuthGuardGuard]
        },
        {
            path: 'returned-after-sale',
            component: ReturnedAfterSellComponent, canActivate: [AuthGuardGuard]
        },
        {
            path: 'returned-after-purchase',
            component: ReturnedAfterPurchaseComponent, canActivate: [AuthGuardGuard]
        }
        ]
    }

];
