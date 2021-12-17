import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockDeficitComponent } from './stock-deficit.component';

describe('StockDeficitComponent', () => {
  let component: StockDeficitComponent;
  let fixture: ComponentFixture<StockDeficitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockDeficitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockDeficitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
