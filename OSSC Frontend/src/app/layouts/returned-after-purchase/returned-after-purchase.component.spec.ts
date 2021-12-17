import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnedAfterPurchaseComponent } from './returned-after-purchase.component';

describe('ReturnedAfterPurchaseComponent', () => {
  let component: ReturnedAfterPurchaseComponent;
  let fixture: ComponentFixture<ReturnedAfterPurchaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturnedAfterPurchaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnedAfterPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
