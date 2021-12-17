import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeStockFailComponent } from './make-stock-fail.component';

describe('MakeStockFailComponent', () => {
  let component: MakeStockFailComponent;
  let fixture: ComponentFixture<MakeStockFailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakeStockFailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakeStockFailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
