import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GodownStockDetailsComponent } from './godown-stock-details.component';

describe('GodownStockDetailsComponent', () => {
  let component: GodownStockDetailsComponent;
  let fixture: ComponentFixture<GodownStockDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GodownStockDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GodownStockDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
