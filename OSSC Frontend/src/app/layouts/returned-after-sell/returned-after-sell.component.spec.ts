import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnedAfterSellComponent } from './returned-after-sell.component';

describe('ReturnedAfterSellComponent', () => {
  let component: ReturnedAfterSellComponent;
  let fixture: ComponentFixture<ReturnedAfterSellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturnedAfterSellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnedAfterSellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
