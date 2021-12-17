import { TestBed } from '@angular/core/testing';

import { StockInwardService } from './stock-inward.service';

describe('StockInwardService', () => {
  let service: StockInwardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockInwardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
