import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockInwardComponent } from './stock-inward.component';

describe('StockInwardComponent', () => {
  let component: StockInwardComponent;
  let fixture: ComponentFixture<StockInwardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockInwardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockInwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
