import { TestBed } from '@angular/core/testing';

import { StockSellService } from './stock-sell.service';

describe('StockSellService', () => {
  let service: StockSellService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockSellService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
