import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockForReceiptComponent } from './stock-for-receipt.component';

describe('StockForReceiptComponent', () => {
  let component: StockForReceiptComponent;
  let fixture: ComponentFixture<StockForReceiptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockForReceiptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockForReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
