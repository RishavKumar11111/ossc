import { TestBed } from '@angular/core/testing';

import { StockOutwardService } from './stock-outward.service';

describe('StockOutwardService', () => {
  let service: StockOutwardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockOutwardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
