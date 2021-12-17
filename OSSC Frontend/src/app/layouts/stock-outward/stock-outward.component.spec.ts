import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockOutwardComponent } from './stock-outward.component';

describe('StockOutwardComponent', () => {
  let component: StockOutwardComponent;
  let fixture: ComponentFixture<StockOutwardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockOutwardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockOutwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
